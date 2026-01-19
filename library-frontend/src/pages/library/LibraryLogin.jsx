const LibraryLogin = () => {
  return (
    <div className="login-container">
      <h2>Library Staff Login</h2>
      <form className="login-form">
        <input type="text" placeholder="Library Staff ID / Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LibraryLogin;