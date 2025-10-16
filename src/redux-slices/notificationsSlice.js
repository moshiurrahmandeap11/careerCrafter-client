import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ========================
// Async Thunks
// ========================

// Fetch notifications from backend
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/v1/notifications");
      return Array.isArray(res.data) ? res.data : []; // Ensure array
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Mark a single notification as read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (id, { rejectWithValue }) => {
    try {
      await axios.patch(`/v1/notifications/${id}/read`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllNotificationsAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`/v1/notifications/mark-all-read`);
      return res.data.modifiedCount;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete a notification
export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/v1/notifications/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ========================
// Initial State
// ========================
const initialState = {
  notifications: [],         // Always an array
  loading: false,
  error: null,
  activeFilter: "all",
  searchTerm: "",
  showSettings: false,
  showMobileFilters: false,
  notificationSettings: {
    email: true,
    push: true,
  },
  unreadCount: 0,
};

// ========================
// Slice
// ========================
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
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
    toggleNotificationSetting: (state, action) => {
      const key = action.payload;
      state.notificationSettings[key] = !state.notificationSettings[key];
    },
    clearError: (state) => {
      state.error = null;
    },
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
        state.notifications = Array.isArray(action.payload) ? action.payload : [];
        state.unreadCount = (state.notifications || []).filter((n) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark Single Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const id = action.payload;
        const notif = (state.notifications || []).find((n) => n._id === id);
        if (notif) notif.read = true;
        state.unreadCount = (state.notifications || []).filter((n) => !n.read).length;
      })

      // Mark All Read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        (state.notifications || []).forEach((n) => (n.read = true));
        state.unreadCount = 0;
      })

      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = (state.notifications || []).filter(
          (n) => n._id !== action.payload
        );
        state.unreadCount = (state.notifications || []).filter((n) => !n.read).length;
      });
  },
});

// ========================
// Actions
// ========================
export const {
  setActiveFilter,
  setSearchTerm,
  setShowSettings,
  setShowMobileFilters,
  toggleNotificationSetting,
  clearError,
  addNotification,
} = notificationsSlice.actions;

// ========================
// Reducer
// ========================
export default notificationsSlice.reducer;
