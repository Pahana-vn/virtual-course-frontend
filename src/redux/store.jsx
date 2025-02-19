import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { baseApiSlice } from './slices/baseApiSlice';
import sidebarSlice from './slices/other/sidebarSlice';
import authReducer from './slices/auth/authSlice';
import categorySlice from "./slices/course/categorySlice";
import courseReducer from "./slices/course/courseSlice";
import { questionApiSlice } from "./slices/course/questionApiSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    [questionApiSlice.reducerPath]: questionApiSlice.reducer,
    auth: persistedReducer,
    sidebarSlice: sidebarSlice,
    categories: categorySlice,
    course: courseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApiSlice.middleware),  // Thêm middleware của baseApiSlice
    devTools: true
});

export const persistor = persistStore(store);
export default store;
