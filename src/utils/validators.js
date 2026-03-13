// Validators - Utility functions for data validation
import { isValid, parseISO } from 'date-fns';

// Email validation
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (Indian numbers)
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10 && /^\d+$/.test(cleanPhone);
};

// PRN (Permanent Registration Number) validation
export const isValidPRN = (prn) => {
  if (!prn || typeof prn !== 'string') return false;
  // PRN should be alphanumeric and 10-15 characters long
  const prnRegex = /^[A-Za-z0-9]{10,15}$/;
  return prnRegex.test(prn);
};

// Date validation
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch (error) {
    return false;
  }
};

// Book title validation
export const isValidBookTitle = (title) => {
  if (!title || typeof title !== 'string') return false;
  return title.trim().length >= 2 && title.trim().length <= 200;
};

// Author name validation
export const isValidAuthorName = (author) => {
  if (!author || typeof author !== 'string') return false;
  const authorRegex = /^[A-Za-z\s.]+$/;
  return authorRegex.test(author.trim()) && author.trim().length >= 2;
};

// Quantity validation (for books)
export const isValidQuantity = (quantity) => {
  const num = parseInt(quantity);
  return !isNaN(num) && num > 0 && num <= 1000;
};

// Fine amount validation
export const isValidFineAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0 && num <= 10000;
};

// User type validation
export const isValidUserType = (userType) => {
  const validTypes = ['student', 'staff', 'library', 'admin'];
  return validTypes.includes(userType);
};

// Password validation
export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Required field validation
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

// Length validation
export const isValidLength = (value, minLength, maxLength) => {
  if (!value) return false;
  const length = value.toString().length;
  return length >= minLength && length <= maxLength;
};
