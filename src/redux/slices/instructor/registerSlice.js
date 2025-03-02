import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accountInfo: {},
  personalInfo: {},
  socialInfo: {},
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setAccountInfo: (state, action) => {
      state.accountInfo = { ...state.accountInfo, ...action.payload };
    },
    setPersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    setSocialInfo: (state, action) => {
      state.socialInfo = { ...state.socialInfo, ...action.payload };
    },
    resetRegister: () => initialState,
  },
});

export const { setAccountInfo, setPersonalInfo, setSocialInfo, resetRegister } =
  registerSlice.actions;
export default registerSlice.reducer;
