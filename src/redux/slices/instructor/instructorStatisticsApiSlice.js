import { baseApiSlice } from "../baseApiSlice";

export const InstructorStatisticsApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstructorStatistics: builder.query({
      query: ({ instructorId }) =>
        `/instructors/${instructorId}/instructor-statistics`,
    }),
  }),
  tagTypes: [],
});

export const {
  
  useGetInstructorStatisticsQuery,

} = InstructorStatisticsApiSlice;
