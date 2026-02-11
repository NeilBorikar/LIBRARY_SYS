function StudentFinePaid() {
  // Dummy data for UI
  const fineHistory = [
    {
      id: 1,
      bookName: "Operating Systems",
      amount: 50,
      paymentDate: "2026-01-12",
      paymentMode: "Cash",
    },
    {
      id: 2,
      bookName: "Database Management Systems",
      amount: 30,
      paymentDate: "2025-12-05",
      paymentMode: "UPI",
    },
  ];

  return (
    <div className="student-books-page">
      <h2 className="page-title">Fine Payment History</h2>

      {fineHistory.length === 0 ? (
        <p>No fine payments yet.</p>
      ) : (
        <table className="student-books-table">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Book Name</th>
              <th>Fine Amount (₹)</th>
              <th>Payment Date</th>
              <th>Payment Mode</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {fineHistory.map((fine, index) => (
              <tr key={fine.id}>
                <td>{index + 1}</td>
                <td>{fine.bookName}</td>
                <td>{fine.amount}</td>
                <td>{fine.paymentDate}</td>
                <td>{fine.paymentMode}</td>
                <td className="status-paid">Paid</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentFinePaid;
