import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Users, Plus, Edit, Trash2, Search, Filter, X } from "lucide-react";
import api from "../../api/axios";

function AdminLibraryStaff() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    staff_id: "",
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const [libraryStaff, setLibraryStaff] = useState([
    { id: 1, name: "John Smith", email: "john@library.edu", role: "Head Librarian", status: "Active" },
    { id: 2, name: "Sarah Johnson", email: "sarah@library.edu", role: "Assistant Librarian", status: "Active" },
    { id: 3, name: "Michael Brown", email: "michael@library.edu", role: "Library Assistant", status: "On Leave" },
    { id: 4, name: "Emily Davis", email: "emily@library.edu", role: "Digital Librarian", status: "Active" },
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post("/library/register", formData);
      setMessage({ type: "success", text: "Library Staff registered successfully!" });

      // Optionally add to dummy list for presentation
      setLibraryStaff([...libraryStaff, {
        id: libraryStaff.length + 1,
        name: formData.name,
        email: formData.email,
        role: "New Librarian",
        status: "Active"
      }]);

      setFormData({ staff_id: "", name: "", email: "", password: "" });
      setTimeout(() => setShowForm(false), 2000);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.detail || "Failed to register staff" });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-white rounded-2xl shadow-large p-6 mb-8 border border-secondary-100"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex items-center justify-between">
            <motion.div variants={itemVariants} className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-secondary-800">Library Staff Management</h1>
                <p className="text-secondary-600">Manage library personnel and permissions</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{showForm ? "Cancel" : "Add Staff"}</span>
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Add Staff Form Toggle */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white rounded-2xl shadow-large p-6 border border-secondary-100">
                <h2 className="text-xl font-bold mb-4">Register Library Staff</h2>

                {message.text && (
                  <div className={`p-3 rounded-lg text-sm mb-4 ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Staff ID</label>
                    <input type="text" name="staff_id" value={formData.staff_id} onChange={handleChange} required className="input-field" placeholder="L-123" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="staff@library.edu" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input type="password" name="password" minLength="6" value={formData.password} onChange={handleChange} required className="input-field" placeholder="min 6 chars" />
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                      {loading ? "Registering..." : "Submit Registration"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter */}
        <motion.div
          className="bg-white rounded-2xl shadow-large p-6 mb-8 border border-secondary-100"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search library staff..."
                className="input-field pl-10"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </motion.div>

        {/* Staff Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-large overflow-hidden border border-secondary-100"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="modern-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {libraryStaff.map((staff, index) => (
                <motion.tr
                  key={staff.id}
                  variants={itemVariants}
                  className="hover:bg-secondary-50 transition-colors"
                >
                  <td className="font-medium text-secondary-800">{staff.name}</td>
                  <td className="text-secondary-600">{staff.email}</td>
                  <td className="text-secondary-600">{staff.role}</td>
                  <td>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${staff.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminLibraryStaff;
