import { baseApiSlice } from "../baseApiSlice";
export const courseApiSlice = baseApiSlice.injectEndpoints({
    endpoints: builder => ({
        getCourses: builder.query({
            query: () => ({
                url: `/courses/`
            }),
            providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Courses", id })),
              { type: "Courses", id: "LIST" },
            ]
          : [{ type: "Courses", id: "LIST" }],
        }),
        
        getCoursesByInstructorId: builder.query({
            query: ({ instructorId }) => ({
                url: `/courses/${instructorId}/instructor-courses`,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: "InstructorCourses", id })),
                        { type: "InstructorCourses", id: "LIST" }
                    ]
                    : [{ type: "InstructorCourses", id: "LIST" }],
        }),
        getInstructorCourses: builder.query({
            query: ({ instructorId, status }) => ({
                url: `/courses/${instructorId}/instructor-courses?status=${status}`,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: "InstructorCourses", id })),
                        { type: "InstructorCourses", id: "LIST" }
                    ]
                    : [{ type: "InstructorCourses", id: "LIST" }],
        }),
        getCourseById: builder.query({
            query: ({ id }) => ({
                url: `/courses/${id}`,
            }),
            providesTags: (result, error, id) => [{ type: "Courses", id }],          
        }),
        createCourse: builder.mutation({
            query: ({courseData}) => ({
                url: "/courses",
                method: 'POST',
                body: courseData,
            }),
            invalidatesTags: [
                { type: "Courses", id: "LIST" },
                { type: "InstructorCourses", id: "LIST" },
            ],
        }),
        updateCourse: builder.mutation({
            query: ({id, courseData}) => ({
                url: `/courses/${id}`,
                method: 'PUT',
                body: courseData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Courses", id },
                { type: "Courses", id: "LIST" },
                { type: "InstructorCourses", id: "LIST" },
            ],
        }),
        deleteCourse: builder.mutation({
            query: ({ id }) => ({
                url: `/courses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Courses", id },
                { type: "Courses", id: "LIST" },
                { type: "InstructorCourses", id: "LIST" }
            ],
        }),
        getCourseDetailsById: builder.query({
            query: ({ id }) => ({
                url: `/courses/${id}/course-details`,
            }),
            providesTags: (result, error, id) => [{ type: "Courses", id }],
        }),
    })
})

export const {
    useGetCoursesQuery,
    useGetInstructorCoursesQuery,
    useGetCoursesByInstructorIdQuery,
    useGetCourseByIdQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useGetCourseDetailsByIdQuery
} = courseApiSlice