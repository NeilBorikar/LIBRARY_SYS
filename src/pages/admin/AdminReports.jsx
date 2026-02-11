import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, Download, Calendar, TrendingUp, BookOpen, Users, UserCheck } from "lucide-react";

function AdminReports() {
  const navigate = useNavigate();

  // Sample data
  const reportStats = [
    { title: "Total Books Issued", value: "1,234", change: "+18.7%", icon: <BookOpen className="w-5 h-5" />, color: "from-blue-500 to-blue-600" },
    { title: "Active Students", value: "3,847", change: "+8.2%", icon: <Users className="w-5 h-5" />, color: "from-green-500 to-green-600" },
    { title: "Library Staff", value: "24", change: "+2", icon: <UserCheck className="w-5 h-5" />, color: "from-purple-500 to-purple-600" },
    { title: "College Staff", value: "156", change: "+12", icon: <Users className="w-5 h-5" />, color: "from-orange-500 to-orange-600" },
  ];

  const recentReports = [
    { id: 1, name: "Monthly Library Usage Report", date: "2024-01-31", type: "Monthly", status: "Generated" },
    { id: 2, name: "Student Registration Report", date: "2024-01-30", type: "Weekly", status: "Generated" },
    { id: 3, name: "Book Circulation Analysis", date: "2024-01-29", type: "Monthly", status: "Processing" },
    { id: 4, name: "Staff Performance Report", date: "2024-01-28", type: "Monthly", status: "Generated" },
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
                <h1 className="text-3xl font-bold text-secondary-800">Analytics & Reports</h1>
                <p className="text-secondary-600">View comprehensive reports and system insights</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>Export All</span>
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {reportStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-secondary-800">{stat.value}</h3>
              <p className="text-secondary-600 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Report Generation Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Generate New Report */}
          <motion.div
            className="bg-white rounded-2xl shadow-large p-6 border border-secondary-100"
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold text-secondary-800 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Generate New Report
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Report Type</label>
                <select className="input-field">
                  <option value="">Select Report Type</option>
                  <option value="usage">Library Usage Report</option>
                  <option value="circulation">Book Circulation Report</option>
                  <option value="registration">Student Registration Report</option>
                  <option value="performance">Staff Performance Report</option>
                  <option value="inventory">Inventory Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" className="input-field" />
                  <input type="date" className="input-field" />
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-large hover:shadow-2xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Generate Report
              </button>
            </div>
          </motion.div>

          {/* Recent Reports */}
          <motion.div
            className="bg-white rounded-2xl shadow-large p-6 border border-secondary-100"
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold text-secondary-800 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Reports
            </h2>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-secondary-800">{report.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-secondary-600 mt-1">
                      <span>{report.date}</span>
                      <span className="text-xs px-2 py-1 bg-secondary-100 rounded-full">{report.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'Generated' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminReports;
