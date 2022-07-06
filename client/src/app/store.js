import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import fileReducer from '../features/files/fileSlice'
import homeReducer from '../features/Home/homeSlice';

export const store = configureStore({
  reducer: {
    auth:authReducer,
    file:fileReducer,
    home:homeReducer,
  },
});
