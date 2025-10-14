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

// Async thunk for creating Stripe payment intent
export const createStripePaymentIntent = createAsyncThunk(
  'premium/createStripePaymentIntent',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/v1/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating SSLCommerz payment
export const createSSLCommerzPayment = createAsyncThunk(
  'premium/createSSLCommerzPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/v1/payments/create-sslcommerz-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create SSLCommerz payment');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for processing payment
export const processPayment = createAsyncThunk(
  'premium/processPayment',
  async (paymentData, { getState, rejectWithValue }) => {
    try {
      // For Stripe payments, we don't need to simulate delay as Stripe handles it
      if (paymentData.paymentMethod === 'card') {
        // Calculate credits
        const creditsAwarded = calculateCredits(paymentData.planId, getState().premium.billingCycle);
        
        // Prepare data for backend
        const backendPaymentData = {
          planId: paymentData.planId,
          planName: paymentData.planName,
          paymentMethod: paymentData.paymentMethod,
          amount: paymentData.amount,
          billingCycle: paymentData.billingCycle,
          userEmail: paymentData.userEmail,
          creditsAwarded: creditsAwarded,
          paymentData: paymentData
        };

        // Send payment data to backend
        const response = await fetch('http://localhost:3000/v1/payments/process-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(backendPaymentData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Payment failed');
        }

        const result = await response.json();

        return {
          success: true,
          transactionId: result.transactionId,
          creditsAwarded: creditsAwarded,
          paymentData: paymentData,
          backendResponse: result
        };
      }

      // For non-Stripe payments, this shouldn't be called directly
      throw new Error('Invalid payment method for direct processing');

    } catch (error) {
      console.error('❌ Payment processing error:', error);
      return rejectWithValue(error.message);
    }
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
    awardedCredits: 0,
    transactionId: null,
    clientSecret: null,
    sslCommerzUrl: null
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
      state.transactionId = null;
      state.clientSecret = null;
      state.sslCommerzUrl = null;
      state.error = null;
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
      .addCase(createStripePaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStripePaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createStripePaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSSLCommerzPayment.pending, (state) => {
        state.paymentProcessing = true;
        state.error = null;
      })
      .addCase(createSSLCommerzPayment.fulfilled, (state, action) => {
        state.paymentProcessing = false;
        state.sslCommerzUrl = action.payload.GatewayPageURL;
      })
      .addCase(createSSLCommerzPayment.rejected, (state, action) => {
        state.paymentProcessing = false;
        state.error = action.payload;
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
        state.transactionId = action.payload.transactionId;
        state.selectedPlan = null;
        state.clientSecret = null;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.paymentProcessing = false;
        state.paymentSuccess = false;
        state.error = action.payload;
        state.clientSecret = null;
        console.error('❌ PAYMENT FAILED:', action.payload);
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