import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/admin/dashboard");
  };

  return (
    <div className="login-container">
      <h2>Admin Login</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Admin ID / Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
