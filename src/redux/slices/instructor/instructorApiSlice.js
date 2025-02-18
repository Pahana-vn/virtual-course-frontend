import { baseApiSlice } from "../baseApiSlice";
export const instructorApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstructorById: builder.query({
      query: ({ id }) => ({
        url: `/instructors/${id}`,
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    instructorStatistics: builder.query({
      query: ({ id }) => ({
        url: `/instructors/${id}/instructor-statistics`,
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    // Thêm endpoint để lấy avatar
    instructorAvatar: builder.query({
      query: ({ accountId }) => ({
        url: `/auth/${accountId}/instructor-avatar`,
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: (result, error, { id }) => [{ type: "Instructor", id }],
    }),
    instructorDetails: builder.query({
      query: ({ id }) => ({
        url: `/instructors/${id}/instructor-details`,
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: (result, error, { id }) => [{ type: "Instructor", id }],
    }),
    instructorProfile: builder.query({
      query: ({ id }) => ({
        url: `/instructors/${id}/instructor-profile`,
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    getInstructorCourseTests: builder.query({
      query: ({ instructorId, courseId }) => ({
        url: `/instructors/${instructorId}/courses/${courseId}/tests`,
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems) => {
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: (result, error, { instructorId, courseId }) =>
        result ? [{ type: "Test", id: `${instructorId}-${courseId}` }] : [],
    }),
  }),
});

export const {
  useGetInstructorByIdQuery,
  useInstructorStatisticsQuery,
  useInstructorAvatarQuery,
  useInstructorDetailsQuery,
  useInstructorProfileQuery,
  useGetInstructorCourseTestsQuery,
} = instructorApiSlice;
