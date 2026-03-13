import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  LogOut, 
  ArrowLeft, 
  BookMarked, 
  RotateCcw, 
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Bell,
  BookOpen,
  History
} from "lucide-react";
import LeftPanel from "../../components/LeftPanel";
import { useDashboardData, useGlobalStats } from "../../hooks/useDashboardData";

function StudentDashboardEnhanced() {
  const navigate = useNavigate();
  const [showQuickStats, setShowQuickStats] = useState(true);
  
  // Get real-time dashboard data
  const { data: dashboardData, loading, error, refresh } = useDashboardData('student');
  const globalStats = useGlobalStats();

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    {
      title: "Books Issued",
      icon: <BookMarked className="w-4 h-4" />,
      route: "/student/books-issued",
      description: "View your issued books"
    },
    {
      title: "Books Returned",
      icon: <RotateCcw className="w-4 h-4" />,
      route: "/student/books-returned",
      description: "Track returned books"
    },
    {
      title: "Fine Paid",
      icon: <DollarSign className="w-4 h-4" />,
      route: "/student/fine-paid",
      description: "View fine payment history"
    }
  ];

  // Calculate quick stats from real data
  const quickStats = dashboardData ? {
    totalBorrowed: dashboardData.statistics?.total_borrowed || 0,
    currentlyIssued: dashboardData.current_books?.length || 0,
    pendingFine: dashboardData.statistics?.pending_fine || 0,
    booksReturned: dashboardData.book_history?.length || 0
  } : {
    totalBorrowed: 0,
    currentlyIssued: 0,
    pendingFine: 0,
    booksReturned: 0
  };

  // Process recent activity from real data
  const recentActivity = dashboardData ? [
    ...(dashboardData.current_books?.map(book => ({
      type: "issued",
      book: book.book_title,
      date: book.issue_date,
      status: "active"
    })) || []),
    ...(dashboardData.book_history?.slice(0, 2).map(book => ({
      type: "returned",
      book: book.book_title,
      date: book.return_date,
      status: "completed"
    })) || []),
    ...(dashboardData.fine_history?.slice(0, 1).map(fine => ({
      type: "fine",
      book: fine.book_title,
      date: fine.paid_date,
      amount: fine.fine_amount,
      status: "paid"
    })) || [])
  ] : [];

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
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
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
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
        title="Student Dashboard"
        menuItems={menuItems}
        primaryColor="from-orange-600 to-orange-700"
        secondaryColor="hover:from-orange-700 hover:to-orange-800"
        onNavigate={(route) => navigate(route)}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-large"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div variants={itemVariants} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Student Dashboard</h1>
                  <p className="text-orange-100 text-sm">
                    {dashboardData?.student_info?.name} - {dashboardData?.student_info?.department}
                  </p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowQuickStats(!showQuickStats)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
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
                    <p className="text-secondary-600 text-sm font-medium">Total Borrowed</p>
                    <p className="text-2xl font-bold text-primary-600 mt-1">{quickStats.totalBorrowed}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 text-sm font-medium">Currently Issued</p>
                    <p className="text-2xl font-bold text-accent-600 mt-1">{quickStats.currentlyIssued}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                    <BookMarked className="w-6 h-6 text-accent-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 text-sm font-medium">Books Returned</p>
                    <p className="text-2xl font-bold text-success-600 mt-1">{quickStats.booksReturned}</p>
                  </div>
                  <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 text-sm font-medium">Pending Fine</p>
                    <p className="text-2xl font-bold text-danger-600 mt-1">₹{quickStats.pendingFine}</p>
                  </div>
                  <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-danger-600" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div
          className="max-w-7xl mx-auto px-6 pb-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-lg font-bold text-secondary-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-600" />
            Recent Activity
          </motion.h2>
          <motion.div variants={itemVariants} className="card">
            <div className="space-y-3">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'issued' ? 'bg-accent-100' :
                      activity.type === 'returned' ? 'bg-success-100' : 'bg-warning-100'
                    }`}>
                      {activity.type === 'issued' && <BookMarked className="w-4 h-4 text-accent-600" />}
                      {activity.type === 'returned' && <CheckCircle className="w-4 h-4 text-success-600" />}
                      {activity.type === 'fine' && <DollarSign className="w-4 h-4 text-warning-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-secondary-800">{activity.book}</p>
                      <p className="text-sm text-secondary-600">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount && <p className="font-medium text-warning-600">₹{activity.amount}</p>}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === 'active' ? 'bg-accent-100 text-accent-800' :
                      activity.status === 'completed' ? 'bg-success-100 text-success-800' :
                      'bg-warning-100 text-warning-800'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-center text-secondary-500 py-8">No recent activity</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default StudentDashboardEnhanced;
