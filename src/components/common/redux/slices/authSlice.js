import { createSlice } from "@reduxjs/toolkit";
import { resetApiState } from "./baseApiSlice";
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null },
  reducers: {
    setCredentials: (state, action) => {
      console.log("Action payload:", action.payload);
      const { id, username, fullname, email, avatar, createdAt, roles, token } =
        action.payload;
      state.user = { id, username, fullname, email, avatar, createdAt, roles };
      state.token = token;
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;

      state.asyncDispatch(resetApiState());
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRoles = (state) => state.auth.user?.roles;
