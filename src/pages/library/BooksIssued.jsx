function BooksIssued() {
  return (
    <div className="books-issued-page">
      <h2 className="page-title">Issue Book</h2>

      <form className="issue-form">
        {/* User Type */}
        <select>
          <option value="">Select User Type</option>
          <option value="student">Student</option>
          <option value="staff">College Staff</option>
        </select>

        {/* User ID */}
        <input
          type="text"
          placeholder="Student PRN / Staff ID"
        />

        {/* Book Name */}
        <input
          type="text"
          placeholder="Book Name"
        />

        {/* Issue Date */}
        <input
          type="date"
          placeholder="Issue Date"
        />

        {/* Due Date */}
        <input
          type="date"
          placeholder="Due Date"
        />

        <button type="submit">Issue Book</button>
      </form>
    </div>
  );
}

export default BooksIssued;