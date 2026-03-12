// Role-based color configuration
export const ROLE_COLORS = {
  student: {
    primary: 'orange',
    gradient: 'from-orange-600 to-orange-700',
    hoverGradient: 'hover:from-orange-700 hover:to-orange-800',
    icon: 'text-orange-600',
    bgLight: 'bg-orange-100',
    textLight: 'text-orange-600',
    bgDark: 'bg-orange-600',
    textDark: 'text-orange-100'
  },
  library_staff: {
    primary: 'blue',
    gradient: 'from-blue-600 to-blue-700',
    hoverGradient: 'hover:from-blue-700 hover:to-blue-800',
    icon: 'text-blue-600',
    bgLight: 'bg-blue-100',
    textLight: 'text-blue-600',
    bgDark: 'bg-blue-600',
    textDark: 'text-blue-100'
  },
  college_staff: {
    primary: 'green',
    gradient: 'from-green-600 to-green-700',
    hoverGradient: 'hover:from-green-700 hover:to-green-800',
    icon: 'text-green-600',
    bgLight: 'bg-green-100',
    textLight: 'text-green-600',
    bgDark: 'bg-green-600',
    textDark: 'text-green-100'
  }
};

// Get colors for a specific role
export const getRoleColors = (role) => {
  return ROLE_COLORS[role] || ROLE_COLORS.student;
};

// Apply color classes to elements
export const applyRoleColors = (role, element) => {
  const colors = getRoleColors(role);
  
  switch (element) {
    case 'header':
      return `bg-gradient-to-r ${colors.gradient} text-white shadow-large`;
    case 'leftPanel':
      return colors.gradient;
    case 'leftPanelHover':
      return colors.hoverGradient;
    case 'icon':
      return colors.icon;
    case 'lightBg':
      return colors.bgLight;
    case 'lightText':
      return colors.textLight;
    case 'darkBg':
      return colors.bgDark;
    case 'darkText':
      return colors.textDark;
    case 'loadingSpinner':
      return `border-b-2 ${colors.textLight}`;
    case 'retryButton':
      return `px-4 py-2 ${colors.bgDark} text-white rounded-lg ${colors.hoverGradient.replace('hover:', '')}`;
    default:
      return colors.gradient;
  }
};

export default {
  ROLE_COLORS,
  getRoleColors,
  applyRoleColors
};
