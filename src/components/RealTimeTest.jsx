import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, RotateCcw, Users, DollarSign } from 'lucide-react';
import realtimeUpdater from '../utils/realtimeUpdater';

// Test component to demonstrate real-time dashboard updates
const RealTimeTest = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  const handleBookIssue = async () => {
    setIsProcessing(true);
    try {
      await realtimeUpdater.simulateBookIssue(
        "Data Structures and Algorithms",
        "John Doe",
        "Computer Science"
      );
      setLastTransaction({
        success: true,
        message: "Book issued - All dashboards updated!",
        type: "issue"
      });
    } catch (error) {
      console.error('Error issuing book:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBookReturn = async () => {
    setIsProcessing(true);
    try {
      await realtimeUpdater.simulateBookReturn(
        "Introduction to Algorithms",
        "Jane Smith",
        "Electronics"
      );
      setLastTransaction({
        success: true,
        message: "Book returned - All dashboards updated!",
        type: "return"
      });
    } catch (error) {
      console.error('Error returning book:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinePayment = async () => {
    setIsProcessing(true);
    try {
      await realtimeUpdater.simulateFinePayment(
        "Mike Johnson",
        25
      );
      setLastTransaction({
        success: true,
        message: "Fine paid - All dashboards updated!",
        type: "fine_payment"
      });
    } catch (error) {
      console.error('Error processing fine:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-lg shadow-2xl border border-secondary-200 p-4 w-80"
      >
        <h3 className="font-bold text-secondary-800 mb-3 flex items-center">
          <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
          Real-Time Test Panel
        </h3>
        
        <div className="space-y-2">
          <button
            onClick={handleBookIssue}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Issue Book'}
          </button>
          
          <button
            onClick={handleBookReturn}
            disabled={isProcessing}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Return Book'}
          </button>
          
          <button
            onClick={handleFinePayment}
            disabled={isProcessing}
            className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Pay Fine'}
          </button>
        </div>

        {lastTransaction && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 p-2 rounded-lg text-xs ${
              lastTransaction.type === 'issue' ? 'bg-blue-50 text-blue-700' :
              lastTransaction.type === 'return' ? 'bg-green-50 text-green-700' :
              'bg-yellow-50 text-yellow-700'
            }`}
          >
            <p className="font-medium">{lastTransaction.message}</p>
            <p className="text-xs opacity-75 mt-1">
              {new Date().toLocaleTimeString()}
            </p>
          </motion.div>
        )}

        <div className="mt-3 text-xs text-secondary-500">
          <p>💡 Test real-time updates</p>
          <p>📊 Watch all dashboards update!</p>
          <p>🎨 Student: Orange | Library: Blue | College: Green</p>
        </div>
      </motion.div>
    </div>
  );
};

export default RealTimeTest;
