import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Calendar, ArrowLeft, BookMarked } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function BooksIssued() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_type: '',
    user_id: '',
    book_name: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchIssuedBooks = async () => {
    try {
      const response = await api.get("/library/books-issued");
      setIssuedBooks(response.data);
    } catch (err) {
      console.error("Error fetching issued books:", err);
    }
  };

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await api.post("/library/issue-book", {
        user_type: formData.user_type,
        user_id: formData.user_id,
        book_name: formData.book_name,
        issue_date: formData.issue_date,
        due_date: formData.due_date
      });
      setMessage(`✅ Successfully issued "${formData.book_name}" to ${formData.user_id}`);
      
      // Reset form
      setFormData({
        user_type: '',
        user_id: '',
        book_name: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      fetchIssuedBooks(); // refresh list

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
                name="user_type"
                value={formData.user_type}
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
                {formData.user_type === 'student' ? 'Student PRN' : 'Staff ID'} *
              </label>
              <input
                type="text"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={formData.user_type === 'student' ? 'Enter Student PRN' : 'Enter Staff ID'}
              />
            </div>

            {/* Book Name */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Book Name *
              </label>
              <input
                type="text"
                name="book_name"
                value={formData.book_name}
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
                name="issue_date"
                value={formData.issue_date}
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
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                required
                min={formData.issue_date}
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

        {/* Currently Issued Books Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg mt-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Currently Issued Books</h3>
          {issuedBooks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No books currently issued.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Book Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Issue Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedBooks.map((book, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 capitalize">{book.user_type}</td>
                      <td className="py-3 px-4">{book.user_id}</td>
                      <td className="py-3 px-4">{book.book_name}</td>
                      <td className="py-3 px-4">{book.issue_date}</td>
                      <td className="py-3 px-4">{book.due_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default BooksIssued;