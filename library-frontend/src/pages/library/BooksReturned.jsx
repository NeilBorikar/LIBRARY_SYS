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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="books-returned-page">
      <h2 className="page-title">Return Book</h2>

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
    </div>
  );
}

export default BooksReturned;
