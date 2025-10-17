import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk to fetch all users for connection
export const fetchAllConnectedUsers = createAsyncThunk(
  'network/fetchAllConnectedUsers',
  async ({ email, axiosSecure }, { rejectWithValue }) => {
    try {
      const res = await axiosSecure.get(`/network/all-connect-users?email=${email}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch suggested users
export const fetchSuggestedUsers = createAsyncThunk(
  'network/fetchSuggestedUsers',
  async ({ email, axiosSecure }, { rejectWithValue }) => {
    try {
      const res = await axiosSecure.get(`/network/suggestion-connect?email=${email}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to send connection request
export const sendConnectionRequest = createAsyncThunk(
  'network/sendConnectionRequest',
  async ({ senderEmail, receiverEmail, axiosSecure }, { rejectWithValue }) => {
    try {
      const res = await axiosSecure.post("/network/send-connect-request", {
        senderEmail,
        receiverEmail,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch pending requests
export const fetchPendingRequests = createAsyncThunk(
  'network/fetchPendingRequests',
  async ({ email, axiosSecure }, { rejectWithValue }) => {
    try {
      const res = await axiosSecure.get(`/network/pending-requests?email=${email}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to accept connection request
export const acceptConnectionRequest = createAsyncThunk(
  'network/acceptConnectionRequest',
  async ({ requestId, senderEmail, receiverEmail, axiosSecure }, { rejectWithValue }) => {
    try {
      const res = await axiosSecure.post("/network/accept-request", {
        requestId,
        senderEmail,
        receiverEmail,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to ignore connection request
export const ignoreConnectionRequest = createAsyncThunk(
  'network/ignoreConnectionRequest',
  async ({ requestId, senderEmail, receiverEmail, axiosSecure }, { rejectWithValue }) => {
    try {
      const res = await axiosSecure.post("/network/ignore-request", {
        requestId,
        senderEmail,
        receiverEmail,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to withdraw connection request
export const withdrawConnectionRequest = createAsyncThunk(
  'network/withdrawConnectionRequest',
  async ({ requestId, senderEmail, axiosSecure }, { rejectWithValue }) => {
    try {
      const res = await axiosSecure.delete("/network/withdraw-request", {
        data: { requestId, senderEmail }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch user connections
export const fetchUserConnections = createAsyncThunk(
  'network/fetchUserConnections',
  async ({ email, axiosSecure }, { rejectWithValue }) => {
    try {
      const res = await axiosSecure.get(`/network/connections?email=${email}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to fetch sent requests
export const fetchSentRequests = createAsyncThunk(
  'network/fetchSentRequests',
  async ({ email, axiosSecure }, { rejectWithValue }) => {
    try {
      const res = await axiosSecure.get(`/network/sent-requests?email=${email}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk to remove connection
export const removeConnection = createAsyncThunk(
  'network/removeConnection',
  async ({ connectionId, userEmail, axiosSecure }, { rejectWithValue }) => {
    try {
      const res = await axiosSecure.delete(`/network/connections/${connectionId}`, {
        data: { userEmail }
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const networkSlice = createSlice({
  name: 'network',
  initialState: {
    // Loading states
    isLoading: false,
    isActionLoading: false,
    
    // Data states
    users: [],
    suggestedUsers: [],
    pendingRequests: [],
    connections: [],
    sentRequests: [],
    
    // Error state
    error: null,
    
    // Success messages
    successMessage: null,
  },
  reducers: {
    // Remove user from list after connection request
    removeUser: (state, action) => {
      state.users = state.users.filter(user => user.email !== action.payload);
      state.suggestedUsers = state.suggestedUsers.filter(user => user.email !== action.payload);
    },
    
    // Remove pending request after action
    removePendingRequest: (state, action) => {
      state.pendingRequests = state.pendingRequests.filter(request => request._id !== action.payload);
    },
    
    // Remove sent request after action
    removeSentRequest: (state, action) => {
      state.sentRequests = state.sentRequests.filter(request => request._id !== action.payload);
    },
    
    // Remove connection from local state (for immediate UI update)
    removeConnectionLocal: (state, action) => {
      state.connections = state.connections.filter(connection => connection._id !== action.payload);
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear success message
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    
    // Reset network state
    resetNetworkState: (state) => {
      state.users = [];
      state.suggestedUsers = [];
      state.pendingRequests = [];
      state.connections = [];
      state.sentRequests = [];
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchAllConnectedUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllConnectedUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllConnectedUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch suggested users
      .addCase(fetchSuggestedUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suggestedUsers = action.payload;
      })
      .addCase(fetchSuggestedUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Send connection request
      .addCase(sendConnectionRequest.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload;
      })
      
      // Fetch pending requests
      .addCase(fetchPendingRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingRequests = action.payload;
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Accept connection request
      .addCase(acceptConnectionRequest.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload;
      })
      
      // Ignore connection request
      .addCase(ignoreConnectionRequest.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
      })
      .addCase(ignoreConnectionRequest.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(ignoreConnectionRequest.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload;
      })
      
      // Withdraw connection request
      .addCase(withdrawConnectionRequest.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
      })
      .addCase(withdrawConnectionRequest.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(withdrawConnectionRequest.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload;
      })
      
      // Fetch user connections
      .addCase(fetchUserConnections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.connections = action.payload;
      })
      .addCase(fetchUserConnections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch sent requests
      .addCase(fetchSentRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSentRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sentRequests = action.payload;
      })
      .addCase(fetchSentRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Remove connection
      .addCase(removeConnection.pending, (state) => {
        state.isActionLoading = true;
        state.error = null;
      })
      .addCase(removeConnection.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.successMessage = action.payload.message;
        // Remove connection from local state
        state.connections = state.connections.filter(
          connection => connection._id !== action.meta.arg.connectionId
        );
      })
      .addCase(removeConnection.rejected, (state, action) => {
        state.isActionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  removeUser, 
  removePendingRequest, 
  removeSentRequest,
  removeConnectionLocal,
  clearError, 
  clearSuccessMessage,
  resetNetworkState 
} = networkSlice.actions;

export default networkSlice.reducer;