import axios from 'axios';
import { logger, withApiLogging } from '../utils/logger';
import { withCache } from '../utils/cache';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8004';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API request
    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    logger.error('API Request Error', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response
    logger.debug('API Response', {
      status: response.status,
      url: response.config.url,
      dataSize: JSON.stringify(response.data).length
    });
    
    return response;
  },
  (error) => {
    // Log error response
    logger.error('API Response Error', error, {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.detail || error.message
    });
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('role');
      localStorage.removeItem('userIdentifier');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      logger.error('Network Error', { message: 'No response received from server' });
    }
    
    return Promise.reject(error);
  }
);

// Enhanced API functions with logging and caching
const createApiFunction = (config) => {
  const apiFunction = async (params = {}) => {
    try {
      const response = await apiClient({ ...config, ...params });
      return response.data;
    } catch (error) {
      // Transform error to be more user-friendly
      const userError = {
        message: error.response?.data?.detail || error.message || 'An error occurred',
        status: error.response?.status,
        code: error.code
      };
      throw userError;
    }
  };
  
  return withApiLogging(withCache(apiFunction));
};

// Authentication API
export const authAPI = {
  login: createApiFunction({
    method: 'POST',
    url: '/auth/login'
  }),
  
  register: createApiFunction({
    method: 'POST',
    url: '/auth/register'
  }),
  
  logout: createApiFunction({
    method: 'POST',
    url: '/auth/logout'
  }),
  
  getCurrentUser: createApiFunction({
    method: 'GET',
    url: '/auth/me'
  })
};

// Student API
export const studentAPI = {
  getProfile: createApiFunction({
    method: 'GET',
    url: '/student/profile'
  }),
  
  getBooks: createApiFunction({
    method: 'GET',
    url: '/student/books'
  }),
  
  borrowBook: (bookId) => createApiFunction({
    method: 'POST',
    url: `/student/borrow/${bookId}`
  })(),
  
  getTransactions: createApiFunction({
    method: 'GET',
    url: '/student/transactions'
  })
};

// Staff API
export const staffAPI = {
  getProfile: createApiFunction({
    method: 'GET',
    url: '/staff/profile'
  }),
  
  getBooks: createApiFunction({
    method: 'GET',
    url: '/staff/books'
  }),
  
  addBook: createApiFunction({
    method: 'POST',
    url: '/staff/books'
  }),
  
  updateBook: (bookId, data) => createApiFunction({
    method: 'PUT',
    url: `/staff/books/${bookId}`,
    data
  })(),
  
  getTransactions: createApiFunction({
    method: 'GET',
    url: '/staff/transactions'
  })
};

// Library Staff API
export const libraryAPI = {
  getDashboard: createApiFunction({
    method: 'GET',
    url: '/library/dashboard'
  }),
  
  issueBook: createApiFunction({
    method: 'POST',
    url: '/library/issue-book'
  }),
  
  returnBook: createApiFunction({
    method: 'POST',
    url: '/library/return-book'
  }),
  
  addBook: createApiFunction({
    method: 'POST',
    url: '/library/add-book'
  }),
  
  collectFine: createApiFunction({
    method: 'POST',
    url: '/library/collect-fine'
  }),
  
  getIssuedBooks: createApiFunction({
    method: 'GET',
    url: '/library/books-issued'
  }),
  
  getReturnedBooks: createApiFunction({
    method: 'GET',
    url: '/library/books-returned'
  }),
  
  sendReminder: (studentPrn) => createApiFunction({
    method: 'POST',
    url: `/library/send-reminder/${studentPrn}`
  })()
};

// Admin API
export const adminAPI = {
  getDashboard: createApiFunction({
    method: 'GET',
    url: '/admin/dashboard'
  }),
  
  registerAdmin: createApiFunction({
    method: 'POST',
    url: '/admin/register'
  }),
  
  getReports: (date) => createApiFunction({
    method: 'GET',
    url: '/admin/reports',
    params: { date }
  })()
};

// Dashboard API
export const dashboardAPI = {
  getStudentDashboard: (studentPrn) => createApiFunction({
    method: 'GET',
    url: `/dashboard/student/${studentPrn}`
  })(),
  
  getLibraryDashboard: createApiFunction({
    method: 'GET',
    url: '/dashboard/library'
  })
};

// Reminder API
export const reminderAPI = {
  getStatistics: createApiFunction({
    method: 'GET',
    url: '/reminders/statistics'
  }),
  
  getOverdueBooks: createApiFunction({
    method: 'GET',
    url: '/reminders/overdue-books'
  }),
  
  getDueSoonBooks: (daysAhead = 2) => createApiFunction({
    method: 'GET',
    url: '/reminders/due-soon-books',
    params: { days_ahead: daysAhead }
  })(),
  
  getUserReminders: (userId) => createApiFunction({
    method: 'GET',
    url: `/reminders/user/${userId}/reminders`
  })(),
  
  sendManualReminder: createApiFunction({
    method: 'POST',
    url: '/reminders/send-manual'
  }),
  
  sendBulkReminders: createApiFunction({
    method: 'POST',
    url: '/reminders/send-bulk'
  }),
  
  getSchedulerStatus: createApiFunction({
    method: 'GET',
    url: '/reminders/scheduler-status'
  }),
  
  triggerJob: (jobId) => createApiFunction({
    method: 'POST',
    url: `/reminders/trigger-job/${jobId}`
  })(),
  
  testEmail: createApiFunction({
    method: 'POST',
    url: '/reminders/test-email'
  }),
  
  testSMS: (phoneNumber) => createApiFunction({
    method: 'POST',
    url: '/reminders/test-sms',
    params: { phone_number: phoneNumber }
  })()
};

// Generic API functions
export const api = {
  get: (url, config) => createApiFunction({ method: 'GET', url, ...config })(),
  post: (url, data, config) => createApiFunction({ method: 'POST', url, data, ...config })(),
  put: (url, data, config) => createApiFunction({ method: 'PUT', url, data, ...config })(),
  delete: (url, config) => createApiFunction({ method: 'DELETE', url, ...config })(),
  patch: (url, data, config) => createApiFunction({ method: 'PATCH', url, data, ...config })()
};

// Export the configured axios instance for advanced usage
export { apiClient };

// Export base URL for reference
export const BASE_URL = API_BASE_URL;

export default api;
