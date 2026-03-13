// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation - at least 8 characters, 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// Phone number validation (basic)
const PHONE_REGEX = /^[\d\s\-\+\(\)]{10,}$/;

// PRN (Student Registration Number) validation
const PRN_REGEX = /^[A-Z0-9]{6,12}$/;

// Employee ID validation
const EMPLOYEE_ID_REGEX = /^[A-Z0-9]{4,10}$/;

// ISBN validation (basic)
const ISBN_REGEX = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;

// Import React hooks for the useValidation hook
import { useState } from 'react';

// Validation functions
export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  if (email.length > 255) {
    return 'Email address is too long';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number';
  }
  if (password.length > 128) {
    return 'Password is too long';
  }
  return null;
};

export const validateName = (name, fieldName = 'Name') => {
  if (!name) {
    return `${fieldName} is required`;
  }
  if (name.length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }
  if (name.length > 100) {
    return `${fieldName} is too long`;
  }
  if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
    return `${fieldName} can only contain letters, spaces, and basic punctuation`;
  }
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) {
    return 'Phone number is required';
  }
  if (!PHONE_REGEX.test(phone)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export const validatePRN = (prn) => {
  if (!prn) {
    return 'PRN is required';
  }
  if (!PRN_REGEX.test(prn)) {
    return 'PRN must be 6-12 alphanumeric characters';
  }
  return null;
};

export const validateEmployeeId = (employeeId) => {
  if (!employeeId) {
    return 'Employee ID is required';
  }
  if (!EMPLOYEE_ID_REGEX.test(employeeId)) {
    return 'Employee ID must be 4-10 alphanumeric characters';
  }
  return null;
};

export const validateISBN = (isbn) => {
  if (!isbn) {
    return 'ISBN is required';
  }
  // Remove hyphens and spaces for validation
  const cleanISBN = isbn.replace(/[-\s]/g, '');
  if (!ISBN_REGEX.test(isbn)) {
    return 'Please enter a valid ISBN';
  }
  return null;
};

export const validateBookTitle = (title) => {
  if (!title) {
    return 'Book title is required';
  }
  if (title.length < 1) {
    return 'Book title cannot be empty';
  }
  if (title.length > 200) {
    return 'Book title is too long';
  }
  return null;
};

export const validateAuthor = (author) => {
  if (!author) {
    return 'Author name is required';
  }
  if (author.length < 2) {
    return 'Author name must be at least 2 characters long';
  }
  if (author.length > 100) {
    return 'Author name is too long';
  }
  return null;
};

export const validateQuantity = (quantity, fieldName = 'Quantity') => {
  if (quantity === null || quantity === undefined || quantity === '') {
    return `${fieldName} is required`;
  }
  const num = parseInt(quantity);
  if (isNaN(num) || num < 0) {
    return `${fieldName} must be a positive number`;
  }
  if (num > 1000) {
    return `${fieldName} cannot exceed 1000`;
  }
  return null;
};

export const validateCategory = (category) => {
  if (!category) {
    return 'Category is required';
  }
  const validCategories = [
    'Fiction', 'Non-Fiction', 'Science', 'Technology', 'Engineering', 'Mathematics',
    'Business', 'History', 'Biography', 'Self-Help', 'Children', 'Reference',
    'Textbook', 'Research', 'General'
  ];
  if (!validCategories.includes(category)) {
    return 'Please select a valid category';
  }
  return null;
};

// Form validation for different user types
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.identifier);
  if (emailError) errors.identifier = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  if (!formData.role) {
    errors.role = 'Please select a role';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateStudentRegistrationForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.name, 'Full Name');
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const prnError = validatePRN(formData.prn);
  if (prnError) errors.prn = prnError;
  
  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateStaffRegistrationForm = (formData) => {
  const errors = {};
  
  const nameError = validateName(formData.name, 'Full Name');
  if (nameError) errors.name = nameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const employeeIdError = validateEmployeeId(formData.employee_id);
  if (employeeIdError) errors.employee_id = employeeIdError;
  
  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateBookForm = (formData) => {
  const errors = {};
  
  const titleError = validateBookTitle(formData.title);
  if (titleError) errors.title = titleError;
  
  const authorError = validateAuthor(formData.author);
  if (authorError) errors.author = authorError;
  
  const isbnError = validateISBN(formData.isbn);
  if (isbnError) errors.isbn = isbnError;
  
  const quantityError = validateQuantity(formData.quantity, 'Quantity');
  if (quantityError) errors.quantity = quantityError;
  
  const categoryError = validateCategory(formData.category);
  if (categoryError) errors.category = categoryError;
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Sanitization functions
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.trim().replace(/[<>]/g, '');
};

export const sanitizeEmail = (email) => {
  if (!email) return '';
  return email.toLowerCase().trim();
};

export const sanitizeNumber = (num) => {
  if (num === null || num === undefined) return 0;
  const parsed = parseInt(num);
  return isNaN(parsed) ? 0 : parsed;
};

// Real-time validation hook
export const useValidation = (validationSchema) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const error = validationSchema[name] ? validationSchema[name](value) : null;
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = (formData) => {
    const newErrors = {};
    Object.keys(validationSchema).forEach(key => {
      const error = validationSchema[key](formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setFieldTouched = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const resetValidation = () => {
    setErrors({});
    setTouched({});
  };

  return {
    errors,
    touched,
    validateField,
    validateForm,
    setFieldTouched,
    resetValidation
  };
};
