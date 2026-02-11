import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Users, BookOpen, GraduationCap, ArrowRight } from "lucide-react";

const LoginNav = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const loginTypes = [
    {
      title: "Student Portal",
      description: "Access your student account to view books and manage borrowed items",
      icon: <GraduationCap className="w-8 h-8" />,
      color: "from-orange-500 to-orange-700",
      hoverColor: "hover:from-orange-600 hover:to-orange-800",
      route: "/student/login",
      bgGradient: "from-orange-100 to-orange-50"
    },
    {
      title: "College Staff Portal",
      description: "Access your staff account to manage library operations",
      icon: <Users className="w-8 h-8" />,
      color: "from-green-500 to-green-700",
      hoverColor: "hover:from-green-600 hover:to-green-800",
      route: "/staff/login",
      bgGradient: "from-green-100 to-green-50"
    },
    {
      title: "Library Staff Portal",
      description: "Access your library management account for administrative tasks",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-blue-500 to-blue-700",
      hoverColor: "hover:from-blue-600 hover:to-blue-800",
      route: "/library/login",
      bgGradient: "from-blue-100 to-blue-50"
    },
    {
      title: "Admin Portal",
      description: "System administration and oversight",
      icon: <Shield className="w-8 h-8" />,
      color: "from-purple-500 to-purple-700",
      hoverColor: "hover:from-purple-600 hover:to-purple-800",
      route: "/admin/login",
      bgGradient: "from-purple-100 to-purple-50"
    }
  ];

  return (
    <div className="page-container flex items-center justify-center">
      <motion.div
        className="w-full max-w-6xl mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-6">
            Library Management System
          </h1>
          <p className="text-xl md:text-2xl text-secondary-600 font-medium mb-4">
            Select your portal to continue
          </p>
          <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
            Secure access for students, staff, and administrators
          </p>
        </motion.div>

        {/* Login Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          variants={containerVariants}
        >
          {loginTypes.map((login, index) => (
            <motion.div
              key={login.title}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`card bg-gradient-to-br ${login.bgGradient} border-0 p-8 h-full flex flex-col justify-between`}>
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${login.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-large`}>
                    <div className="text-white">
                      {login.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-secondary-800 mb-3">{login.title}</h3>
                  <p className="text-secondary-600 mb-6 text-sm leading-relaxed">{login.description}</p>
                </div>
                <Link
                  to={login.route}
                  className={`w-full bg-gradient-to-r ${login.color} ${login.hoverColor} text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-large hover:shadow-2xl flex items-center justify-center`}
                >
                  <span>Access Portal</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="text-center"
          variants={itemVariants}
        >
          <Link
            to="/"
            className="text-secondary-600 hover:text-primary-600 font-medium text-sm transition-colors inline-flex items-center"
          >
            <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginNav;
