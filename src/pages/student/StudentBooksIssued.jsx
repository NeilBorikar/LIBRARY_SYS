function StudentBooksIssued() {
  // Dummy data for now
  const issuedBooks = [
    {
      id: 1,
      name: "Data Structures",
      issueDate: "2026-01-10",
      dueDate: "2026-01-24",
    },
    {
      id: 2,
      name: "Operating Systems",
      issueDate: "2026-01-05",
      dueDate: "2026-01-19",
    },
  ];

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

export default StudentBooksIssued;
