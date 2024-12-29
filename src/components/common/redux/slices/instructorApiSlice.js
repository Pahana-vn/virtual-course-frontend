import { baseApiSlice } from "./baseApiSlice";
export const instructorApiSlice = baseApiSlice.injectEndpoints({
    endpoints: builder => ({
        instructors: builder.query({
            query: ({id}) => ({
                url: `/instructors/${id}`
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            // Always merge incoming data to the cache entry
            merge: (currentCache, newItems) => {
                return newItems;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg
            },
        }),
        instructorStatistics: builder.query({
            query: ({id}) => ({
                url: `/instructors/${id}/statistics`,
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            // Always merge incoming data to the cache entry
            merge: (currentCache, newItems) => {
                return newItems;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg
            },
        }),
        instructorCourses: builder.query({
            query: ({id}) => ({
                url: `/instructors/${id}/courses`,
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            // Always merge incoming data to the cache entry
            merge: (currentCache, newItems) => {
                return newItems;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg
            },
        }),
         // Thêm endpoint để lấy avatar
        instructorAvatar: builder.query({
            query: ({ id }) => ({
                url: `/instructors/${id}/avatar`,
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
        createCourse: builder.mutation({
            query: ({courseData}) => ({
                url: "/instructors/courses",
                method: 'POST',
                body: courseData,
            }),
        }),
    })
})

export const {
    useInstructorsQuery,
    useInstructorStatisticsQuery,
    useInstructorCoursesQuery,
    useInstructorAvatarQuery,
    useCreateCourseMutation,
} = instructorApiSlice