// redux-slices/networkSelectors.js
export const selectConnections = (state) => state.network.connections;
export const selectPendingInvitations = (state) => state.network.pendingInvitations;
export const selectSuggestions = (state) => state.network.suggestions;
export const selectLoading = (state) => state.network.loading;
export const selectError = (state) => state.network.error;
export const selectSearchTerm = (state) => state.network.searchTerm;
export const selectActiveTab = (state) => state.network.activeTab;

export const selectFilteredConnections = (state) => {
  const connections = selectConnections(state);
  const searchTerm = selectSearchTerm(state);
  
  if (!searchTerm) return connections;
  
  return connections.filter(connection =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.company.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const selectTabCounts = (state) => ({
  connections: selectConnections(state).length,
  pending: selectPendingInvitations(state).length,
  suggestions: selectSuggestions(state).length
});