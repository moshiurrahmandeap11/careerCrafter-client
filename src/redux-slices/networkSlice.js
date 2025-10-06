// redux-slices/networkSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosIntense from '../hooks/AxiosIntense/axiosIntense';

// Async Thunks
// redux-slices/networkSlice.js - fetchAllNetworkData থাঙ্কে
export const fetchAllNetworkData = createAsyncThunk(
  'network/fetchAllNetworkData',
  async (userId, { rejectWithValue }) => {
    try {
      console.log('📡 Fetching network data for user:', userId);
      
      const [
        connectionsResponse,
        pendingResponse,
        suggestionsResponse,
        allUsersResponse
      ] = await Promise.all([
        axiosIntense.get(`/network/myConnections?userId=${userId}`),
        axiosIntense.get(`/network/pendingReq?userId=${userId}`),
        axiosIntense.get(`/network/getSuggestion?userId=${userId}`),
        axiosIntense.get(`/users/allUsersForNetwork?userId=${userId}`),
      ]);

      console.log('✅ API Responses:', {
        connections: connectionsResponse.data,
        pending: pendingResponse.data,
        suggestions: suggestionsResponse.data,
        allUsers: allUsersResponse.data
      });

      return {
        connections: connectionsResponse.data || [],
        pendingInvitations: pendingResponse.data || [],
        suggestions: suggestionsResponse.data || [],
        allUsers: allUsersResponse.data || []
      };
    } catch (error) {
      console.error('❌ API Error:', error);
      return rejectWithValue(error.response?.data?.message || 'Network error occurred');
    }
  }
);

export const acceptInvitation = createAsyncThunk(
  'network/acceptInvitation',
  async ({ invitationId, userId }, { rejectWithValue }) => {
    try {
      const response = await axiosIntense.patch(`/network/accept/${invitationId}`, {
        userId
      });
      return { invitationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept invitation');
    }
  }
);

export const ignoreInvitation = createAsyncThunk(
  'network/ignoreInvitation',
  async ({ invitationId, userId }, { rejectWithValue }) => {
    try {
      const response = await axiosIntense.patch(`/network/ignore/${invitationId}`, {
        userId
      });
      return { invitationId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to ignore invitation');
    }
  }
);

export const connectWithSuggestion = createAsyncThunk(
  'network/connectWithSuggestion',
  async ({ suggestionId, currentUserId }, { rejectWithValue }) => {
    try {
      const response = await axiosIntense.post('/network/connectReq', { 
        receiverId: suggestionId,
        senderId: currentUserId
      });
      return { suggestionId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send connection request');
    }
  }
);

export const removeConnection = createAsyncThunk(
  'network/removeConnection',
  async (connectionId, { rejectWithValue }) => {
    try {
      await axiosIntense.delete(`/network/connect/${connectionId}`);
      return { connectionId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove connection');
    }
  }
);

// Slice
const networkSlice = createSlice({
  name: 'network',
  initialState: {
    connections: [],
    pendingInvitations: [],
    suggestions: [],
    allUsers: [],
    loading: false,
    error: null,
    searchTerm: '',
    activeTab: 'connections'
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Network Data
      .addCase(fetchAllNetworkData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNetworkData.fulfilled, (state, action) => {
        state.loading = false;
        state.connections = action.payload.connections;
        state.pendingInvitations = action.payload.pendingInvitations;
        state.suggestions = action.payload.suggestions;
        state.allUsers = action.payload.allUsers;
      })
      .addCase(fetchAllNetworkData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Accept Invitation
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        const { invitationId } = action.payload;
        // Remove from pending and add to connections
        const invitationIndex = state.pendingInvitations.findIndex(
          inv => inv._id === invitationId
        );
        if (invitationIndex !== -1) {
          const acceptedInvitation = state.pendingInvitations[invitationIndex];
          state.pendingInvitations.splice(invitationIndex, 1);
          // Add to connections with proper format
          state.connections.push({
            id: acceptedInvitation._id,
            user: acceptedInvitation.sender, // Adjust based on your API response
            connectedAt: new Date().toISOString()
          });
        }
      })
      .addCase(acceptInvitation.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Ignore Invitation
      .addCase(ignoreInvitation.fulfilled, (state, action) => {
        const { invitationId } = action.payload;
        state.pendingInvitations = state.pendingInvitations.filter(
          inv => inv._id !== invitationId
        );
      })
      .addCase(ignoreInvitation.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Connect With Suggestion
      .addCase(connectWithSuggestion.fulfilled, (state, action) => {
        const { suggestionId } = action.payload;
        // Remove from suggestions and allUsers
        state.suggestions = state.suggestions.filter(
          sug => sug._id !== suggestionId
        );
        state.allUsers = state.allUsers.filter(
          user => user._id !== suggestionId
        );
      })
      .addCase(connectWithSuggestion.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove Connection
      .addCase(removeConnection.fulfilled, (state, action) => {
        const { connectionId } = action.payload;
        state.connections = state.connections.filter(
          conn => conn.id !== connectionId
        );
      })
      .addCase(removeConnection.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { setSearchTerm, setActiveTab, clearError } = networkSlice.actions;
export default networkSlice.reducer;