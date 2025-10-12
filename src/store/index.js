// store.js
import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from '../redux-slices/jobsSlice';
import networkReducer from '../redux-slices/networkSlice';
import messagesReducer from '../redux-slices/messagesSlice';
import notificationsReducer from '../redux-slices/notificationsSlice';
import premiumReducer from '../redux-slices/premiumSlice';
import resumeReducer from '../redux-slices/resumeSlice';
import resumeCheckReducer from '../redux-slices/resumeCheckSlice';
import mockInterviewReducer from '../redux-slices/mockInterviewSlice';

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    network: networkReducer,
    messages: messagesReducer,
    notifications: notificationsReducer,
    premium: premiumReducer,
    resume: resumeReducer,
    resumeCheck: resumeCheckReducer,
    mockInterview: mockInterviewReducer
  },
});

export default store;