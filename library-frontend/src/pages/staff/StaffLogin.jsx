import { useNavigate } from "react-router-dom";

function StaffLogin() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h2>College Staff Login</h2>

      <form className="login-form">
        <input type="text" placeholder="Staff ID / Email" />
        <input type="password" placeholder="Password" />

        <button type="submit">Login</button>
      </form>

      <p className="signup-text">
        New Staff?{" "}
        <span onClick={() => navigate("/staff/register")}>
          Register here
        </span>
      </p>
    </div>
  );
}

export default StaffLogin;
