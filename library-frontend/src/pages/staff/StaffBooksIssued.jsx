function StaffBooksIssued() {
  // Dummy data for UI
  const issuedBooks = [
    {
      id: 1,
      name: "Software Engineering",
      issueDate: "2026-01-08",
      dueDate: "2026-01-22",
    },
    {
      id: 2,
      name: "Artificial Intelligence",
      issueDate: "2026-01-02",
      dueDate: "2026-01-16",
    },
  ];

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
              <tr key={book.id}>
                <td>{index + 1}</td>
                <td>{book.name}</td>
                <td>{book.issueDate}</td>
                <td>{book.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StaffBooksIssued;
