function ViewAllBooks() {
  // Dummy data for UI
  const books = [
    { id: 1, name: "Data Structures", quantity: 5 },
    { id: 2, name: "Operating Systems", quantity: 3 },
    { id: 3, name: "Computer Networks", quantity: 7 },
  ];

  return (
    <div className="view-books-page">
      <h2 className="page-title">All Books in Library</h2>

      <table className="books-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Book Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book, index) => (
            <tr key={book.id}>
              <td>{index + 1}</td>
              <td>{book.name}</td>
              <td>{book.quantity}</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewAllBooks;
