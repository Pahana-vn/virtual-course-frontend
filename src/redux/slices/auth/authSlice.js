import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    studentId: localStorage.getItem("studentId") || null,
    instructorId: localStorage.getItem("instructorId") || null,
    accountId: localStorage.getItem("accountId") || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { accountId, username, token, instructorId, studentId, roles } =
        action.payload;
      state.user = { accountId, username, roles };
      state.token = token;
      state.instructorId = instructorId;
      state.studentId = studentId;
      state.accountId = accountId;
      // localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", state.token);
      localStorage.setItem("instructorId", state.instructorId);
      localStorage.setItem("studentId", state.studentId);
      localStorage.setItem("accountId", state.accountId);
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.instructorId = null;
      state.studentId = null;
      state.accountId = null;

      // localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("instructorId");
      localStorage.removeItem("studentId");
      localStorage.removeItem("accountId");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentInstructor = (state) => state.auth.instructorId;
export const selectCurrentStudent = (state) => state.auth.studentId;
export const selectCurrentAccount = (state) => state.auth.accountId;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRoles = (state) => state.auth.user?.roles;
