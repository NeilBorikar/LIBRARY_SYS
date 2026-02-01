import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prn: "",
    email: "",
    branch: "",
    mobile: "",
  });

  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Check if all fields are filled
  const isFormValid =
    formData.prn &&
    formData.email &&
    formData.branch &&
    formData.mobile;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Please fill all the above details");
      return;
    }

    // Frontend-only success
    setError("");
    navigate("/student/login");
  };

  return (
    <div className="register-page">
      <h2 className="page-title">Student Registration</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="prn"
          placeholder="PRN Number"
          value={formData.prn}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <select
          name="branch"
          value={formData.branch}
          onChange={handleChange}
        >
          <option value="">Select Program</option>
          <option value="UG">UG</option>
          <option value="PG">PG</option>
          <option value="PHD">PHD</option>
        </select>

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={!isFormValid}>
          Register
        </button>
      </form>
    </div>
  );
}

export default StudentRegister;
