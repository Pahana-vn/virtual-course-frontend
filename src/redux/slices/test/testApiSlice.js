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
        result ? [{ type: "Test", id: `${id}-${courseId}` }] : [], // Tag cho bài test của giảng viên và khóa học
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
      invalidatesTags: (result, error, { courseId, testId }) => [
        { type: "Test", id: courseId }, // Invalidates danh sách bài test của khóa học
        ...(testId ? [{ type: "Test", id: testId }] : []), // Invalidates bài test cụ thể nếu có testId
      ],
    }),
  }),
});

// Export hooks để sử dụng trong component
export const { 
  useGetTestsByCourseQuery,
  useGetInstructorCourseTestsQuery,
  useManageTestsMutation 
} = testApiSlice;
