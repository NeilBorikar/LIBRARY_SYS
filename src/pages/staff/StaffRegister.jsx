import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Lock, Mail, Phone, Building, ArrowRight, Eye, EyeOff } from "lucide-react";

function StaffRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    empId: "",
    email: "",
    mobile: "",
    department: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid =
    formData.empId &&
    formData.email &&
    formData.mobile &&
    formData.department &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Please fill all the above details correctly");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    
    // Simulate registration delay
    setTimeout(() => {
      setIsLoading(false);
      navigate("/staff/login");
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
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-large">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">College Staff Registration</h1>
          <p className="text-secondary-600">Create your staff account to access library services</p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          className="form-container"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee ID Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Employee ID
              </label>
              <input
                type="text"
                name="empId"
                placeholder="Enter your employee ID"
                value={formData.empId}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="staff@college.edu"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Mobile Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                placeholder="+91 98765 43210"
                value={formData.mobile}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Department Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700 flex items-center">
                <Building className="w-4 h-4 mr-2" />
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Department</option>
                <option value="computer-science">Computer Science</option>
                <option value="electronics">Electronics</option>
                <option value="mechanical">Mechanical</option>
                <option value="civil">Civil</option>
                <option value="electrical">Electrical</option>
                <option value="chemistry">Chemistry</option>
                <option value="physics">Physics</option>
                <option value="mathematics">Mathematics</option>
                <option value="administration">Administration</option>
              </select>
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
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary-700 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-large hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              whileHover={{ scale: (isLoading || !isFormValid) ? 1 : 1.02 }}
              whileTap={{ scale: (isLoading || !isFormValid) ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="spinner mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-secondary-600">
              Already have an account?{" "}
              <span 
                onClick={() => navigate("/staff/login")}
                className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer transition-colors"
              >
                Login here
              </span>
            </p>
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

export default StaffRegister;
