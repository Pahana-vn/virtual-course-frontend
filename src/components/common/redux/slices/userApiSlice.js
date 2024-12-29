import { baseApiSlice } from "./authApiSlice";
export const userApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    profile: builder.query({
      query: ({ id, username, reset }) => ({
        url: `/user/${id}/profile/${username}`,
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (newItems) => {
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const { useProfileQuery } = userApiSlice;
