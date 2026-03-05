import { useState, useEffect } from "react";
import api from "../../api/axios";

function StaffBooksIssued() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const empId = localStorage.getItem("userIdentifier");
        if (empId) {
          const response = await api.get(`/staff/books-issued?emp_id=${empId}`);
          setIssuedBooks(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch issued books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="staff-books-page">
      <h2 className="page-title">Issued Books</h2>

      {issuedBooks.length === 0 ? (
        <p>No books issued yet.</p>
      ) : (
        <table className="staff-books-table">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Book Name</th>
              <th>Issue Date</th>
              <th>Due Date</th>
            </tr>
          </thead>

          <tbody>
            {issuedBooks.map((book, index) => (
              <tr key={book.transaction_id || index}>
                <td>{index + 1}</td>
                <td>{book.book_name || book.name || "Unknown"}</td>
                <td>{book.issue_date || book.issueDate}</td>
                <td>{book.due_date || book.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StaffBooksIssued;
