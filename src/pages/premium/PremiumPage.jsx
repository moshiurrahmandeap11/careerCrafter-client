import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Star, 
  Crown, 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  Briefcase,
  MessageCircle,
  Eye,
  FileText,
  Video,
  Award,
  Shield,
  Globe,
  BarChart3,
  Rocket,
  Clock,
  Mail,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ReTitle } from 're-title';

const PremiumPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = {
    basic: {
      name: 'Basic',
      icon: Zap,
      color: 'blue',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Free tools to start your job search',
      popular: false,
      currentPlan: true,
      features: {
        included: [
          { icon: Briefcase, text: 'Basic Job Matching', description: 'Simple job recommendations' },
          { icon: FileText, text: '3 Resume Analyses', description: 'Limited monthly resume reviews' },
          { icon: Eye, text: 'Basic Profile Visibility', description: 'Standard visibility to employers' },
          { icon: Mail, text: 'Direct Applications', description: 'Apply to unlimited jobs' },
          { icon: Clock, text: 'Community Support', description: '72-hour response time' }
        ],
        excluded: [
          'AI Cover Letters',
          'Interview Preparation',
          'Priority Applications',
          'Advanced Analytics',
          'AI Job Matching'
        ]
      }
    },
    standard: {
      name: 'Standard',
      icon: TrendingUp,
      color: 'purple',
      monthlyPrice: 19,
      yearlyPrice: 190,
      description: 'Advanced features for serious job seekers',
      popular: true,
      currentPlan: false,
      features: {
        included: [
          { icon: Briefcase, text: 'Advanced AI Job Matching', description: 'Smart job recommendations' },
          { icon: FileText, text: 'Unlimited Resume Analyses', description: 'Continuous resume optimization' },
          { icon: Target, text: 'AI Cover Letters', description: 'Personalized cover letter generation' },
          { icon: Video, text: 'Interview Preparation', description: 'Mock interviews with AI feedback' },
          { icon: Eye, text: 'Enhanced Visibility', description: 'Top placement in search results' },
          { icon: BarChart3, text: 'Application Analytics', description: 'Track your application performance' },
          { icon: MessageCircle, text: 'Priority Support', description: '24-hour response time' }
        ],
        excluded: [
          'Career Coaching',
          'LinkedIn Optimization',
          'Executive Level Features'
        ]
      }
    },
    premium: {
      name: 'Premium',
      icon: Crown,
      color: 'amber',
      monthlyPrice: 39,
      yearlyPrice: 390,
      description: 'Complete career transformation package',
      popular: false,
      currentPlan: false,
      features: {
        included: [
          { icon: Briefcase, text: 'Premium AI Job Matching', description: 'Executive-level opportunities' },
          { icon: FileText, text: 'Unlimited Resume Analyses', description: 'With ATS optimization' },
          { icon: Target, text: 'Advanced AI Cover Letters', description: 'Industry-specific templates' },
          { icon: Video, text: 'Live Interview Coaching', description: 'With industry experts' },
          { icon: Users, text: 'Career Coaching', description: '1-on-1 sessions monthly' },
          { icon: Eye, text: 'Maximum Visibility', description: 'Featured candidate status' },
          { icon: Globe, text: 'LinkedIn Optimization', description: 'Profile rewrite and optimization' },
          { icon: Award, text: 'Skill Certification', description: 'Verified skill badges' },
          { icon: Rocket, text: 'Priority Applications', description: 'Fast-tracked to hiring managers' },
          { icon: Shield, text: 'Dedicated Support', description: '4-hour response time' }
        ],
        excluded: []
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const featureVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const PlanCard = ({ planKey, plan }) => {
    const isSelected = selectedPlan === planKey;
    const isPopular = plan.popular;
    const isCurrentPlan = plan.currentPlan;
    const currentPrice = isAnnual ? plan.yearlyPrice : plan.monthlyPrice;
    const monthlyEquivalent = isAnnual ? (plan.yearlyPrice / 12).toFixed(0) : plan.monthlyPrice;
    const savings = isAnnual ? plan.monthlyPrice * 12 - plan.yearlyPrice : 0;

    return (
      <motion.div
        variants={cardVariants}
        className={`relative rounded-2xl border-2 p-6 transition-all duration-300 ${
          isCurrentPlan
            ? 'border-green-500 bg-green-50 shadow-lg ring-2 ring-green-500 ring-opacity-50'
            : isSelected
            ? `border-${plan.color}-500 bg-${plan.color}-50 shadow-lg`
            : 'border-gray-200 bg-white shadow-sm'
        } ${isPopular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''}`}
        whileHover={isCurrentPlan ? {} : "hover"}
        onClick={() => !isCurrentPlan && setSelectedPlan(planKey)}
      >
        {/* Current Plan Badge */}
        {isCurrentPlan && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1"
            >
              <Check className="w-3 h-3 fill-current" />
              <span>CURRENT PLAN</span>
            </motion.div>
          </div>
        )}

        {/* Popular Badge */}
        {isPopular && !isCurrentPlan && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1"
            >
              <Star className="w-3 h-3 fill-current" />
              <span>MOST POPULAR</span>
            </motion.div>
          </div>
        )}

        {/* Plan Header */}
        <div className="text-center mb-6">
          <div className={`w-12 h-12 ${
            isCurrentPlan 
              ? 'bg-gradient-to-r from-green-500 to-green-600' 
              : `bg-gradient-to-r from-${plan.color}-500 to-${plan.color}-600`
          } rounded-xl flex items-center justify-center mx-auto mb-3`}>
            <plan.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center space-x-1">
            {currentPrice === 0 ? (
              <span className="text-3xl font-bold text-gray-900">Free</span>
            ) : (
              <>
                <span className="text-3xl font-bold text-gray-900">${currentPrice}</span>
                <span className="text-gray-600">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </>
            )}
          </div>
          {isAnnual && currentPrice > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-600 text-sm font-medium mt-1"
            >
              Save ${savings} annually
            </motion.p>
          )}
          {currentPrice > 0 && (
            <p className="text-gray-500 text-sm mt-1">
              Equivalent to ${monthlyEquivalent}/month
            </p>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {plan.features.included.map((feature, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              className="flex items-start space-x-3"
            >
              <Check className={`w-5 h-5 ${
                isCurrentPlan ? 'text-green-500' : 'text-green-500'
              } mt-0.5 flex-shrink-0`} />
              <div>
                <p className="text-gray-900 font-medium text-sm">{feature.text}</p>
                <p className="text-gray-500 text-xs">{feature.description}</p>
              </div>
            </motion.div>
          ))}
          
          {plan.features.excluded.map((feature, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              className="flex items-center space-x-3 opacity-50"
            >
              <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-500 text-sm">{feature}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
            isCurrentPlan
              ? 'bg-green-100 text-green-700 border border-green-300 cursor-default'
              : isSelected
              ? `bg-gradient-to-r from-${plan.color}-600 to-${plan.color}-700 text-white shadow-lg`
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          whileHover={isCurrentPlan ? {} : { scale: 1.02 }}
          whileTap={isCurrentPlan ? {} : { scale: 0.98 }}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : isSelected ? 'Upgrade Now' : 'Select Plan'}
        </motion.button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <ReTitle title='Premium'/>
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Crown className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Upgrade Your Career Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            You're currently on the <span className="font-semibold text-green-600">Basic Free Plan</span>. 
            Unlock more powerful AI-powered job search tools and accelerate your career growth.
          </p>

          {/* Billing Toggle */}
          <motion.div
            className="flex items-center justify-center space-x-4 bg-white rounded-2xl p-2 shadow-sm border border-gray-200 inline-flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                !isAnnual
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 relative ${
                isAnnual
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              {isAnnual && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
                >
                  Save 20%
                </motion.span>
              )}
            </button>
          </motion.div>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(plans).map(([planKey, plan]) => (
            <PlanCard key={planKey} planKey={planKey} plan={plan} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumPage;