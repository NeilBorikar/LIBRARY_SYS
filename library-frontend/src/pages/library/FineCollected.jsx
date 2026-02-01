function FineCollected() {
  return (
    <div className="fine-collected-page">
      <h2 className="page-title">Fine Collection</h2>

      <form className="fine-form">
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

        {/* Fine Amount */}
        <input
          type="number"
          placeholder="Fine Amount (₹)"
        />

        <label>payment date</label>
        <input type="date" />
        {/* Payment Mode */}
        <select>
          <option value="">Select Payment Mode</option>
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
        </select>

        <button type="submit">Collect Fine</button>
      </form>
    </div>
  );
}

export default FineCollected;
