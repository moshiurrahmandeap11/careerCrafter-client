// redux-selectors/networkSelectors.js
import { createSelector } from '@reduxjs/toolkit';

export const selectConnections = (state) => state.network.connections;
export const selectPendingInvitations = (state) => state.network.pendingInvitations;
export const selectSuggestions = (state) => state.network.suggestions;
export const selectAllUsers = (state) => state.network.allUsers;
export const selectLoading = (state) => state.network.loading;
export const selectError = (state) => state.network.error;
export const selectSearchTerm = (state) => state.network.searchTerm;
export const selectActiveTab = (state) => state.network.activeTab;

// Dynamic tab counts
export const selectTabCounts = createSelector(
  [selectConnections, selectPendingInvitations, selectSuggestions, selectAllUsers],
  (connections, pending, suggestions, allUsers) => ({
    connections: connections.length,
    pending: pending.length,
    suggestions: suggestions.length,
    allUsers: allUsers.length
  })
);

// Filtered connections based on search
export const selectFilteredConnections = createSelector(
  [selectConnections, selectSearchTerm],
  (connections, searchTerm) => {
    if (!searchTerm.trim()) return connections;
    
    const lowercasedSearch = searchTerm.toLowerCase();
    return connections.filter(connection => 
      connection.user?.fullName?.toLowerCase().includes(lowercasedSearch) ||
      connection.user?.email?.toLowerCase().includes(lowercasedSearch) ||
      connection.user?.tags?.some(tag => 
        tag.toLowerCase().includes(lowercasedSearch)
      )
    );
  }
);