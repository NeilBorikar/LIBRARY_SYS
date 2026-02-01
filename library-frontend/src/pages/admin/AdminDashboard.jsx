import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Select Role</h2>

      <div className="dashboard-buttons">
        <button onClick={() => navigate("/admin/library-staff")}>
          Library Staff
        </button>

        <button onClick={() => navigate("/admin/students")}>
          Students
        </button>

        <button onClick={() => navigate("/admin/staff")}>
          College Staff
        </button>
      </div>

      <div className="report-section">
        <button
          className="report-btn"
          onClick={() => navigate("/admin/reports")}
        >
          View Reports
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
