import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false);
      navigate("/admin/dashboard");
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="page-container flex items-center justify-center">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Logo/Icon Section */}
        <motion.div
          className="text-center mb-8"
          variants={itemVariants}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-large">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">Admin Portal</h1>
          <p className="text-secondary-600">Enter your credentials to access the admin dashboard</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          className="form-container"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Admin ID / Email
              </label>
              <input
                type="email"
                placeholder="admin@college.edu"
                className="input-field"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input-field pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-large hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="spinner mr-2"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  Login to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </motion.button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Secure Access</p>
                <p className="text-amber-700 mt-1">
                  This is a restricted area. Unauthorized access attempts are monitored and logged.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="text-center mt-6"
          variants={itemVariants}
        >
          <button
            onClick={() => navigate("/")}
            className="text-secondary-600 hover:text-primary-600 font-medium text-sm transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
