import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="student-dashboard">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="user-info">
          Logged in as: <strong>Student</strong>
        </div>
      </div>

      {/* Main Actions */}
      <div className="student-actions">
        <button onClick={() => navigate("/student/books-issued")}>
          Books Issued
        </button>

        <button onClick={() => navigate("/student/books-returned")}>
          Books Returned
        </button>

        <button onClick={() => navigate("/student/fine-paid")}>
          Fine Paid
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;
