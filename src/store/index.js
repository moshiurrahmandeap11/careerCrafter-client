// store.js
import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from '../redux-slices/jobsSlice';
import networkReducer from '../redux-slices/networkSlice';
import messagesReducer from '../redux-slices/messagesSlice';
import notificationsReducer from '../redux-slices/notificationsSlice';
import premiumReducer from '../redux-slices/premiumSlice'; // Add this line

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    network: networkReducer,
    messages: messagesReducer,
    notifications: notificationsReducer,
    premium: premiumReducer, // Add this line
  },
});

export default store;