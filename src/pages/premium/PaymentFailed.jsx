import React from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { XCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get('transactionId');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        >
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-6 text-lg">
          We couldn't process your payment. This could be due to insufficient funds, 
          incorrect payment information, or a temporary issue with the payment gateway.
        </p>
        
        {transactionId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Reference ID:</span> {transactionId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/premium')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Try Payment Again</span>
          </button>
          <button
            onClick={() => navigate('/support')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
          >
            Contact Support
          </button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-700">
            💡 <strong>Tip:</strong> Ensure your payment method has sufficient funds 
            and try using a different payment method if the issue persists.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;