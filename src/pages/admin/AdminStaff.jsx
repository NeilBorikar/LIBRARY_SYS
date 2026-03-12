import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Plus, Edit, Trash2, Search, Filter } from "lucide-react";

function AdminStaff() {
  const navigate = useNavigate();

  // Sample data
  const collegeStaff = [
    { id: 1, name: "Dr. Robert Anderson", empId: "EMP001", email: "robert@college.edu", department: "Computer Science", status: "Active" },
    { id: 2, name: "Prof. Maria Garcia", empId: "EMP002", email: "maria@college.edu", department: "Electronics", status: "Active" },
    { id: 3, name: "Dr. James Wilson", empId: "EMP003", email: "james@college.edu", department: "Mechanical", status: "On Leave" },
    { id: 4, name: "Prof. Linda Martinez", empId: "EMP004", email: "linda@college.edu", department: "Civil", status: "Active" },
    { id: 5, name: "Dr. David Taylor", empId: "EMP005", email: "david@college.edu", department: "Mathematics", status: "Active" },
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
                <h1 className="text-3xl font-bold text-secondary-800">College Staff Management</h1>
                <p className="text-secondary-600">Faculty and staff management</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Staff</span>
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
                placeholder="Search staff by name, employee ID, or email..."
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
                <th>Employee ID</th>
                <th>Email</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collegeStaff.map((staff, index) => (
                <motion.tr
                  key={staff.id}
                  variants={itemVariants}
                  className="hover:bg-secondary-50 transition-colors"
                >
                  <td className="font-medium text-secondary-800">{staff.name}</td>
                  <td className="text-secondary-600">{staff.empId}</td>
                  <td className="text-secondary-600">{staff.email}</td>
                  <td className="text-secondary-600">{staff.department}</td>
                  <td>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      staff.status === 'Active' 
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

export default AdminStaff;
