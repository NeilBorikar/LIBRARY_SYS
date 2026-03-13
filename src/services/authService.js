// Auth Service - Core business logic for authentication
import apiClient from './apiService';

class AuthService {
  constructor() {
    this.baseURL = '/auth';
  }

  // Login operations
  async login(credentials, role) {
    const response = await apiClient.post(`${this.baseURL}/${role}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  }

  // Register operations
  async register(userData, role) {
    const response = await apiClient.post(`${this.baseURL}/${role}/register`, userData);
    return response.data;
  }

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  }

  // Get current user
  getCurrentUser() {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const userData = localStorage.getItem('userData');
    
    if (!token || !role) {
      return null;
    }
    
    return {
      token,
      role,
      user: userData ? JSON.parse(userData) : null
    };
  }

  // Check if authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  // Get user role
  getUserRole() {
    return localStorage.getItem('userRole');
  }

  // Refresh token if needed
  async refreshToken() {
    try {
      const response = await apiClient.post(`${this.baseURL}/refresh-token`);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}

// Singleton instance
const authService = new AuthService();
export default authService;
