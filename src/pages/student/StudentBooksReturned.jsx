import { useEffect, useState } from "react";
import api from "../../api/axios";

function StudentBooksReturned() {
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const prn = localStorage.getItem("userIdentifier");
        if (prn) {
          const response = await api.get(`/student/books-returned?prn=${prn}`);
          setReturnedBooks(response.data);
        }
      } catch (error) {
        console.error("Error fetching returned books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="student-books-page">
      <h2 className="page-title">Returned Books</h2>

      {returnedBooks.length === 0 ? (
        <p>No books returned yet.</p>
      ) : (
        <table className="student-books-table">
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
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{book.book_name}</td>
                <td>{new Date(book.issue_date).toLocaleDateString()}</td>
                <td>{book.return_date ? new Date(book.return_date).toLocaleDateString() : "-"}</td>
                <td className="status-returned">Returned</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentBooksReturned;
