import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, LogOut, ChevronDown, ArrowLeft, BookMarked, RotateCcw, DollarSign, Plus } from "lucide-react";

function LibraryDashboard() {
  const navigate = useNavigate();
  const [showBookDropdown, setShowBookDropdown] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    {
      title: "Books Issued",
      icon: <BookMarked className="w-5 h-5" />,
      route: "/library/books-issued",
      description: "View and manage issued books"
    },
    {
      title: "Books Returned",
      icon: <RotateCcw className="w-5 h-5" />,
      route: "/library/books-returned",
      description: "Track returned books"
    },
    {
      title: "Fine Collected",
      icon: <DollarSign className="w-5 h-5" />,
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
                <p className="text-blue-100 text-sm">Logged in as: <span className="font-medium">Library Staff</span></p>
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
            {/* Regular Menu Items */}
            {menuItems.map((item, index) => (
              <motion.button
                key={item.title}
                onClick={() => navigate(item.route)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-large hover:shadow-2xl flex items-center justify-between group"
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
                    <p className="text-blue-100 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}

            {/* Book Add Dropdown */}
            <motion.div variants={itemVariants} className="relative">
              <motion.button
                onClick={() => setShowBookDropdown(!showBookDropdown)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-large hover:shadow-2xl flex items-center justify-between"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-semibold">Book Add</h3>
                    <p className="text-blue-100 text-sm">Manage book inventory</p>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-200 ${
                      showBookDropdown ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </motion.button>

              {/* Dropdown Menu */}
              {showBookDropdown && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-blue-100 overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {bookAddOptions.map((option, index) => (
                    <motion.button
                      key={option.title}
                      onClick={() => {
                        navigate(option.route);
                        setShowBookDropdown(false);
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-blue-50 transition-colors flex items-center space-x-3 border-b border-blue-50 last:border-b-0"
                      whileHover={{ backgroundColor: "#EFF6FF" }}
                    >
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        {option.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-800">{option.title}</h4>
                        <p className="text-xs text-secondary-600">{option.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LibraryDashboard;
