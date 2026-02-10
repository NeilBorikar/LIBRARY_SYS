import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Shield, 
  Users, 
  GraduationCap, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  TrendingUp,
  BookMarked,
  UserCheck
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const statsData = [
    {
      title: "Total Books",
      value: "12,456",
      change: "+12.5%",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Students",
      value: "3,847",
      change: "+8.2%",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Library Staff",
      value: "24",
      change: "+2",
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Books Issued",
      value: "1,234",
      change: "+18.7%",
      icon: <BookMarked className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const managementOptions = [
    {
      title: "Library Staff",
      description: "Manage library personnel and permissions",
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500 to-blue-700",
      hoverColor: "hover:from-blue-600 hover:to-blue-800",
      route: "/admin/library-staff"
    },
    {
      title: "Students",
      description: "Student accounts and library access",
      icon: <GraduationCap className="w-8 h-8" />,
      color: "from-green-500 to-green-700",
      hoverColor: "hover:from-green-600 hover:to-green-800",
      route: "/admin/students"
    },
    {
      title: "College Staff",
      description: "Faculty and staff management",
      icon: <UserCheck className="w-8 h-8" />,
      color: "from-purple-500 to-purple-700",
      hoverColor: "hover:from-purple-600 hover:to-purple-800",
      route: "/admin/staff"
    }
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
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-secondary-800">Admin Dashboard</h1>
                  <p className="text-secondary-600">Library Management System Control Center</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center space-x-3">
              <button className="p-2 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
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
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <div className={`text-white bg-gradient-to-br ${stat.color} p-2 rounded-lg`}>
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

        {/* Management Options */}
        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 
            className="text-2xl font-bold text-secondary-800 mb-6"
            variants={itemVariants}
          >
            Management Options
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {managementOptions.map((option) => (
              <motion.div
                key={option.title}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => navigate(option.route)}
                  className={`
                    w-full p-6 rounded-2xl bg-gradient-to-br ${option.color} ${option.hoverColor}
                    text-white shadow-large hover:shadow-2xl transition-all duration-300
                    transform hover:-translate-y-1 group text-left
                  `}
                >
                  <div className="mb-4">{option.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                  <p className="text-sm opacity-90">{option.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Manage</span>
                    <BarChart3 className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reports Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-large p-8 text-white"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Analytics & Reports</h3>
                <p className="opacity-90 mb-6">
                  View comprehensive reports, analytics, and system insights
                </p>
                <button
                  onClick={() => navigate("/admin/reports")}
                  className="bg-white text-indigo-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Reports
                </button>
              </div>
              <div className="hidden lg:block">
                <BarChart3 className="w-24 h-24 opacity-20" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;
