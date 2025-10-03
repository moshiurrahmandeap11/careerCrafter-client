// redux-selectors/messagesSelectors.js
export const selectConversations = (state) => state.messages.conversations;
export const selectSelectedConversation = (state) => state.messages.selectedConversation; // Fixed name
export const selectSearchTerm = (state) => state.messages.searchTerm;
export const selectLoading = (state) => state.messages.loading;
export const selectError = (state) => state.messages.error;
export const selectMobileView = (state) => state.messages.mobileView;
export const selectSendingMessage = (state) => state.messages.sendingMessage;

export const selectFilteredConversations = (state) => {
  const conversations = selectConversations(state);
  const searchTerm = selectSearchTerm(state);
  
  if (!searchTerm.trim()) {
    return conversations;
  }

  return conversations.filter(conversation =>
    conversation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const selectUnreadCount = (state) => {
  const conversations = selectConversations(state);
  return conversations.reduce((total, conv) => total + (conv.unread || 0), 0);
};

export const selectConversationById = (state, conversationId) => {
  const conversations = selectConversations(state);
  return conversations.find(conv => conv.id === conversationId);
};