import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  LogOut, 
  ArrowLeft, 
  BookOpen,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Building,
  UserX,
  Activity,
  BookMarked,
  RotateCcw,
  CreditCard,
  ShieldCheck
} from "lucide-react";
import LeftPanel from "../../components/LeftPanel";
import { useDashboardData, useGlobalStats } from "../../hooks/useDashboardData";

function CollegeStaffDashboard() {
  const navigate = useNavigate();
  const [showQuickStats, setShowQuickStats] = useState(true);
  const [showCharts, setShowCharts] = useState(false);
  
  // Get real-time dashboard data
  const { data: dashboardData, loading, error, refresh } = useDashboardData('college_staff');
  const globalStats = useGlobalStats();
  
  const bookIssueChartRef = useRef(null);
  const fineCollectionChartRef = useRef(null);

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    {
      title: "Books Issued",
      icon: <BookMarked className="w-4 h-4" />,
      route: "/staff/books-issued",
      description: "View your issued books"
    },
    {
      title: "Books Returned",
      icon: <RotateCcw className="w-4 h-4" />,
      route: "/staff/books-returned",
      description: "Track returned books"
    },
    {
      title: "Fine History",
      icon: <DollarSign className="w-4 h-4" />,
      route: "/staff/fine-history",
      description: "View fine payment history"
    },
    {
      title: "Deposit Payment",
      icon: <CreditCard className="w-4 h-4" />,
      route: "/staff/deposit-payment",
      description: "Pay library deposit"
    }
  ];

  // Calculate quick stats from real data
  const quickStats = dashboardData?.statistics || {
    totalBooks: 1000,
    issuedBooks: 245,
    availableBooks: 755,
    overdueBooks: 18
  };

  const departmentStats = dashboardData?.department_stats || [
    { department: "Computer Science", books_issued: 150, students: 45, percentage: 30 },
    { department: "Electronics", books_issued: 120, students: 38, percentage: 24 },
    { department: "Mechanical", books_issued: 95, students: 32, percentage: 19 },
    { department: "Civil", books_issued: 80, students: 28, percentage: 16 },
    { department: "Electrical", books_issued: 55, students: 25, percentage: 11 }
  ];

  const defaulterStudents = dashboardData?.defaulter_students || [
    {
      student_name: "John Doe",
      prn: "2021001",
      department: "Computer Science",
      overdue_books: 2,
      pending_fine: 35,
      email: "john@college.edu"
    },
    {
      student_name: "Jane Smith",
      prn: "2021002",
      department: "Electronics",
      overdue_books: 1,
      pending_fine: 20,
      email: "jane@college.edu"
    },
    {
      student_name: "Mike Johnson",
      prn: "2021003",
      department: "Mechanical",
      overdue_books: 3,
      pending_fine: 50,
      email: "mike@college.edu"
    }
  ];

  const recentActivity = [
    {
      type: "issued",
      student: "John Doe",
      book: "Data Structures and Algorithms",
      department: "Computer Science",
      date: "2024-03-12",
      status: "active"
    },
    {
      type: "fine",
      student: "Jane Smith",
      book: "Database Management Systems",
      department: "Electronics",
      date: "2024-03-11",
      amount: 20,
      status: "paid"
    },
    {
      type: "overdue",
      student: "Mike Johnson",
      book: "Operating Systems",
      department: "Mechanical",
      date: "2024-03-10",
      daysOverdue: 5,
      status: "overdue"
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

  if (loading) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <button 
            onClick={refresh}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container min-h-screen flex">
      {/* Left Panel */}
      <LeftPanel
        title="College Staff Dashboard"
        menuItems={menuItems}
        primaryColor="from-green-600 to-green-700"
        secondaryColor="hover:from-green-700 hover:to-green-800"
        onNavigate={(route) => navigate(route)}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-large"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div variants={itemVariants} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">College Staff Dashboard</h1>
                  <p className="text-green-100 text-sm">
                    {dashboardData?.staff_info?.name} - {dashboardData?.staff_info?.department}
                  </p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowCharts(!showCharts)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowQuickStats(!showQuickStats)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Activity className="w-5 h-5" />
                </button>
                <button 
                  onClick={refresh}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Refresh Data"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        {showQuickStats && (
          <motion.div
            className="max-w-7xl mx-auto px-6 py-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div variants={itemVariants} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 text-sm font-medium">Total Books</p>
                    <p className="text-2xl font-bold text-primary-600 mt-1">{quickStats.totalBooks}</p>
                    <p className="text-xs text-secondary-600 mt-1">In library</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 text-sm font-medium">Issued Books</p>
                    <p className="text-2xl font-bold text-accent-600 mt-1">{quickStats.issuedBooks}</p>
                    <p className="text-xs text-secondary-600 mt-1">
                      {((quickStats.issuedBooks / quickStats.totalBooks) * 100).toFixed(1)}% issued
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                    <BookMarked className="w-6 h-6 text-accent-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 text-sm font-medium">Available Books</p>
                    <p className="text-2xl font-bold text-success-600 mt-1">{quickStats.availableBooks || (quickStats.totalBooks - quickStats.issuedBooks)}</p>
                    <p className="text-xs text-secondary-600 mt-1">Ready to issue</p>
                  </div>
                  <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-success-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 text-sm font-medium">Overdue Books</p>
                    <p className="text-2xl font-bold text-danger-600 mt-1">{quickStats.overdueBooks}</p>
                    <p className="text-xs text-danger-600 mt-1">Need attention</p>
                  </div>
                  <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-danger-600" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Department Statistics */}
        <motion.div
          className="max-w-7xl mx-auto px-6 pb-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-lg font-bold text-secondary-800 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-green-600" />
            Department Book Usage
          </motion.h2>
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-secondary-700 mb-4">Books by Department</h3>
              <div className="space-y-3">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-secondary-700">{dept.department}</span>
                        <span className="text-sm text-secondary-600">{dept.books_issued} books</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${dept.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-secondary-700 mb-4">Top Borrowing Departments</h3>
              <div className="space-y-3">
                {departmentStats
                  .sort((a, b) => b.books_issued - a.books_issued)
                  .slice(0, 5)
                  .map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-600' : 'bg-secondary-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-secondary-800">{dept.department}</p>
                          <p className="text-xs text-secondary-600">{dept.students} students</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">{dept.books_issued}</p>
                        <p className="text-xs text-secondary-600">books</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default CollegeStaffDashboard;
