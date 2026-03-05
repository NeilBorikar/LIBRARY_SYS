import { useState, useEffect } from "react";
import api from "../../api/axios";

function StaffBooksReturned() {
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const empId = localStorage.getItem("userIdentifier");
        if (empId) {
          const response = await api.get(`/staff/books-returned?emp_id=${empId}`);
          setReturnedBooks(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch returned books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="staff-books-page">
      <h2 className="page-title">Returned Books</h2>

      {returnedBooks.length === 0 ? (
        <p>No books returned yet.</p>
      ) : (
        <table className="staff-books-table">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Book Name</th>
              <th>Issue Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {returnedBooks.map((book, index) => (
              <tr key={book.transaction_id || index}>
                <td>{index + 1}</td>
                <td>{book.book_name || book.name || "Unknown"}</td>
                <td>{book.issue_date || book.issueDate}</td>
                <td>{book.return_date || book.returnDate}</td>
                <td className="status-returned">Returned</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StaffBooksReturned;
