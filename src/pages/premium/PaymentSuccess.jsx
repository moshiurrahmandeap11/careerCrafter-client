import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get('transactionId');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (transactionId) {
          // Simulate API call to verify payment
          setTimeout(() => {
            setStatus('success');
            setMessage('Your payment was successful and your premium features have been activated!');
          }, 2000);
        } else {
          setStatus('failed');
          setMessage('No transaction ID found. Please contact support.');
        }
      } catch (error) {
        setStatus('failed');
        setMessage('Error verifying payment. Please check your account or contact support.');
      }
    };

    verifyPayment();
  }, [transactionId]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <Loader className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
          {transactionId && (
            <p className="text-sm text-gray-500 mt-4">
              Transaction ID: {transactionId}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {status === 'success' ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-6 text-lg">
              {message}
            </p>
            {transactionId && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Transaction ID:</span> {transactionId}
                </p>
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/premium')}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Back to Premium
              </button>
            </div>
          </>
        ) : (
          <>
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
            <p className="text-gray-600 mb-6 text-lg">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/premium')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/support')}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                Contact Support
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;