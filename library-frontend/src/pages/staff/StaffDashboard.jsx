import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, LogOut, ArrowLeft, BookMarked, RotateCcw, DollarSign, ShieldCheck, CreditCard } from "lucide-react";

function StaffDashboard() {
  const navigate = useNavigate();
  
  // TEMP: frontend-only state
  const isDepositPaid = false; // later comes from backend

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    {
      title: "Books Issued",
      icon: <BookMarked className="w-5 h-5" />,
      route: "/staff/books-issued",
      description: "View your issued books"
    },
    {
      title: "Books Returned",
      icon: <RotateCcw className="w-5 h-5" />,
      route: "/staff/books-returned",
      description: "Track returned books"
    },
    {
      title: "Fine History",
      icon: <DollarSign className="w-5 h-5" />,
      route: "/staff/fine-history",
      description: "View fine payment history"
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
    <div className="page-container min-h-screen">
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
                <p className="text-green-100 text-sm">Logged in as: <span className="font-medium">College Staff</span></p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center space-x-3">
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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Deposit Status Card */}
          <motion.div
            className="bg-white rounded-2xl shadow-large p-6 mb-6 border border-green-100"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDepositPaid 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {isDepositPaid ? (
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-800">Security Deposit Status</h3>
                  <p className={`text-sm font-medium ${
                    isDepositPaid 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {isDepositPaid ? '₹1000 Deposit Paid ✅' : '₹1000 Deposit Not Paid ❌'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Menu Items */}
          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.title}
                onClick={() => navigate(item.route)}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-large hover:shadow-2xl flex items-center justify-between group"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-green-100 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}

            {/* Pay Deposit Button */}
            {!isDepositPaid && (
              <motion.button
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-large hover:shadow-2xl flex items-center justify-center"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pay Security Deposit
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StaffDashboard;
