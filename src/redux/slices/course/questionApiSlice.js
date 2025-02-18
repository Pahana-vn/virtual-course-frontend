import { baseApiSlice } from "../baseApiSlice";

export const questionApiSlice = baseApiSlice.injectEndpoints({
    endpoints: builder => ({
        getQuestionsByCourse: builder.query({
            query: ({ courseId }) => ({
                url: `/questions/course/${courseId}`,
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
    }),
});

export const { useGetQuestionsByCourseQuery } = questionApiSlice;
