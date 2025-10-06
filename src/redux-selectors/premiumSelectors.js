export const selectPlans = (state) => state.premium.plans;
export const selectLoading = (state) => state.premium.loading;
export const selectError = (state) => state.premium.error;
export const selectBillingCycle = (state) => state.premium.billingCycle;
export const selectedPlan = (state) => state.premium.selectedPlan;
export const selectPaymentProcessing = (state) => state.premium.paymentProcessing;
export const selectPaymentSuccess = (state) => state.premium.paymentSuccess;
export const selectAwardedCredits = (state) => state.premium.awardedCredits;