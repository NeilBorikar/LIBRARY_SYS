import { useNavigate } from "react-router-dom";

const LibraryLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/library/dashboard");
  };

  return (
    <div className="login-container">
      <h2>Library Staff Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Library Staff ID / Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LibraryLogin;
