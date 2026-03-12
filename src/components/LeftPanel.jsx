import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const LeftPanel = ({ 
  menuItems, 
  dropdownOptions = [], 
  title, 
  primaryColor, 
  secondaryColor,
  showDropdown = false,
  onDropdownToggle,
  onNavigate 
}) => {
  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
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
    <motion.div
      className="w-80 bg-white shadow-large rounded-r-2xl p-6 border-r border-secondary-200"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Panel Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-xl font-bold text-secondary-800 mb-2">{title}</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"></div>
      </motion.div>

      {/* Menu Items */}
      <div className="space-y-3">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.title}
            onClick={() => onNavigate(item.route)}
            className={`w-full bg-gradient-to-r ${primaryColor} ${secondaryColor} text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-medium hover:shadow-large flex items-center justify-between group`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}

        {/* Dropdown Menu */}
        {dropdownOptions.length > 0 && (
          <div className="relative">
            <motion.button
              onClick={onDropdownToggle}
              className={`w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-medium hover:shadow-large flex items-center justify-between group`}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold">Book Management</h3>
                  <p className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Add & manage books
                  </p>
                </div>
              </div>
            </motion.button>

            {showDropdown && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-large border border-secondary-200 overflow-hidden z-10"
              >
                {dropdownOptions.map((option, index) => (
                  <motion.button
                    key={option.title}
                    onClick={() => onNavigate(option.route)}
                    className="w-full px-4 py-3 text-left hover:bg-secondary-50 transition-colors flex items-center space-x-3 border-b border-secondary-100 last:border-b-0"
                    variants={itemVariants}
                  >
                    <div className="w-6 h-6 bg-secondary-100 rounded flex items-center justify-center flex-shrink-0">
                      {option.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-secondary-800 text-sm">{option.title}</p>
                      <p className="text-xs text-secondary-600 truncate">{option.description}</p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LeftPanel;
