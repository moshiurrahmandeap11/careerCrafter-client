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
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReTitle } from 're-title';

// Redux actions and selectors
import {
  fetchPremiumPlans,
  setBillingCycle,
  selectPlan,
  processPayment
} from '../../redux-slices/premiumSlice';
import {
  selectPlans,
  selectLoading,
  selectError,
  selectBillingCycle,
  selectedPlan
} from '../../redux-selectors/premiumSelectors';

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
  const dispatch = useDispatch();

  // Select data from Redux store
  const plans = useSelector(selectPlans);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const billingCycle = useSelector(selectBillingCycle);
  const currentSelectedPlan = useSelector(selectedPlan);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
    mobileNumber: '',
    transactionId: '',
    bankName: '',
    accountNumber: ''
  });

  useEffect(() => {
    dispatch(fetchPremiumPlans());
  }, [dispatch]);

  const handleBillingCycleChange = (cycle) => {
    dispatch(setBillingCycle(cycle));
  };

  const handlePlanSelect = (planId) => {
    dispatch(selectPlan(planId));
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    dispatch(processPayment({
      planId: currentSelectedPlan?.id,
      paymentMethod,
      ...formData
    }));
    // Handle payment processing logic here
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
            onClose={() => setShowPaymentModal(false)}
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
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// Pricing Card Component
const PricingCard = ({ plan, billingCycle, index, onSelect }) => {
  const isPopular = plan.name === 'Standard';
  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  const originalPrice = billingCycle === 'yearly' ? plan.originalYearlyPrice : null;

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

// Payment Modal Component
const PaymentModal = ({ 
  plan, 
  billingCycle, 
  paymentMethod, 
  setPaymentMethod, 
  formData, 
  onInputChange, 
  onSubmit, 
  onClose 
}) => {
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'bkash', name: 'bKash', icon: Globe },
    { id: 'nogod', name: 'Nagad', icon: Shield },
    { id: 'rocket', name: 'Rocket', icon: Zap },
    { id: 'upay', name: 'Upay', icon: Sparkles },
    { id: 'bank', name: 'Bank Transfer', icon: Building }
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
            <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            You're subscribing to <span className="font-semibold">{plan.name}</span> plan 
            ({billingCycle === 'yearly' ? 'Yearly' : 'Monthly'})
          </p>
        </div>

        {/* Payment Methods */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-3 border-2 rounded-xl text-left transition-all duration-200 ${paymentMethod === method.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <method.icon className={`w-5 h-5 mb-2 ${paymentMethod === method.id ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                <span className="text-sm font-medium text-gray-700">{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={onSubmit} className="p-6">
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => onInputChange('cardNumber', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => onInputChange('expiryDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => onInputChange('cvv', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Holder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.cardHolder}
                  onChange={(e) => onInputChange('cardHolder', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {/* Mobile Payment Methods */}
          {['bkash', 'nogod', 'rocket', 'upay'].includes(paymentMethod) && (
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
              </div>
            </div>
          )}

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
              Your payment information is secure and encrypted
            </span>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Complete Payment - ${displayPrice}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PremiumPage;