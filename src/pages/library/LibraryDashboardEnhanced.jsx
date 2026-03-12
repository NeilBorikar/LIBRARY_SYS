import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen,
  Users,
  Calendar,
  Bell,
  BarChart3,
  Plus,
  ChevronDown,
  RotateCcw,
  Eye,
  Mail,
  AlertTriangle,
  Activity,
  BookMarked,
  DollarSign,
  ArrowLeft,
  LogOut
} from "lucide-react";
import LeftPanel from "../../components/LeftPanel";
import { useDashboardData, useGlobalStats } from "../../hooks/useDashboardData";
import dashboardService from "../../services/dashboardService";

function LibraryDashboardEnhanced() {
  const navigate = useNavigate();
  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const [showQuickStats, setShowQuickStats] = useState(true);
  const [sendingReminders, setSendingReminders] = useState(new Set());
  
  // Get real-time dashboard data
  const { data: dashboardData, loading, error, refresh } = useDashboardData('library_staff');
  const globalStats = useGlobalStats();

  const handleLogout = () => {
    navigate("/");
  };

  const handleSendReminder = async (studentPrn, studentName) => {
    try {
      setSendingReminders(prev => new Set(prev).add(studentPrn));
      
      const result = await dashboardService.sendManualReminder(studentPrn);
      
      // Show success message
      alert(`Reminder sent successfully to ${studentName}!\nEmail: ${result.student_email}\nReminders sent: ${result.reminders_sent}`);
      
      // Refresh dashboard data
      refresh();
    } catch (error) {
      alert(`Failed to send reminder: ${error.message}`);
    } finally {
      setSendingReminders(prev => {
        const newSet = new Set(prev);
        newSet.delete(studentPrn);
        return newSet;
      });
    }
  };

  const menuItems = [
    {
      title: "Books Issued",
      icon: <BookMarked className="w-4 h-4" />,
      route: "/library/books-issued",
      description: "View and manage issued books"
    },
    {
      title: "Books Returned",
      icon: <RotateCcw className="w-4 h-4" />,
      route: "/library/books-returned",
      description: "Track returned books"
    },
    {
      title: "Fine Collected",
      icon: <DollarSign className="w-4 h-4" />,
      route: "/library/fine-collected",
      description: "Manage fine payments"
    }
  ];

  const bookAddOptions = [
    {
      title: "Add Book (Name & Quantity)",
      icon: <Plus className="w-4 h-4" />,
      route: "/library/add-book",
      description: "Add new books to inventory"
    },
    {
      title: "View All Books",
      icon: <BookOpen className="w-4 h-4" />,
      route: "/library/all-books",
      description: "Browse complete book collection"
    }
  ];

  // Calculate quick stats from real data
  const quickStats = dashboardData?.statistics || {
    totalBooks: globalStats.totalBooks || 1000,
    issuedBooks: globalStats.issuedBooks || 245,
    overdueBooks: globalStats.overdueBooks || 18,
    pendingFines: globalStats.pendingFines || 1250.50
  };

  // Process recent activity from real data
  const recentActivity = dashboardData ? [
    ...(dashboardData.notifications?.map(notif => ({
      type: notif.type === "overdue_alert" ? "overdue" : "notification",
      student: "System",
      book: notif.message,
      date: new Date(notif.timestamp).toLocaleDateString(),
      status: notif.severity
    })) || []),
    ...(dashboardData.fine_alerts?.slice(0, 3).map(alert => ({
      type: "fine",
      student: alert.student_name,
      book: alert.book_title,
      date: new Date().toLocaleDateString(),
      amount: alert.fine_amount,
      status: "pending"
    })) || [])
  ] : [];

  // Defaulter students data
  const defaulterStudents = dashboardData?.fine_alerts?.map(alert => ({
    student_name: alert.student_name,
    prn: alert.prn || "N/A",
    department: "Computer Science", // Would come from real data
    overdue_books: 1,
    pending_fine: alert.fine_amount,
    email: alert.student_email
  })) || [
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-danger-100 text-danger-800 border-danger-200';
      case 'medium': return 'bg-warning-100 text-warning-800 border-warning-200';
      case 'low': return 'bg-success-100 text-success-800 border-success-200';
      default: return 'bg-secondary-100 text-secondary-800 border-secondary-200';
    }
  };

  if (loading) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        title="Library Dashboard"
        menuItems={menuItems}
        dropdownOptions={bookAddOptions}
        primaryColor="from-blue-600 to-blue-700"
        secondaryColor="hover:from-blue-700 hover:to-blue-800"
        showDropdown={showBookDropdown}
        onDropdownToggle={() => setShowBookDropdown(!showBookDropdown)}
        onNavigate={(route) => navigate(route)}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-large"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div variants={itemVariants} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Library Staff Dashboard</h1>
                  <p className="text-blue-100 text-sm">
                    {dashboardData?.staff_info?.name} - {dashboardData?.staff_info?.employee_id}
                  </p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-center space-x-3">
                <button 
                  onClick={() => setShowQuickStats(!showQuickStats)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
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
                    <p className="text-xs text-success-600 mt-1">
                      {quickStats.totalBooks - quickStats.issuedBooks} available
                    </p>
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
                    <p className="text-secondary-600 text-sm font-medium">Overdue Books</p>
                    <p className="text-2xl font-bold text-danger-600 mt-1">{quickStats.overdueBooks}</p>
                    <p className="text-xs text-danger-600 mt-1">Need attention</p>
                  </div>
                  <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-danger-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-secondary-600 text-sm font-medium">Pending Fines</p>
                    <p className="text-2xl font-bold text-warning-600 mt-1">₹{quickStats.pendingFines}</p>
                    <p className="text-xs text-warning-600 mt-1">To collect</p>
                  </div>
                  <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-warning-600" />
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
            <Bell className="w-5 h-5 mr-2 text-blue-600" />
            Recent Activity
          </motion.h2>
          <motion.div variants={itemVariants} className="card">
            <div className="space-y-3">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'issued' ? 'bg-accent-100' :
                      activity.type === 'returned' ? 'bg-success-100' :
                      activity.type === 'fine' ? 'bg-warning-100' : 'bg-danger-100'
                    }`}>
                      {activity.type === 'issued' && <BookMarked className="w-4 h-4 text-accent-600" />}
                      {activity.type === 'returned' && <Eye className="w-4 h-4 text-success-600" />}
                      {activity.type === 'fine' && <DollarSign className="w-4 h-4 text-warning-600" />}
                      {activity.type === 'overdue' && <AlertTriangle className="w-4 h-4 text-danger-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-secondary-800">{activity.book}</p>
                      <p className="text-sm text-secondary-600">{activity.student} • {activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount && <p className="font-medium text-warning-600">₹{activity.amount}</p>}
                    {activity.daysOverdue && <p className="font-medium text-danger-600">{activity.daysOverdue} days</p>}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === 'active' ? 'bg-accent-100 text-accent-800' :
                      activity.status === 'completed' ? 'bg-success-100 text-success-800' :
                      activity.status === 'paid' ? 'bg-warning-100 text-warning-800' :
                      activity.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                      getSeverityColor(activity.status)
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

        {/* Defaulter Students */}
        <motion.div
          className="max-w-7xl mx-auto px-6 pb-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-lg font-bold text-secondary-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-blue-600" />
            Defaulter Students
          </motion.h2>
          <motion.div variants={itemVariants} className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary-50 border-b border-secondary-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">
                      Overdue Books
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">
                      Pending Fine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200">
                  {defaulterStudents.map((student, index) => (
                    <tr key={index} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-secondary-900">{student.student_name}</p>
                          <p className="text-sm text-secondary-600">{student.prn}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                        {student.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.overdue_books > 2 
                            ? 'bg-danger-100 text-danger-800'
                            : 'bg-warning-100 text-warning-800'
                        }`}>
                          {student.overdue_books} books
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-danger-600">
                        ₹{student.pending_fine}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleSendReminder(student.prn, student.student_name)}
                            disabled={sendingReminders.has(student.prn)}
                            className={`text-blue-600 hover:text-blue-800 font-medium text-xs ${
                              sendingReminders.has(student.prn) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {sendingReminders.has(student.prn) ? 'Sending...' : 'Send Reminder'}
                          </button>
                          <button className="text-secondary-600 hover:text-secondary-800 font-medium text-xs">
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default LibraryDashboardEnhanced;
