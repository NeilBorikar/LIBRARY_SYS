import { useNavigate } from "react-router-dom";

function StaffDashboard() {
    const navigate = useNavigate();
  // TEMP: frontend-only state
  const isDepositPaid = false; // later comes from backend

  return (
    <div className="staff-dashboard">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="user-info">
          Logged in as: <strong>College Staff</strong>
        </div>
      </div>

      {/* Deposit Status */}
      <div className="deposit-section">
        <h3>Security Deposit Status</h3>

        {isDepositPaid ? (
          <p className="deposit-paid">₹1000 Deposit Paid ✅</p>
        ) : (
          <p className="deposit-unpaid">
            ₹1000 Deposit Not Paid ❌
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="staff-actions">
        <button onClick={() => navigate("/staff/books-issued")}>
            Books Issued
        </button>

        <button onClick={() => navigate("/staff/books-returned")}>
            Books Returned
        </button>

        <button onClick={() => navigate("/staff/fine-history")}>
            Fine History
        </button>
        
        {!isDepositPaid && (
          <button className="pay-deposit-btn">
            Pay Security Deposit
          </button>
        )}
      </div>
    </div>
  );
}

export default StaffDashboard;
