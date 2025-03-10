import { baseApiSlice } from "../baseApiSlice";
import { setCredentials, logOut } from "./authSlice";

export const authApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
        credentials: "include",
      }),
      transformResponse: (response) => ({
        ...response,
        token: response.token, // Lưu JWT từ server
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),

    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    instructorRegister: builder.mutation({
      query: (instructorData) => ({
        url: "/auth/instructor/register",
        method: "POST",
        body: { ...instructorData },
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(baseApiSlice.util.resetApiState());
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: `/auth/verify-email?token=${token}`,
        method: "GET",
      }),
    }),

    // API gửi lại email xác minh
    resendVerificationEmail: builder.mutation({
      query: (email) => ({
        url: `/auth/resend-verification?email=${email}`,
        method: "POST",
      }),
    }),

    checkEmailVerification: builder.query({
      query: (email) => `/auth/check-email-verification?email=${email}`,
      method: "GET",
    }),


    checkEmailExist: builder.query({
      query: (email) => `/auth/check-email?email=${email}`,
    }),

    checkUsernameExist: builder.query({
      query: (username) => `/auth/check-username?username=${username}`,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useInstructorRegisterMutation,
  useLogoutMutation,
  useVerifyEmailMutation, 
  useResendVerificationEmailMutation,
  useLazyCheckEmailVerificationQuery,
  useLazyCheckEmailExistQuery,
  useLazyCheckUsernameExistQuery,
} = authApiSlice;
