import { baseApiSlice } from "../baseApiSlice";

export const categoryApiSlice = baseApiSlice.injectEndpoints({
    endpoints: builder => ({
        getCategories: builder.query({
            query: () => ({
                url: `/categories`
            }),
        }),
    })
})

export const {
    useGetCategoriesQuery,
    
} = categoryApiSlice