import { useEffect, useState } from "react";
import api from "../../api/axios";

function StudentBooksIssued() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const prn = localStorage.getItem("userIdentifier");
        if (prn) {
          const response = await api.get(`/student/books-issued?prn=${prn}`);
          setIssuedBooks(response.data);
        }
      } catch (error) {
        console.error("Error fetching issued books:", error);
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
      <h2 className="page-title">My Issued Books</h2>

      {issuedBooks.length === 0 ? (
        <p>No books issued yet.</p>
      ) : (
        <table className="student-books-table">
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
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{book.book_name}</td>
                <td>{new Date(book.issue_date).toLocaleDateString()}</td>
                <td>{new Date(book.due_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentBooksIssued;
