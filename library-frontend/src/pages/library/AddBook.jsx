import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import libraryOperations from '../../utils/libraryOperations';

function AddBook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookName: '',
    quantity: '',
    author: '',
    category: ''
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
      // Simulate API call to add book
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Trigger real-time dashboard update
      await libraryOperations.bookAdded(
        {
          title: formData.bookName,
          id: Date.now().toString(),
          author: formData.author,
          category: formData.category
        },
        parseInt(formData.quantity)
      );

      setMessage(`✅ Successfully added ${formData.quantity} copies of "${formData.bookName}"`);
      
      // Reset form
      setFormData({
        bookName: '',
        quantity: '',
        author: '',
        category: ''
      });

    } catch (error) {
      setMessage('❌ Error adding book. Please try again.');
      console.error('Error adding book:', error);
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
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Add New Book</h1>
                <p className="text-blue-100 text-sm">Add books to library inventory</p>
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

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter author name"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter book category"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter quantity"
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
                  <span>Adding Book...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add Book</span>
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

export default AddBook;
