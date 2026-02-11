import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Plus, Edit, Trash2, Search, Filter } from "lucide-react";

function AdminStudents() {
  const navigate = useNavigate();

  // Sample data
  const students = [
    { id: 1, name: "Alice Johnson", prn: "2024001", email: "alice@college.edu", program: "UG", status: "Active" },
    { id: 2, name: "Bob Smith", prn: "2024002", email: "bob@college.edu", program: "PG", status: "Active" },
    { id: 3, name: "Carol Williams", prn: "2024003", email: "carol@college.edu", program: "UG", status: "Suspended" },
    { id: 4, name: "David Brown", prn: "2024004", email: "david@college.edu", program: "PHD", status: "Active" },
    { id: 5, name: "Emma Davis", prn: "2024005", email: "emma@college.edu", program: "UG", status: "Active" },
  ];

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
                <h1 className="text-3xl font-bold text-secondary-800">Student Management</h1>
                <p className="text-secondary-600">Manage student accounts and library access</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            </motion.div>
          </div>
        </motion.div>

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
                placeholder="Search students by name, PRN, or email..."
                className="input-field pl-10"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </motion.div>

        {/* Students Table */}
        <motion.div
          className="bg-white rounded-2xl shadow-large overflow-hidden border border-secondary-100"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="modern-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>PRN</th>
                <th>Email</th>
                <th>Program</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <motion.tr
                  key={student.id}
                  variants={itemVariants}
                  className="hover:bg-secondary-50 transition-colors"
                >
                  <td className="font-medium text-secondary-800">{student.name}</td>
                  <td className="text-secondary-600">{student.prn}</td>
                  <td className="text-secondary-600">{student.email}</td>
                  <td className="text-secondary-600">{student.program}</td>
                  <td>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      student.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.status}
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

export default AdminStudents;
