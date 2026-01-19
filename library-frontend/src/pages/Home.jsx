import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">College Library Management System</h1>

      <div className="role-buttons">
        <button onClick={() => navigate("/admin/login")}>
          Admin
        </button>

        <button onClick={() => navigate("/library/login")}>
          Library Staff
        </button>

        <button onClick={() => navigate("/staff/login")}>
          College Staff
        </button>

        <button onClick={() => navigate("/student/login")}>
          Student
        </button>
      </div>
    </div>
  );
}

export default Home;
