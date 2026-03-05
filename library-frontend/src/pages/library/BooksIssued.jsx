import { useState, useEffect } from "react";
import api from "../../api/axios";

function BooksIssued() {
  const [formData, setFormData] = useState({
    user_type: "",
    user_id: "",
    book_name: "",
    issue_date: "",
    due_date: ""
  });
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/library/issue-book", formData);
      setSuccess("Book issued successfully!");
      setFormData({
        user_type: "",
        user_id: "",
        book_name: "",
        issue_date: "",
        due_date: ""
      });
      fetchIssuedBooks(); // refresh list
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to issue book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="books-issued-page">
      <h2 className="page-title">Issue Book</h2>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg mb-4">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-600 rounded-lg mb-4">{success}</div>}

      <form className="issue-form" onSubmit={handleSubmit}>
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
        <input
          type="date"
          name="issue_date"
          placeholder="Issue Date"
          value={formData.issue_date}
          onChange={handleChange}
          required
        />

        {/* Due Date */}
        <input
          type="date"
          name="due_date"
          placeholder="Due Date"
          value={formData.due_date}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Issuing..." : "Issue Book"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Currently Issued Books</h3>
        {issuedBooks.length === 0 ? (
          <p>No books currently issued.</p>
        ) : (
          <table className="staff-books-table w-full">
            <thead>
              <tr>
                <th>User Type</th>
                <th>User ID</th>
                <th>Book Name</th>
                <th>Issue Date</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {issuedBooks.map((book, idx) => (
                <tr key={idx}>
                  <td className="capitalize">{book.user_type}</td>
                  <td>{book.user_id}</td>
                  <td>{book.book_name}</td>
                  <td>{book.issue_date}</td>
                  <td>{book.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default BooksIssued;