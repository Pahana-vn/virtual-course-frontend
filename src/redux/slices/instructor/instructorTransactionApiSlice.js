import { baseApiSlice } from "../baseApiSlice";

export const InstructorWithdrawalApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    requestWithdrawal: builder.mutation({
      query: (withdrawalData) => ({
        url: "/instructor-transaction/request",
        method: "POST",
        params: withdrawalData,
      }),
      invalidatesTags: ["InstructorTransactions"],
    }),
    getInstructorWithdrawals: builder.query({
      query: () => ({
        url: "/instructor-transaction/withdrawals",
        method: "GET",
      }),
      providesTags: ["InstructorTransactions"],
    }),

    getInstructorDeposits: builder.query({
      query: () => ({
        url: "/instructor-transaction/deposits",
        method: "GET",
      }),
      providesTags: ["InstructorTransactions"],
    }),

    getAllInstructorTransactions: builder.query({
      query: () => ({
        url: "/instructor-transaction/all",
        method: "GET",
      }),
      providesTags: ["InstructorTransactions"],
    }),
  }),
  tagTypes: ["InstructorTransactions"],
});

export const {
    useRequestWithdrawalMutation,
    useGetInstructorWithdrawalsQuery,
    useGetInstructorDepositsQuery,
    useGetAllInstructorTransactionsQuery,
} = InstructorWithdrawalApiSlice;
