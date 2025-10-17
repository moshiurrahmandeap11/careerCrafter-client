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
  Banknote,
  Calendar,
  Users,
  Target,
  Rocket
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

    if (paymentMethod === 'mobile' || paymentMethod === 'bank') {
      dispatch(createSSLCommerzPayment(paymentPayload));
    } else {
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
          console.error('Payment process failed:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-14 h-14 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <button
            onClick={() => dispatch(fetchPremiumPlans())}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ReTitle title="Upgrade Your Account" />

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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Star className="w-3 h-3" />
            <span>Upgrade Account</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Choose Your Plan
          </h1>
          
          <p className="text-gray-600 max-w-lg mx-auto text-sm md:text-base">
            Get better job matches and more opportunities with our premium features
          </p>

          {/* User Status */}
          {userProfile?.isPremium && (
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium mt-4">
              <Check className="w-3 h-3" />
              <span>Hi {userProfile?.fullName?.split(' ')[0]}! You're on {userProfile?.planName}</span>
            </div>
          )}
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => handleBillingCycleChange('monthly')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleBillingCycleChange('yearly')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-600">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
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

        {/* Features Comparison */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6 text-gray-900">Compare Features</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200">
              <div className="font-medium text-sm text-gray-900">Features</div>
              <div className="text-center font-medium text-sm text-gray-900">Basic</div>
              <div className="text-center font-medium text-sm text-gray-900">Standard</div>
              <div className="text-center font-medium text-sm text-gray-900">Premium</div>
            </div>
            
            {plans[0]?.features?.map((feature, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 last:border-b-0">
                <div className="text-sm text-gray-700">{feature.name}</div>
                {plans.map((plan, planIndex) => (
                  <div key={planIndex} className="text-center">
                    {plan.features[index]?.included ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mx-auto" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
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

  const getPlanIcon = (iconName) => {
    switch (iconName) {
      case 'zap': return <Zap className="w-5 h-5 text-blue-500" />;
      case 'building': return <Building className="w-5 h-5 text-green-500" />;
      case 'crown': return <Crown className="w-5 h-5 text-purple-500" />;
      default: return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className={`relative border rounded-lg p-5 ${
      isCurrentPlan
        ? 'border-green-400 bg-green-50'
        : isPopular
        ? 'border-blue-400 bg-blue-50'
        : 'border-gray-200 bg-white hover:border-gray-300'
    } transition-colors`}>
      
      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>Current</span>
          </span>
        </div>
      )}

      {/* Popular Badge */}
      {isPopular && !isCurrentPlan && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
            Most Popular
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          {getPlanIcon(plan.icon)}
          <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
        </div>

        <div className="mb-3">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-bold text-gray-900">${price}</span>
            <span className="text-gray-500 text-sm">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
          </div>
          {originalPrice && (
            <p className="text-gray-500 text-sm line-through">
              ${originalPrice} / year
            </p>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3">{plan.description}</p>

        {/* Credits Display */}
        {credits > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
            <div className="flex items-center justify-center gap-1">
              <Gift className="w-3 h-3 text-yellow-600" />
              <span className="text-xs font-medium text-yellow-700">
                {credits.toLocaleString()} AI Credits
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="space-y-2 mb-4">
        {plan.features.slice(0, 4).map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {feature.included ? (
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
            )}
            <span className={`text-xs ${
              feature.included ? 'text-gray-700' : 'text-gray-400'
            }`}>
              {feature.name}
            </span>
          </div>
        ))}
        {plan.features.length > 4 && (
          <div className="text-xs text-blue-600 font-medium text-center">
            +{plan.features.length - 4} more features
          </div>
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => !isCurrentPlan && onSelect(plan.id)}
        disabled={isCurrentPlan}
        className={`w-full py-2 rounded-lg text-sm font-medium ${
          isCurrentPlan
            ? 'bg-green-500 text-white cursor-not-allowed'
            : isPopular
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } transition-colors`}
      >
        {isCurrentPlan ? (
          <div className="flex items-center justify-center gap-1">
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
        <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <CardElement options={cardElementOptions} />
        </div>
        {cardError && (
          <p className="text-red-600 text-sm mt-2">{cardError}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing || processing}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>
          {isProcessing ? 'Processing...' : `Pay $${amount}`}
        </span>
        {!isProcessing && <ArrowRight className="w-4 h-4" />}
      </button>
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
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
    { id: 'mobile', name: 'Mobile Payment', icon: Smartphone, description: 'bKash, Nagad, Rocket' },
    { id: 'bank', name: 'Bank Transfer', icon: Banknote, description: 'Direct bank transfer' }
  ];

  const displayPrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
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
            {plan.name} plan • {billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}
          </p>

          {credits > 0 && (
            <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
              <div className="flex items-center gap-1">
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
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Payment Method</h3>
              <div className="space-y-2">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-3 border rounded text-left ${
                      paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <method.icon className={`w-5 h-5 ${
                        paymentMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
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
            <div className="p-4">
              {paymentMethod === 'card' ? (
                <StripeCardForm
                  onSubmit={onSubmit}
                  processing={processing}
                  amount={displayPrice}
                  clientSecret={clientSecret}
                />
              ) : (
                <form onSubmit={onSubmit}>
                  {paymentMethod === 'mobile' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          placeholder="01XXXXXXXXX"
                          value={formData.mobileNumber}
                          onChange={(e) => onInputChange('mobileNumber', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          bKash, Nagad, Rocket, Upay
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter bank name"
                          value={formData.bankName}
                          onChange={(e) => onInputChange('bankName', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter account number"
                          value={formData.accountNumber}
                          onChange={(e) => onInputChange('accountNumber', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4 p-2 bg-blue-50 rounded">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700">
                      Your payment is secure and encrypted
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-3 bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>
                      {paymentMethod === 'card' 
                        ? `Pay $${displayPrice}` 
                        : `Continue - $${displayPrice}`
                      }
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Processing Payment
            </h3>
            <p className="text-gray-600 text-sm">
              Please wait while we process your payment...
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
      <div className="bg-green-500 text-white p-3 rounded shadow-lg">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">Payment Successful!</h4>
            <p className="text-green-100 text-xs">
              You received {credits.toLocaleString()} AI credits
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-green-100 hover:text-white flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;