import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosIntense from '../hooks/AxiosIntense/axiosIntense';


// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (userEmail) => {
    const response = await axiosIntense.get(`/notifications/user/${userEmail}`);
    return response.data;
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId) => {
    const response = await axiosIntense.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (userEmail) => {
    const response = await axiosIntense.patch(`/notifications/user/${userEmail}/read-all`);
    return response.data;
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId) => {
    await axiosIntense.delete(`/notifications/${notificationId}`);
    return notificationId;
  }
);

export const clearAllNotifications = createAsyncThunk(
  'notifications/clearAll',
  async (userEmail) => {
    const response = await axiosIntense.delete(`/notifications/user/${userEmail}`);
    return response.data;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    filter: 'all'
  },
  reducers: {
    setNotificationFilter: (state, action) => {
      state.filter = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications || [];
        state.unreadCount = action.payload.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Mark as Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n._id === action.payload._id);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark All as Read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedNotification = state.notifications.find(n => n._id === action.payload);
        if (deletedNotification && !deletedNotification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
      })
      // Clear All
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      });
  }
});

export const {
  setNotificationFilter,
  addNotification,
  clearError
} = notificationsSlice.actions;

export default notificationsSlice.reducer;