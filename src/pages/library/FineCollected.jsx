import { useState } from "react";
import api from "../../api/axios";

function FineCollected() {
  const [formData, setFormData] = useState({
    user_type: "",
    user_id: "",
    book_name: "",
    fine_amount: "",
    payment_date: "",
    payment_mode: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/library/collect-fine", formData);
      setSuccess("Fine collected successfully!");
      setFormData({
        user_type: "",
        user_id: "",
        book_name: "",
        fine_amount: "",
        payment_date: "",
        payment_mode: ""
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to collect fine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fine-collected-page">
      <h2 className="page-title">Fine Collection</h2>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg mb-4">{error}</div>}
      {success && <div className="p-3 bg-green-50 text-green-600 rounded-lg mb-4">{success}</div>}

      <form className="fine-form" onSubmit={handleSubmit}>
        {/* User Type */}
        <select name="user_type" value={formData.user_type} onChange={handleChange} required>
          <option value="">Select User Type</option>
          <option value="student">Student</option>
          <option value="staff">College Staff</option>
        </select>

        {/* User ID */}
        <input
          type="text"
          name="user_id"
          placeholder="Student PRN / Staff ID"
          value={formData.user_id}
          onChange={handleChange}
          required
        />

        {/* Book Name */}
        <input
          type="text"
          name="book_name"
          placeholder="Book Name"
          value={formData.book_name}
          onChange={handleChange}
          required
        />

        {/* Fine Amount */}
        <input
          type="number"
          name="fine_amount"
          placeholder="Fine Amount (₹)"
          value={formData.fine_amount}
          onChange={handleChange}
          required
        />

        <label>Payment Date</label>
        <input type="date" name="payment_date" value={formData.payment_date} onChange={handleChange} required />

        {/* Payment Mode */}
        <select name="payment_mode" value={formData.payment_mode} onChange={handleChange} required>
          <option value="">Select Payment Mode</option>
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Collecting..." : "Collect Fine"}
        </button>
      </form>
    </div>
  );
}

export default FineCollected;
