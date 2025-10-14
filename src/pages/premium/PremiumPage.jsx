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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
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

      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Crown className="w-4 h-4" />
            <span>UNLOCK PREMIUM FEATURES</span>
          </motion.div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Accelerate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Job Search</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get AI-powered job matching, resume optimization, and exclusive opportunities to land your dream job faster.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex">
            <button
              onClick={() => handleBillingCycleChange('monthly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${billingCycle === 'monthly'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleBillingCycleChange('yearly')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${billingCycle === 'yearly'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Yearly <span className="text-green-500 text-sm ml-1">(Save 20%)</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              index={index}
              onSelect={handlePlanSelect}
              calculateCredits={calculateCredits}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// Pricing Card Component
const PricingCard = ({ plan, billingCycle, index, onSelect, calculateCredits }) => {
  const isPopular = plan.name === 'Standard';
  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const originalPrice = billingCycle === 'yearly' ? plan.originalYearlyPrice : null;
  const credits = calculateCredits(plan.id);

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className={`relative rounded-2xl border-2 p-8 transition-all duration-300 ${isPopular
        ? 'border-purple-500 bg-gradient-to-b from-white to-purple-50 shadow-xl scale-105'
        : 'border-gray-200 bg-white shadow-sm'
        }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            MOST POPULAR
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          {plan.icon === 'zap' && <Zap className="w-6 h-6 text-yellow-500" />}
          {plan.icon === 'building' && <Building className="w-6 h-6 text-blue-500" />}
          {plan.icon === 'crown' && <Crown className="w-6 h-6 text-purple-500" />}
          <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline justify-center space-x-2">
            <span className="text-4xl font-bold text-gray-900">${price}</span>
            <span className="text-gray-500">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
          </div>
          {originalPrice && (
            <p className="text-sm text-gray-500 line-through mt-1">
              ${originalPrice} / year
            </p>
          )}
        </div>

        <p className="text-gray-600 text-sm">{plan.description}</p>

        {/* Credits Display */}
        {credits > 0 && (
          <div className="mt-3 p-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center space-x-1">
              <Gift className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">
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
      <div className="space-y-4 mb-8">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            {feature.included ? (
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
            )}
            <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
              {feature.name}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={() => onSelect(plan.id)}
        className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${isPopular
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {plan.current ? 'Current Plan' : `Get ${plan.name}`}
      </motion.button>
    </motion.div>
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
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {processing ? 'Processing Payment...' : 'Complete Payment'}
            </h2>
            {!processing && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
          <p className="text-gray-600 mt-2">
            You're subscribing to <span className="font-semibold">{plan.name}</span> plan
            ({billingCycle === 'yearly' ? 'Yearly' : 'Monthly'})
          </p>

          {/* User Email Display */}
          {userEmail && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Account:</span> {userEmail}
              </p>
            </div>
          )}

          {/* Credits Info */}
          {credits > 0 && (
            <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2">
                <Gift className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">
                  Bonus: {credits.toLocaleString()} AI Credits
                </span>
              </div>
              {billingCycle === 'yearly' && credits > 400000 && (
                <p className="text-xs text-purple-600 mt-1">
                  🎁 12x credits for yearly subscription!
                </p>
              )}
            </div>
          )}
        </div>

        {!processing ? (
          <>
            {/* Payment Methods */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setPaymentMethod(method.id);
                    }}
                    className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 ${paymentMethod === method.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <method.icon className={`w-6 h-6 ${paymentMethod === method.id ? 'text-purple-600' : 'text-gray-600'}`} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{method.name}</div>
                        <div className="text-sm text-gray-500">{method.description}</div>
                      </div>
                      {paymentMethod === method.id && (
                        <Check className="w-5 h-5 text-purple-600" />
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
                  <motion.button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: processing ? 1 : 1.02 }}
                    whileTap={{ scale: processing ? 1 : 0.98 }}
                  >
                    <span>
                      {paymentMethod === 'card' 
                        ? `Pay $${displayPrice}` 
                        : `Continue to Payment - $${displayPrice}`
                      }
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>
              )}
            </div>
          </>
        ) : (
          /* Processing State */
          <div className="p-12 text-center">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity }
              }}
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <CreditCard className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Processing Your Payment
            </h3>
            <p className="text-gray-600">
              Please wait while we complete your transaction...
            </p>
            {userEmail && (
              <p className="text-sm text-gray-500 mt-2">
                For account: {userEmail}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Success Toast Component
const SuccessToast = ({ credits, onClose }) => {
  return (
    <motion.div
      className="fixed top-4 right-4 z-50 max-w-sm w-full"
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg mb-1">Payment Successful! </h4>
            <p className="text-green-100">
              Welcome to Premium! You've received{' '}
              <span className="font-bold text-white">
                {credits.toLocaleString()} AI Credits
              </span>
              {credits > 0 && (
                <span className="block text-sm mt-1">
                   Start using your credits to boost your job search!
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-green-100 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumPage;