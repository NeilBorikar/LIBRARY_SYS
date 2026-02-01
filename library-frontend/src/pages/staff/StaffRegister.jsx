import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StaffRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    empId: "",
    email: "",
    mobile: "",
    department: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid =
    formData.empId &&
    formData.email &&
    formData.mobile &&
    formData.department;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Please fill all the above details");
      return;
    }

    setError("");
    navigate("/staff/login");
  };

  return (
    <div className="register-page">
      <h2 className="page-title">College Staff Registration</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="empId"
          placeholder="Employee ID"
          value={formData.empId}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
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

export default StaffRegister;
