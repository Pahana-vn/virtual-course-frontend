import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    education: [], // Initial state for education
  },
  reducers: {
    addEducation: (state, action) => {
      state.education.push(action.payload);
    },
    updateEducation: (state, action) => {
      const index = state.education.findIndex(
        (edu) => edu.id === action.payload.id
      );
      if (index !== -1) {
        state.education[index] = action.payload;
      }
    },
    deleteEducation: (state, action) => {
      state.education = state.education.filter(
        (edu) => edu.id !== action.payload.id
      );
    },
  },
});

export const { addEducation, updateEducation, deleteEducation } =
  profileSlice.actions;
