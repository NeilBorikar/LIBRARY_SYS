function BooksReturned() {
  return (
    <div className="books-returned-page">
      <h2 className="page-title">Return Book</h2>

      <form className="return-form">
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
       <label>Issue Date</label>
        <input type="date" />


        {/* Due Date */}
        <label>Due Date</label>
        <input type="date" />

        {/* Return Date */}
        <label>Return Date</label>
          <input type="date"/>

        <button type="submit">Mark as Returned</button>
      </form>
    </div>
  );
}

export default BooksReturned;
