import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await fetch('/data/notifications.json');
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    return response.json();
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return notificationId;
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return notificationId;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    activeFilter: 'all',
    searchTerm: '',
    showSettings: false,
    showMobileFilters: false,
    notificationSettings: {
      messages: true,
      connectionRequests: true,
      reactions: true,
      mentions: true,
      jobAlerts: true,
      recommendations: true
    },
    unreadCount: 0
  },
  reducers: {
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setShowSettings: (state, action) => {
      state.showSettings = action.payload;
    },
    setShowMobileFilters: (state, action) => {
      state.showMobileFilters = action.payload;
    },
    updateNotificationSettings: (state, action) => {
      state.notificationSettings = {
        ...state.notificationSettings,
        ...action.payload
      };
    },
    toggleNotificationSetting: (state, action) => {
      const setting = action.payload;
      state.notificationSettings[setting] = !state.notificationSettings[setting];
    },
    clearError: (state) => {
      state.error = null;
    },
    calculateUnreadCount: (state) => {
      state.unreadCount = state.notifications.filter(notification => !notification.read).length;
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
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(notification => !notification.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Mark as Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark All as Read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          read: true
        }));
        state.unreadCount = 0;
      })
      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification && !notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(notification => notification.id !== notificationId);
      });
  }
});

export const {
  setActiveFilter,
  setSearchTerm,
  setShowSettings,
  setShowMobileFilters,
  updateNotificationSettings,
  toggleNotificationSetting,
  clearError,
  calculateUnreadCount
} = notificationsSlice.actions;

export default notificationsSlice.reducer;