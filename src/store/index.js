// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from '../redux-slices/jobsSlice';

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
  },
});

export default store;