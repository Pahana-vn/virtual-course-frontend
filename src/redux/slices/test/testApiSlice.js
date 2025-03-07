import { baseApiSlice } from "../baseApiSlice";

export const testApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy danh sách bài test theo khóa học
    getTestsByCourse: builder.query({
      query: ({ courseId }) => ({
        url: `/tests/course/${courseId}`,
      }),
      providesTags: (result, error, { courseId }) =>
        result
          ? [
              { type: "Test", id: courseId }, // Tag cho khóa học
              ...result.map(({ id }) => ({ type: "Test", id })), // Tag cho từng bài test
            ]
          : [{ type: "Test", id: courseId }],
    }),

    // Lấy bài test của giảng viên theo khóa học
    getInstructorCourseTests: builder.query({
      query: ({ id, courseId }) => ({
        url: `/instructors/${id}/courses/${courseId}/tests`,
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        return newItems; // Sử dụng dữ liệu mới thay cho dữ liệu cũ
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg; // Buộc refetch khi có sự thay đổi ở currentArg
      },
      providesTags: (result, error, { id, courseId }) =>
    result
      ? [
          { type: "Test", id: `${id}-${courseId}` }, // Invalidate danh sách bài test
          ...result.map(({ id: testId }) => ({ type: "Test", id: testId })), // Invalidate từng bài test cụ thể
        ]
      : [{ type: "Test", id: `${id}-${courseId}` }],
    }),

    // Cập nhật trạng thái isFinalTest cho bài test
    updateFinalTestStatus: builder.mutation({
      query: ({ testId, isFinalTest }) => ({
        url: `/tests/${testId}/final-test`,
        method: "PUT",
        body: { isFinalTest },
      }),
      invalidatesTags: (result, error, { testId }) => [{ type: "Test", id: testId }],
    }),

    getTestSubmissions: builder.query({
      query: ({ testId }) => `/tests/${testId}/submissions`,
    }),

    // Thêm, sửa, xóa bài test
    manageTests: builder.mutation({
      query: ({ courseId, testId, test, method }) => {
        let url = `/tests/course/${courseId}`;
        if (method === 'PUT') {
          url = `/tests/${testId}`; // Cập nhật bài test
        } else if (method === 'DELETE') {
          url = `/tests/${testId}`; // Xóa bài test
        }
        return {
          url,
          method,
          body: method !== 'DELETE' ? test : undefined, // Gửi dữ liệu body khi không phải DELETE
        };
      },
      invalidatesTags: (result, error, { courseId, testId, method }) => {
    if (method === "PUT") {
      return [
        { type: "Test", id: testId }, // Invalidate bài test cụ thể
        { type: "Test", id: courseId }, // Invalidate danh sách bài test của khóa học
      ];
    } else if (method === "DELETE") {
      return [
        { type: "Test", id: testId }, // Xóa cache của bài test bị xóa
        { type: "Test", id: courseId },
      ];
    } else {
      return [{ type: "Test", id: courseId }];
    }
  },
    }),
  }),
});

// Export hooks để sử dụng trong component
export const { 
  useGetTestsByCourseQuery,
  useGetInstructorCourseTestsQuery,
  useUpdateFinalTestStatusMutation,
  useLazyGetTestSubmissionsQuery,
  useManageTestsMutation 
} = testApiSlice;
