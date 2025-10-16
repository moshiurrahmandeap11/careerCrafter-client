import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";







//  Async thunk to fetch all connected users
export const fetchAllConnectedUsers = createAsyncThunk(
  'network/fetchAllConnectedUsers',
  async ({email,axiosSecure}, { rejectWithValue }) => {
    try {
       
      const res = await axiosSecure.get(`/network/all-connect-users?email=${email}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

//  Async thunk to fetch suggested users
export const fetchSuggestedUsers = createAsyncThunk(
  'network/fetchSuggestedUsers',
  async ({ email, axiosSecure }, { rejectWithValue }) => {
    try {
      // suggestion API call
      const res = await axiosSecure.get(`/network/suggestion-connect?email=${email}`);
      return res.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const networkSlice = createSlice({
  name: 'network',
  initialState: {
    isLoading: false,
    users: [],
    suggestedUsers: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
       builder
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
      });
  },
});

export default networkSlice.reducer;
