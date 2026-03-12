<<<<<<< HEAD
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Users, Calendar, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import libraryOperations from '../../utils/libraryOperations';

function BooksReturned() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userType: '',
    userId: '',
    bookName: '',
    issueDate: '',
    dueDate: '',
    returnDate: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
=======
import { useState, useEffect } from "react";
import api from "../../api/axios";

function BooksReturned() {
  const [formData, setFormData] = useState({
    user_type: "",
    user_id: "",
    book_name: "",
    issue_date: "",
    return_date: ""
  });
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReturnedBooks = async () => {
    try {
      const response = await api.get("/library/books-returned");
      setReturnedBooks(response.data);
    } catch (err) {
      console.error("Error fetching returned books:", err);
    }
  };

  useEffect(() => {
    fetchReturnedBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
>>>>>>> e6d8db4533e4bd76b2850fb35827a25a589cf1bb
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    setIsSubmitting(true);
    setMessage('');

    try {
      // Simulate API call to return book
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Trigger real-time dashboard update
      await libraryOperations.bookReturned(
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

      setMessage(`✅ Successfully returned "${formData.bookName}" from ${formData.userId}`);
      
      // Reset form
      setFormData({
        userType: '',
        userId: '',
        bookName: '',
        issueDate: '',
        dueDate: '',
        returnDate: new Date().toISOString().split('T')[0]
      });

    } catch (error) {
      setMessage('❌ Error returning book. Please try again.');
      console.error('Error returning book:', error);
    } finally {
      setIsSubmitting(false);
=======
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/library/return-book", formData);
      setSuccess("Book returned successfully!");
      setFormData({
        user_type: "",
        user_id: "",
        book_name: "",
        issue_date: "",
        return_date: ""
      });
      fetchReturnedBooks(); // refresh list
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to return book");
    } finally {
      setLoading(false);
>>>>>>> e6d8db4533e4bd76b2850fb35827a25a589cf1bb
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
                <RotateCcw className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Return Book</h1>
                <p className="text-blue-100 text-sm">Mark books as returned and update inventory</p>
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

<<<<<<< HEAD
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
=======
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg mb-4">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-600 rounded-lg mb-4">{success}</div>}

      <form className="return-form" onSubmit={handleSubmit}>
        {/* User Type */}
        <select name="user_type" value={formData.user_type} onChange={handleChange} required>
          <option value="">Select User Type</option>
          <option value="student">Student</option>
          <option value="staff">College Staff</option>
        </select>

        {/* User ID */}
        <input
          type="text"
          name="user_id"
          placeholder="Student PRN / Staff ID"
          value={formData.user_id}
          onChange={handleChange}
          required
        />

        {/* Book Name */}
        <input
          type="text"
          name="book_name"
          placeholder="Book Name"
          value={formData.book_name}
          onChange={handleChange}
          required
        />

        {/* Issue Date */}
        <label>Issue Date</label>
        <input type="date" name="issue_date" value={formData.issue_date} onChange={handleChange} required />
>>>>>>> e6d8db4533e4bd76b2850fb35827a25a589cf1bb

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
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

<<<<<<< HEAD
            {/* Return Date */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Return Date *
              </label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                required
                min={formData.dueDate}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-400 disabled:to-green-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Return...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Mark as Returned</span>
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
=======
        {/* Return Date */}
        <label>Return Date</label>
        <input type="date" name="return_date" value={formData.return_date} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Marking..." : "Mark as Returned"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Returned Books Records</h3>
        {returnedBooks.length === 0 ? (
          <p>No books returned yet.</p>
        ) : (
          <table className="staff-books-table w-full">
            <thead>
              <tr>
                <th>User Type</th>
                <th>User ID</th>
                <th>Book Name</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {returnedBooks.map((book, idx) => (
                <tr key={idx}>
                  <td className="capitalize">{book.user_type}</td>
                  <td>{book.user_id}</td>
                  <td>{book.book_name}</td>
                  <td>{book.issue_date}</td>
                  <td>{book.return_date}</td>
                  <td className="status-returned">Returned</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
>>>>>>> e6d8db4533e4bd76b2850fb35827a25a589cf1bb
    </div>
  );
}

export default BooksReturned;
