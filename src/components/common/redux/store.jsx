import { configureStore } from '@reduxjs/toolkit';

import { baseApiSlice } from './slices/baseApiSlice';
import sidebarSlice from './slices/sidebarSlice';
import authReducer from './slices/authSlice';
import categorySlice from "./slices/categorySlice";
import courseReducer from "./slices/courseSlice";

const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    auth: authReducer,
    sidebarSlice: sidebarSlice,
    categories: categorySlice,
    course: courseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApiSlice.middleware),  // Thêm middleware của baseApiSlice
    devTools: true
});

export default store;
