import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, LogOut, ArrowLeft, BookMarked, RotateCcw, DollarSign } from "lucide-react";

function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    {
      title: "Books Issued",
      icon: <BookMarked className="w-5 h-5" />,
      route: "/student/books-issued",
      description: "View your issued books"
    },
    {
      title: "Books Returned",
      icon: <RotateCcw className="w-5 h-5" />,
      route: "/student/books-returned",
      description: "Track returned books"
    },
    {
      title: "Fine Paid",
      icon: <DollarSign className="w-5 h-5" />,
      route: "/student/fine-paid",
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
                <p className="text-orange-100 text-sm">Logged in as: <span className="font-medium">Student</span></p>
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
          <div className="space-y-4">
            {/* Menu Items */}
            {menuItems.map((item, index) => (
              <motion.button
                key={item.title}
                onClick={() => navigate(item.route)}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-large hover:shadow-2xl flex items-center justify-between group"
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
                    <p className="text-orange-100 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default StudentDashboard;
