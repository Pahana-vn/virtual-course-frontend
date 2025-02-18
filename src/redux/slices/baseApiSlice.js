import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logOut } from './auth/authSlice'
import RestAPIService from '../../features/RestAPIService'

const baseQuery = fetchBaseQuery({
    baseUrl: RestAPIService.URL_REST_API,
    credentials: 'include',
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
    if (result?.error?.status === 403) {
        const state = api.getState();
        const token = state.auth.token;

        if (token) {
            console.warn("🚨 Token không hợp lệ, nhưng vẫn tồn tại => Chỉ thông báo lỗi, không logout ngay!");
        } else {
            console.warn("🚨 Không có token, đăng xuất người dùng!");
            api.dispatch(logOut());
        }
    }
    return result
}


export const baseApiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (() => ({})),
    tagTypes: ['Instructor', 'Student', 'Test', 'Courses']
})
export const { resetApiState } = baseApiSlice;