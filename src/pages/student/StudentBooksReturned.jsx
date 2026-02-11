function StudentBooksReturned() {
  // Dummy data for UI
  const returnedBooks = [
    {
      id: 1,
      name: "Computer Networks",
      issueDate: "2025-12-20",
      returnDate: "2026-01-05",
    },
    {
      id: 2,
      name: "Database Management Systems",
      issueDate: "2025-11-10",
      returnDate: "2025-11-25",
    },
  ];

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
              <tr key={book.id}>
                <td>{index + 1}</td>
                <td>{book.name}</td>
                <td>{book.issueDate}</td>
                <td>{book.returnDate}</td>
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
