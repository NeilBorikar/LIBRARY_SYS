function StaffBooksReturned() {
  // Dummy data for UI
  const returnedBooks = [
    {
      id: 1,
      name: "Machine Learning",
      issueDate: "2025-12-15",
      returnDate: "2025-12-30",
    },
    {
      id: 2,
      name: "Computer Graphics",
      issueDate: "2025-11-05",
      returnDate: "2025-11-20",
    },
  ];

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

export default StaffBooksReturned;
