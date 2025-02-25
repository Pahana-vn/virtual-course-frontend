import { baseApiSlice } from "../baseApiSlice";
export const instructorApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllInstructors: builder.query({
      query: () => ({
        url: `/instructors`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Instructor", id })),
              { type: "Instructor", id: "LIST" },
            ]
          : [{ type: "Instructor", id: "LIST" }],
    }),

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
    updateInstructorProfile: builder.mutation({
      query: ({ id, profileData }) => ({
        url: `/instructors/${id}/instructor-profile`,
        method: "PUT",
        body: profileData,
      }),
    }),
  }),
});

export const {
  useGetAllInstructorsQuery,
  useGetInstructorByIdQuery,
  useInstructorStatisticsQuery,
  useInstructorAvatarQuery,
  useInstructorDetailsQuery,
  useInstructorProfileQuery,
  useUpdateInstructorProfileMutation,
} = instructorApiSlice;
