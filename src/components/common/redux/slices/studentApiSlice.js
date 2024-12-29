import { baseApiSlice } from "./baseApiSlice";
export const studentApiSlice = baseApiSlice.injectEndpoints({
    endpoints: builder => ({
        students: builder.query({
            query: ({id}) => ({
                url: `/students/${id}`
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
        studentAvatar: builder.query({
            query: ({ id }) => ({
                url: `/students/${id}/avatar`,
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
            providesTags: (result, error, { id }) => [{ type: "StudentAvatar", id }],
        }),
        
    })
})

export const {
    useStudentsQuery,
    useStudentAvatarQuery,
} = studentApiSlice