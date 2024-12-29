import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from './authSlice'
import RestAPIService from '../../../../features/RestAPIService'

const baseQuery = fetchBaseQuery({
    baseUrl: RestAPIService.URL_REST_API,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    },
    timeout: 5000
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === '403') {
        // send refresh token to get new access token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        if (refreshResult?.data) {
            const user = api.getState().auth.user
            // store the new token
            api.dispatch(setCredentials({...refreshResult.data, user}))
            // retry the original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
        }
    }
    return result
}


export const baseApiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (() => ({})),
    tagTypes: ['Instructor', 'Student']
})
export const { resetApiState } = baseApiSlice;