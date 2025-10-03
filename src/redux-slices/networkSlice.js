// redux-slices/networkSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchConnections = createAsyncThunk(
  'network/fetchConnections',
  async () => {
    const response = await fetch('/data/connections.json');
    if (!response.ok) {
      throw new Error('Failed to fetch connections');
    }
    return response.json();
  }
);

export const fetchPendingInvitations = createAsyncThunk(
  'network/fetchPendingInvitations',
  async () => {
    const response = await fetch('/data/pending-invitations.json');
    if (!response.ok) {
      throw new Error('Failed to fetch pending invitations');
    }
    return response.json();
  }
);

export const fetchSuggestions = createAsyncThunk(
  'network/fetchSuggestions',
  async () => {
    const response = await fetch('/data/suggestions.json');
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    return response.json();
  }
);

export const fetchAllNetworkData = createAsyncThunk(
  'network/fetchAllNetworkData',
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchConnections()),
      dispatch(fetchPendingInvitations()),
      dispatch(fetchSuggestions())
    ]);
  }
);

const networkSlice = createSlice({
  name: 'network',
  initialState: {
    connections: [],
    pendingInvitations: [],
    suggestions: [],
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
    acceptInvitation: (state, action) => {
      const invitationId = action.payload;
      const invitation = state.pendingInvitations.find(inv => inv.id === invitationId);
      
      if (invitation) {
        // Move from pending to connections
        state.connections.push({
          ...invitation,
          connectedDate: 'Just now',
          online: true
        });
        
        // Remove from pending
        state.pendingInvitations = state.pendingInvitations.filter(inv => inv.id !== invitationId);
      }
    },
    ignoreInvitation: (state, action) => {
      const invitationId = action.payload;
      state.pendingInvitations = state.pendingInvitations.filter(inv => inv.id !== invitationId);
    },
    connectWithSuggestion: (state, action) => {
      const suggestionId = action.payload;
      const suggestion = state.suggestions.find(sug => sug.id === suggestionId);
      
      if (suggestion) {
        // Move to pending (simulating sent invitation)
        state.pendingInvitations.push({
          ...suggestion,
          daysAgo: 0,
          message: "I'd like to connect with you",
          mutualConnections: suggestion.mutual
        });
        
        // Remove from suggestions
        state.suggestions = state.suggestions.filter(sug => sug.id !== suggestionId);
      }
    },
    removeConnection: (state, action) => {
      const connectionId = action.payload;
      state.connections = state.connections.filter(conn => conn.id !== connectionId);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Network Data
      .addCase(fetchAllNetworkData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNetworkData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchAllNetworkData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Connections
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Fetch Pending Invitations
      .addCase(fetchPendingInvitations.fulfilled, (state, action) => {
        state.pendingInvitations = action.payload;
      })
      .addCase(fetchPendingInvitations.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Fetch Suggestions
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

export const {
  setSearchTerm,
  setActiveTab,
  clearError,
  acceptInvitation,
  ignoreInvitation,
  connectWithSuggestion,
  removeConnection
} = networkSlice.actions;

export default networkSlice.reducer;