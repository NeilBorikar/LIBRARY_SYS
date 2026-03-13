// Formatters - Utility functions for formatting data
import { format } from 'date-fns';

// Format date to readable string
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return 'N/A';
  try {
    return format(new Date(date), formatString);
  } catch (error) {
    return 'Invalid Date';
  }
};

// Format currency
export const formatCurrency = (amount, currency = '₹') => {
  if (typeof amount !== 'number') return 'N/A';
  return `${currency}${amount.toFixed(2)}`;
};

// Format book status
export const formatBookStatus = (status) => {
  const statusMap = {
    'available': 'Available',
    'issued': 'Issued',
    'overdue': 'Overdue',
    'lost': 'Lost',
    'damaged': 'Damaged'
  };
  return statusMap[status] || status;
};

// Format user type
export const formatUserType = (userType) => {
  const typeMap = {
    'student': 'Student',
    'staff': 'College Staff',
    'library': 'Library Staff',
    'admin': 'Administrator'
  };
  return typeMap[userType] || userType;
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Format as +91 XXXXX XXXXX for Indian numbers
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// Format email with masking
export const formatEmailMasked = (email) => {
  if (!email || !email.includes('@')) return 'N/A';
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  const maskedUsername = username.slice(0, 2) + '*'.repeat(username.length - 2);
  return `${maskedUsername}@${domain}`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Capitalize first letter of each word
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return 'N/A';
  return `${value.toFixed(decimals)}%`;
};
