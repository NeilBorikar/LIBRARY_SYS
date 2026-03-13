// Dashboard Service - Core business logic for dashboard data management
import apiClient from '../api/apiService';

class DashboardService {
  constructor() {
    this.baseURL = 'http://localhost:8004';
    this.subscribers = [];
    this.pollingInterval = null;
    this.cache = new Map();
  }

  // Subscribe to dashboard updates
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify all subscribers of data changes
  notify(data) {
    this.subscribers.forEach(callback => callback(data));
  }

  // Get library dashboard data (specific function for library staff)
  async getLibraryDashboardData() {
    try {
      const response = await apiClient.get('/api/dashboard/library');
      return response.data;
    } catch (error) {
      console.error('Error fetching library dashboard data:', error);
      return this.getMockData('library');
    }
  }

  // Get student dashboard data
  async getStudentDashboardData(studentPrn) {
    try {
      const response = await apiClient.get(`/api/dashboard/student/${studentPrn}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student dashboard data:', error);
      return this.getMockData('student');
    }
  }

  // Get college dashboard data
  async getCollegeDashboardData() {
    try {
      const response = await apiClient.get('/api/dashboard/college');
      return response.data;
    } catch (error) {
      console.error('Error fetching college dashboard data:', error);
      return this.getMockData('college');
    }
  }

  // Fetch dashboard data for specific role
  async fetchDashboardData(role) {
    try {
      const response = await apiClient.get(`/api/dashboard/${role}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${role} dashboard data:`, error);
      return this.getMockData(role);
    }
  }

  // Fetch global statistics
  async fetchGlobalStats() {
    try {
      const response = await apiClient.get('/api/dashboard/global-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching global stats:', error);
      return this.getMockGlobalStats();
    }
  }

  // Send manual reminder to student
  async sendManualReminder(studentPrn) {
    try {
      const response = await apiClient.post('/api/dashboard/send-reminder', {
        student_prn: studentPrn
      });
      return response.data;
    } catch (error) {
      console.error('Error sending reminder:', error);
      throw new Error('Failed to send reminder');
    }
  }
  async triggerRefresh() {
    try {
      // Clear cache to force fresh data
      this.cache.clear();
      
      // Fetch fresh data for all subscribers
      const freshData = await this.fetchAllDashboardData();
      this.notify(freshData);
      
      return freshData;
    } catch (error) {
      console.error('Error triggering refresh:', error);
      throw error;
    }
  }

  // Start real-time polling
  startPolling(interval = 5000) {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.pollingInterval = setInterval(async () => {
      try {
        const data = await this.fetchAllDashboardData();
        this.notify(data);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, interval);
  }

  // Stop polling
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // Get cached data or fetch fresh
  async getData(role, forceRefresh = false) {
    const cacheKey = role;
    
    if (!forceRefresh && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const data = await this.fetchDashboardData(role);
    this.cache.set(cacheKey, data);
    return data;
  }

  // Fetch all dashboard data
  async fetchAllDashboardData() {
    const roles = ['student', 'library', 'college'];
    const data = {};
    
    for (const role of roles) {
      data[role] = await this.getData(role, true);
    }
    
    data.global = await this.fetchGlobalStats();
    return data;
  }

  // Mock data fallback
  getMockData(role) {
    const mockData = {
      student: {
        totalBooks: 1000,
        issuedBooks: 245,
        availableBooks: 755,
        currentlyIssued: 3,
        booksReturned: 12,
        pendingFines: 50,
        recentActivity: []
      },
      library: {
        totalBooks: 1000,
        issuedBooks: 245,
        availableBooks: 755,
        overdueBooks: 18,
        pendingFines: 450,
        recentActivity: []
      },
      college: {
        totalBooks: 1000,
        issuedBooks: 245,
        availableBooks: 755,
        totalStudents: 850,
        totalStaff: 45,
        recentActivity: []
      }
    };
    
    return mockData[role] || {};
  }

  getMockGlobalStats() {
    return {
      totalBooks: 1000,
      issuedBooks: 245,
      availableBooks: 755,
      overdueBooks: 18,
      pendingFines: 450,
      totalUsers: 895
    };
  }
}

// Singleton instance
const dashboardService = new DashboardService();
export default dashboardService;
