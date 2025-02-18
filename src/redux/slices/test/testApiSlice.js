import { baseApiSlice } from "../baseApiSlice";

export const testApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTestsByCourse: builder.query({
      query: ({ courseId }) => ({
        url: `/tests/course/${courseId}`,
      }),
      providesTags: (result, error, { courseId }) =>
        result
          ? [
              { type: "Test", id: courseId },
              ...result.map(({ id }) => ({ type: "Test", id })),
            ]
          : [{ type: "Test", id: courseId }],
    }),
    manageTests: builder.mutation({
        query: ({ courseId, testId, test, method }) => {
          let url = `/tests/course/${courseId}`;
          if (method === 'PUT') {
            url = `/tests/${testId}`;
          } else if (method === 'DELETE') {
            url = `/tests/${testId}`;
          }
          return {
            url,
            method,
            body: method !== 'DELETE' ? test : undefined,
          };
        },
        invalidatesTags: (result, error, { courseId, testId }) => [
          { type: "Test", id: courseId }, 
          ...(testId ? [{ type: "Test", id: testId }] : []),
      ],
      }),
  }),
});

export const { useGetTestsByCourseQuery, useManageTestsMutation } =
  testApiSlice;
