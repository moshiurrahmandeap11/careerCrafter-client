import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Check,
  X,
  Star,
  Crown,
  Zap,
  Shield,
  Sparkles,
  CreditCard,
  Building,
  Globe,
  Lock,
  ArrowRight,
  Gift,
  Smartphone,
  Banknote
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReTitle } from 're-title';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Redux actions and selectors
import {
  fetchPremiumPlans,
  setBillingCycle,
  selectPlan,
  processPayment,
  clearPaymentStatus,
  createStripePaymentIntent,
  createSSLCommerzPayment
} from '../../redux-slices/premiumSlice';
import {
  selectPlans,
  selectLoading,
  selectError,
  selectBillingCycle,
  selectedPlan,
  selectPaymentProcessing,
  selectPaymentSuccess,
  selectAwardedCredits,
  selectClientSecret,
  selectSSLCommerzUrl
} from '../../redux-selectors/premiumSelectors';
import useAuth from '../../hooks/UseAuth/useAuth';
import axiosIntense from '../../hooks/AxiosIntense/axiosIntense';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY);

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  },
  hover: {
    y: -4,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  }
};

const PremiumPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <PremiumContent />
    </Elements>
  );
};

const PremiumContent = () => {
  const dispatch = useDispatch();
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState([])

 
  
  const email = user?.email;
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axiosIntense.get(`/users/email/${email}`);
      setUserProfile(response.data);
    }
    fetchUser();
  },[email])

  // Select data from Redux store
  const plans = useSelector(selectPlans);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const billingCycle = useSelector(selectBillingCycle);
  const currentSelectedPlan = useSelector(selectedPlan);
  const paymentProcessing = useSelector(selectPaymentProcessing);
  const paymentSuccess = useSelector(selectPaymentSuccess);
  const awardedCredits = useSelector(selectAwardedCredits);
  const clientSecret = useSelector(selectClientSecret);
  const sslCommerzUrl = useSelector(selectSSLCommerzUrl);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    mobileNumber: '',
    bankName: '',
    accountNumber: ''
  });

  useEffect(() => {
    dispatch(fetchPremiumPlans());
  }, [dispatch]);

  // Redirect to SSLCommerz when URL is available
  useEffect(() => {
    if (sslCommerzUrl) {
      window.location.href = sslCommerzUrl;
    }
  }, [sslCommerzUrl]);

  // Toast message effect
  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearPaymentStatus());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [paymentSuccess, awardedCredits, dispatch]);

  const handleBillingCycleChange = (cycle) => {
    dispatch(setBillingCycle(cycle));
  };

  const handlePlanSelect = async (planId) => {
    dispatch(selectPlan(planId));
    
    const selectedPlan = plans.find(p => p.id === planId);
    if (selectedPlan) {
      const amount = billingCycle === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;
      
      // Create Stripe payment intent for card payments
      await dispatch(createStripePaymentIntent({
        planId,
        amount,
        billingCycle,
        userEmail: user?.email
      }));
    }
    
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const paymentPayload = {
      planId: currentSelectedPlan?.id,
      paymentMethod,
      ...formData,
      planName: currentSelectedPlan?.name,
      billingCycle: billingCycle,
      amount: billingCycle === 'yearly' ? currentSelectedPlan?.yearlyPrice : currentSelectedPlan?.monthlyPrice,
      userEmail: user?.email,
      userName: user?.name || user?.email?.split('@')[0]
    };

    // For SSLCommerz payments, create payment session
    if (paymentMethod === 'mobile' || paymentMethod === 'bank') {
      dispatch(createSSLCommerzPayment(paymentPayload));
    } else {
      // For Stripe card payments
      dispatch(processPayment(paymentPayload))
        .unwrap()
        .then((result) => {
          setShowPaymentModal(false);
          setFormData({
            mobileNumber: '',
            bankName: '',
            accountNumber: ''
          });
        })
        .catch((error) => {
          console.error('❌ Payment process failed:', error);
        });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateCredits = (planId) => {
    const baseCredits = {
      'basic': 0,
      'standard': 200000,
      'premium': 400000
    };

    const credits = baseCredits[planId] || 0;
    return billingCycle === 'yearly' ? credits * 12 : credits;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <Crown className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Loading premium plans...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Crown className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            onClick={() => dispatch(fetchPremiumPlans())}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ReTitle title="Go Premium - AI Job Platform" />

      {/* Success Toast */}
      <AnimatePresence>
        {paymentSuccess && (
          <SuccessToast
            credits={awardedCredits}
            onClose={() => {
              dispatch(clearPaymentStatus());
            }}
          />
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && currentSelectedPlan && (
          <PaymentModal
            plan={currentSelectedPlan}
            billingCycle={billingCycle}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handlePaymentSubmit}
            onClose={() => {
              setShowPaymentModal(false);
            }}
            processing={paymentProcessing}
            credits={calculateCredits(currentSelectedPlan.id)}
            userEmail={user?.email}
            clientSecret={clientSecret}
          />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Crown className="w-4 h-4" />
            <span>Premium Plans</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock AI-powered job matching and exclusive opportunities to accelerate your career.
          </p>

          {/* User Status Display */}
          {userProfile?.isPremium && (
            <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mt-6">
              <Check className="w-4 h-4" />
              <span>Welcome back, {userProfile?.fullName?.split(' ')[0]}!</span>
              <span className="bg-green-200 px-2 py-1 rounded text-xs">
                {userProfile?.planName} Plan
              </span>
            </div>
          )}
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => handleBillingCycleChange('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleBillingCycleChange('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-600 font-semibold">(Save 20%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              index={index}
              onSelect={handlePlanSelect}
              calculateCredits={calculateCredits}
              userProfile={userProfile}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

// Pricing Card Component
const PricingCard = ({ plan, billingCycle, index, onSelect, calculateCredits, userProfile }) => {
  const isPopular = plan.name === 'Standard';
  const isCurrentPlan = userProfile?.currentPlan === plan.id || userProfile?.planName === plan.name;
  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const originalPrice = billingCycle === 'yearly' ? plan.originalYearlyPrice : null;
  const credits = calculateCredits(plan.id);

  return (
    <div className={`relative rounded-xl border p-6 transition-all duration-200 ${
      isCurrentPlan
        ? 'border-green-500 bg-green-50'
        : isPopular
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Check className="w-3 h-3" />
            <span>Current Plan</span>
          </span>
        </div>
      )}

      {/* Popular Badge */}
      {isPopular && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          {plan.icon === 'zap' && <Zap className="w-6 h-6 text-yellow-500" />}
          {plan.icon === 'building' && <Building className="w-6 h-6 text-blue-500" />}
          {plan.icon === 'crown' && <Crown className="w-6 h-6 text-purple-500" />}
          <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-4xl font-bold text-gray-900">${price}</span>
            <span className="text-gray-500">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
          </div>
          {originalPrice && (
            <p className="text-sm text-gray-500 line-through mt-1">
              ${originalPrice} / year
            </p>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

        {/* Credits Display */}
        {credits > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-1">
              <Gift className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                {credits.toLocaleString()} AI Credits
              </span>
              {billingCycle === 'yearly' && (
                <span className="text-xs text-yellow-600">(12x)</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="space-y-3 mb-6">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            {feature.included ? (
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
            )}
            <span className={`text-sm ${
              feature.included ? 'text-gray-700' : 'text-gray-400'
            }`}>
              {feature.name}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => !isCurrentPlan && onSelect(plan.id)}
        disabled={isCurrentPlan}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          isCurrentPlan
            ? 'bg-green-500 text-white cursor-not-allowed'
            : isPopular
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {isCurrentPlan ? (
          <div className="flex items-center justify-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Current Plan</span>
          </div>
        ) : (
          `Get ${plan.name}`
        )}
      </button>
    </div>
  );
};

// Stripe Card Form Component
const StripeCardForm = ({ onSubmit, processing, amount, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCardError('');

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    });

    if (error) {
      setCardError(error.message);
      setIsProcessing(false);
    } else {
      if (paymentIntent.status === 'succeeded') {
        onSubmit(e);
      }
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '10px 12px',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
          <CardElement options={cardElementOptions} />
        </div>
        {cardError && (
          <p className="text-red-600 text-sm mt-2">{cardError}</p>
        )}
      </div>

      <motion.button
        type="submit"
        disabled={!stripe || isProcessing || processing}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: processing || isProcessing ? 1 : 1.02 }}
        whileTap={{ scale: processing || isProcessing ? 1 : 0.98 }}
      >
        <span>
          {isProcessing ? 'Processing...' : `Pay $${amount}`}
        </span>
        {!isProcessing && <ArrowRight className="w-4 h-4" />}
      </motion.button>
    </form>
  );
};

// Payment Modal Component
const PaymentModal = ({
  plan,
  billingCycle,
  paymentMethod,
  setPaymentMethod,
  formData,
  onInputChange,
  onSubmit,
  onClose,
  processing,
  credits,
  userEmail,
  clientSecret
}) => {
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Pay with Visa, Mastercard, or Amex' },
    { id: 'mobile', name: 'Mobile Payment', icon: Smartphone, description: 'bKash, Nagad, Rocket, Upay' },
    { id: 'bank', name: 'Bank Transfer', icon: Banknote, description: 'Direct bank transfer' }
  ];

  // Calculate correct price based on billing cycle
  const displayPrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {processing ? 'Processing...' : 'Complete Payment'}
            </h2>
            {!processing && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
          <p className="text-gray-600 text-sm mt-1">
            {plan.name} plan ({billingCycle === 'yearly' ? 'Yearly' : 'Monthly'})
          </p>

          {/* Credits Info */}
          {credits > 0 && (
            <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
              <div className="flex items-center space-x-1">
                <Gift className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">
                  {credits.toLocaleString()} AI Credits
                </span>
              </div>
            </div>
          )}
        </div>

        {!processing ? (
          <>
            {/* Payment Methods */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
              <div className="space-y-2">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setPaymentMethod(method.id);
                    }}
                    className={`w-full p-3 border rounded-lg text-left transition-colors ${
                      paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-blue-600' : 'text-gray-600'}`} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{method.name}</div>
                        <div className="text-xs text-gray-500">{method.description}</div>
                      </div>
                      {paymentMethod === method.id && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            <div className="p-6">
              {paymentMethod === 'card' ? (
                <StripeCardForm
                  onSubmit={onSubmit}
                  processing={processing}
                  amount={displayPrice}
                  clientSecret={clientSecret}
                />
              ) : (
                <form onSubmit={onSubmit}>
                  {/* Mobile Payment Method */}
                  {paymentMethod === 'mobile' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          placeholder="01XXXXXXXXX"
                          value={formData.mobileNumber}
                          onChange={(e) => onInputChange('mobileNumber', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Supports bKash, Nagad, Rocket, Upay
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Method */}
                  {paymentMethod === 'bank' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter bank name"
                          value={formData.bankName}
                          onChange={(e) => onInputChange('bankName', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter account number"
                          value={formData.accountNumber}
                          onChange={(e) => onInputChange('accountNumber', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Security Note */}
                  <div className="flex items-center space-x-2 mt-6 p-3 bg-blue-50 rounded-lg">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">
                      {paymentMethod === 'card' 
                        ? 'Your payment information is secure and encrypted with Stripe'
                        : 'Your payment is processed securely via SSLCommerz'
                      }
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>
                      {paymentMethod === 'card' 
                        ? `Pay $${displayPrice}` 
                        : `Continue to Payment - $${displayPrice}`
                      }
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          /* Processing State */
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Processing Payment
            </h3>
            <p className="text-gray-600 text-sm">
              Please wait while we complete your transaction...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Success Toast Component
const SuccessToast = ({ credits, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">Payment Successful!</h4>
            <p className="text-green-100 text-sm">
              You've received {credits.toLocaleString()} AI Credits
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-green-100 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;