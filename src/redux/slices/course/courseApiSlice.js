import { baseApiSlice } from "../baseApiSlice";
export const courseApiSlice = baseApiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllCourses: builder.query({
            query: () => ({
                url: `/courses`
            }),
            providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Courses", id })),
              { type: "Courses", id: "LIST" },
            ]
          : [{ type: "Courses", id: "LIST" }],
          
        }),

        getInstructorCoursesPurchasedByStudent: builder.query({
            query: ({ instructorId }) => ({
                url: `/courses/instructor/${instructorId}/purchased`,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: "InstructorCourses", id })),
                        { type: "InstructorCourses", id: "LIST" },
                    ]
                    : [{ type: "InstructorCourses", id: "LIST" }],
        }),

        getFilteredCourses: builder.query({
            query: ({ categoryId, instructorId, minPrice, maxPrice, search, page = 0, size = 10 }) => {
                let queryParams = new URLSearchParams();
                if (categoryId) queryParams.append("categoryId", categoryId);
                if (instructorId) queryParams.append("instructorId", instructorId);
                if (minPrice) queryParams.append("minPrice", minPrice);
                if (maxPrice) queryParams.append("maxPrice", maxPrice);
                if (search) queryParams.append("search", search);
                queryParams.append("page", page);
                queryParams.append("size", size);

                return {
                    url: `/courses/filter?${queryParams.toString()}`,
                };
            },
            providesTags: (result) =>
                result?.content
                    ? [
                        ...result.content.map(({ id }) => ({ type: "Courses", id })),
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
    useAllGetCoursesQuery,
    useGetFilteredCoursesQuery,
    useGetInstructorCoursesPurchasedByStudentQuery,
    useGetInstructorCoursesQuery,
    useGetCoursesByInstructorIdQuery,
    useGetCourseByIdQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useGetCourseDetailsByIdQuery
} = courseApiSlice