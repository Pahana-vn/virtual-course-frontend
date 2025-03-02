import { baseApiSlice } from "../baseApiSlice";

export const fileApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadFile: builder.mutation({
            query: ({ file, type }) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', type);

                return {
                    url: '/api/files/upload',
                    method: 'POST',
                    body: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                      },
                };
            },
        }),
        checkFileExists: builder.query({
            query: ({ type, filename }) => `/api/files/exists/${type}/${filename}`,
        }),
    }),
});

export const { useUploadFileMutation, useCheckFileExistsQuery } = fileApiSlice;