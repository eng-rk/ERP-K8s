import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import auxReducer from './slices/auxSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    aux: auxReducer,
  },
});

export default store;
