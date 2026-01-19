import { useNavigate } from "react-router-dom";

function StudentLogin() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h2>Student Login</h2>

      <form className="login-form">
        <input type="text" placeholder="PRN / Email" />
        <input type="password" placeholder="Password" />

        <button type="submit">Login</button>
      </form>

      <p className="signup-text">
        New Student?{" "}
        <span onClick={() => navigate("/student/register")}>
          Register here
        </span>
      </p>
    </div>
  );
}

export default StudentLogin;
