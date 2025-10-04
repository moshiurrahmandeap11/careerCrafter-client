import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching premium plans
export const fetchPremiumPlans = createAsyncThunk(
  'premium/fetchPremiumPlans',
  async () => {
    const response = await fetch('/data/premium-plans.json');
    if (!response.ok) {
      throw new Error('Failed to fetch premium plans');
    }
    return response.json();
  }
);

const premiumSlice = createSlice({
  name: 'premium',
  initialState: {
    plans: [],
    loading: false,
    error: null,
    billingCycle: 'monthly',
    selectedPlan: null
  },
  reducers: {
    setBillingCycle: (state, action) => {
      state.billingCycle = action.payload;
    },
    selectPlan: (state, action) => {
      state.selectedPlan = state.plans.find(plan => plan.id === action.payload);
    },
    clearSelection: (state) => {
      state.selectedPlan = null;
    },
    processPayment: (state, action) => {
      // Handle payment processing logic
      console.log('Processing payment:', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPremiumPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPremiumPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPremiumPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const {
  setBillingCycle,
  selectPlan,
  clearSelection,
  processPayment
} = premiumSlice.actions;

export default premiumSlice.reducer;