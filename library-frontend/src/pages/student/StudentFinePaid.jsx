import { useEffect, useState } from "react";
import api from "../../api/axios";

function StudentFinePaid() {
  const [fineHistory, setFineHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const prn = localStorage.getItem("userIdentifier");
        if (prn) {
          const response = await api.get(`/student/fine-paid?prn=${prn}`);
          setFineHistory(response.data);
        }
      } catch (error) {
        console.error("Error fetching fine history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFines();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

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
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{fine.book_name}</td>
                <td>{fine.amount}</td>
                <td>{new Date(fine.paid_at).toLocaleDateString()}</td>
                <td>{fine.payment_mode}</td>
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
