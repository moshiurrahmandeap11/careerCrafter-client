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

// Async thunk for processing payment
export const processPayment = createAsyncThunk(
  'premium/processPayment',
  async (paymentData, { getState }) => {
    // Simulate API call
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        const transactionData = {
          success: true,
          transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9),
          creditsAwarded: calculateCredits(paymentData.planId, getState().premium.billingCycle),
          paymentData: paymentData,
          timestamp: new Date().toISOString()
        };
        
        // Log payment data to console with user email
        console.log('💰 PAYMENT SUCCESSFUL - Transaction Data:', transactionData);
        console.log('📋 Payment Details:', {
          planId: paymentData.planId,
          planName: paymentData.planName,
          paymentMethod: paymentData.paymentMethod,
          amount: paymentData.amount,
          billingCycle: paymentData.billingCycle,
          userEmail: paymentData.userEmail, // Log user email
          creditsAwarded: transactionData.creditsAwarded,
          timestamp: transactionData.timestamp
        });
        
        // Log user-specific success message
        console.log(`🎯 Payment successful for user: ${paymentData.userEmail}`);
        console.log(`📧 User email stored in payment data: ${paymentData.userEmail}`);
        
        resolve(transactionData);
      }, 2000);
    });
    return response;
  }
);

// Helper function to calculate credits
const calculateCredits = (planId, billingCycle) => {
  const baseCredits = {
    'basic': 0,
    'standard': 200000,
    'premium': 400000
  };
  
  const credits = baseCredits[planId] || 0;
  
  // Yearly billing gives 12x credits
  return billingCycle === 'yearly' ? credits * 12 : credits;
};

const premiumSlice = createSlice({
  name: 'premium',
  initialState: {
    plans: [],
    loading: false,
    error: null,
    billingCycle: 'monthly',
    selectedPlan: null,
    paymentProcessing: false,
    paymentSuccess: false,
    awardedCredits: 0
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
    clearPaymentStatus: (state) => {
      state.paymentProcessing = false;
      state.paymentSuccess = false;
      state.awardedCredits = 0;
    },
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = null;
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
      })
      .addCase(processPayment.pending, (state) => {
        state.paymentProcessing = true;
        state.paymentSuccess = false;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.paymentProcessing = false;
        state.paymentSuccess = true;
        state.awardedCredits = action.payload.creditsAwarded;
        state.selectedPlan = null;
        
        // Additional console log in reducer for confirmation
        console.log('✅ Payment state updated successfully in Redux store');
        console.log('🎯 Credits awarded to user:', action.payload.creditsAwarded);
        console.log('👤 User email from payment:', action.payload.paymentData.userEmail);
        console.log('📝 Complete payment data stored:', action.payload.paymentData);
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.paymentProcessing = false;
        state.paymentSuccess = false;
        state.error = action.error.message;
        
        // Log payment failure
        console.error('❌ PAYMENT FAILED:', action.error.message);
      });
  }
});

export const {
  setBillingCycle,
  selectPlan,
  clearSelection,
  clearPaymentStatus,
  showToast,
  hideToast
} = premiumSlice.actions;

export default premiumSlice.reducer;