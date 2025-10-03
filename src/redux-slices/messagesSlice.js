// redux-slices/messagesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async () => {
    const response = await fetch('/data/conversations.json');
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    return response.json();
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ conversationId, messageContent }) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      conversationId,
      message: {
        id: Date.now(),
        content: messageContent,
        timestamp: new Date().toISOString(),
        isSender: true,
        read: true
      }
    };
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    selectedConversation: null,
    searchTerm: '',
    loading: false,
    error: null,
    mobileView: 'list',
    sendingMessage: false
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setMobileView: (state, action) => {
      state.mobileView = action.payload;
    },
    clearSelectedConversation: (state) => {
      state.selectedConversation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    markConversationAsRead: (state, action) => {
      const conversationId = action.payload;
      const conversation = state.conversations.find(conv => conv.id === conversationId);
      if (conversation) {
        conversation.unread = 0;
        // Mark all messages as read
        if (conversation.messages) {
          conversation.messages.forEach(message => {
            message.read = true;
          });
        }
      }
    },
    addNewConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        const { conversationId, message } = action.payload;
        
        const updatedConversations = state.conversations.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: message.content,
              lastMessageTime: 'Just now',
              messages: [...(conv.messages || []), message],
              unread: 0
            };
          }
          return conv;
        });

        state.conversations = updatedConversations;
        
        // Update selected conversation if it's the current one
        if (state.selectedConversation && state.selectedConversation.id === conversationId) {
          state.selectedConversation = updatedConversations.find(conv => conv.id === conversationId);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.error = 'Failed to send message';
      });
  }
});

export const {
  setSearchTerm,
  setSelectedConversation,
  setMobileView,
  clearSelectedConversation,
  clearError,
  markConversationAsRead,
  addNewConversation
} = messagesSlice.actions;

export default messagesSlice.reducer;