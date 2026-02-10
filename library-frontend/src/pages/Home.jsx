import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Users, UserCheck, GraduationCap, ArrowRight } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Admin",
      description: "System administration and oversight",
      icon: <UserCheck className="w-8 h-8" />,
      color: "from-purple-500 to-purple-700",
      hoverColor: "hover:from-purple-600 hover:to-purple-800",
      route: "/admin/login"
    },
    {
      title: "Library Staff",
      description: "Manage books and circulation",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-blue-500 to-blue-700",
      hoverColor: "hover:from-blue-600 hover:to-blue-800",
      route: "/library/login"
    },
    {
      title: "College Staff",
      description: "Faculty and staff access",
      icon: <Users className="w-8 h-8" />,
      color: "from-green-500 to-green-700",
      hoverColor: "hover:from-green-600 hover:to-green-800",
      route: "/staff/login"
    },
    {
      title: "Student",
      description: "Student portal and resources",
      icon: <GraduationCap className="w-8 h-8" />,
      color: "from-orange-500 to-orange-700",
      hoverColor: "hover:from-orange-600 hover:to-orange-800",
      route: "/student/login"
    }
  ];

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

  return (
    <div className="page-container flex items-center justify-center">
      <motion.div
        className="text-center max-w-6xl mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header Section */}
        <motion.div
          className="mb-16"
          variants={itemVariants}
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-6">
            College Library
          </h1>
          <p className="text-2xl md:text-3xl text-secondary-600 font-medium mb-4">
            Management System
          </p>
          <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
            Streamlined library services for students, faculty, and staff
          </p>
        </motion.div>

        {/* Role Selection Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
        >
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => navigate(role.route)}
                className={`
                  relative w-full p-8 rounded-2xl bg-gradient-to-br ${role.color} ${role.hoverColor}
                  text-white shadow-large hover:shadow-2xl transition-all duration-300
                  transform hover:-translate-y-2 group overflow-hidden
                `}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-white/20 transform rotate-45 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-4 flex justify-center">
                    {role.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{role.description}</p>
                  <div className="flex items-center justify-center text-sm font-medium">
                    <span>Enter Portal</span>
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          variants={containerVariants}
        >
          <motion.div
            className="card text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-secondary-800">Rich Collection</h3>
            <p className="text-secondary-600">Access thousands of books, journals, and digital resources</p>
          </motion.div>

          <motion.div
            className="card text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-accent-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-secondary-800">Easy Management</h3>
            <p className="text-secondary-600">Streamlined processes for book issuance and returns</p>
          </motion.div>

          <motion.div
            className="card text-center"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-secondary-800">Student Focused</h3>
            <p className="text-secondary-600">Designed with students' academic needs in mind</p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center text-secondary-500"
          variants={itemVariants}
        >
          <p className="text-sm">
            College Library Management System. Empowering education through knowledge.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
