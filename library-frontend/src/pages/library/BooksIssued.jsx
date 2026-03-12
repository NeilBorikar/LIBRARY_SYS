import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Calendar, ArrowLeft, BookMarked } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import libraryOperations from '../../utils/libraryOperations';

function BooksIssued() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: '',
    userId: '',
    bookName: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days from now
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // Simulate API call to issue book
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Trigger real-time dashboard update
      await libraryOperations.bookIssued(
        {
          title: formData.bookName,
          id: Date.now().toString(),
          dueDate: formData.dueDate
        },
        {
          name: formData.userId, // In real app, would fetch user details
          id: formData.userId,
          department: formData.userType === 'student' ? 'Computer Science' : 'Engineering'
        }
      );

      setMessage(`✅ Successfully issued "${formData.bookName}" to ${formData.userId}`);
      
      // Reset form
      setFormData({
        userType: '',
        userId: '',
        bookName: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });

    } catch (error) {
      setMessage('❌ Error issuing book. Please try again.');
      console.error('Error issuing book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-6"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <BookMarked className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Issue Book</h1>
                <p className="text-blue-100 text-sm">Issue books to students and staff</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/library/dashboard')}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-b-xl p-6 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                User Type *
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select User Type</option>
                <option value="student">Student</option>
                <option value="staff">College Staff</option>
              </select>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                {formData.userType === 'student' ? 'Student PRN' : 'Staff ID'} *
              </label>
              <input
                type="text"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={formData.userType === 'student' ? 'Enter Student PRN' : 'Enter Staff ID'}
              />
            </div>

            {/* Book Name */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Book Name *
              </label>
              <input
                type="text"
                name="bookName"
                value={formData.bookName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter book name"
              />
            </div>

            {/* Issue Date */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Issue Date *
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
                min={formData.issueDate}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Issuing Book...</span>
                </>
              ) : (
                <>
                  <BookMarked className="w-5 h-5" />
                  <span>Issue Book</span>
                </>
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg text-sm ${
                message.includes('✅') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default BooksIssued;