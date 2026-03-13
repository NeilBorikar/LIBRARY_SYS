// Simple API service for staff endpoints
import apiClient from '../api/apiService';

class StaffService {
  // Get books issued to staff member
  async getStaffBooksIssued(empId) {
    try {
      const response = await apiClient.get(`/api/staff/books-issued?emp_id=${empId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff issued books:', error);
      return [];
    }
  }

  // Get books returned by staff member
  async getStaffBooksReturned(empId) {
    try {
      const response = await apiClient.get(`/api/staff/books-returned?emp_id=${empId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff returned books:', error);
      return [];
    }
  }

  // Get staff dashboard data
  async getStaffDashboardData(empId) {
    try {
      const response = await apiClient.get(`/api/dashboard/staff?emp_id=${empId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff dashboard:', error);
      return this.getMockStaffData();
    }
  }

  // Mock data fallback
  getMockStaffData() {
    return {
      total_books: 1000,
      issued_books: 245,
      available_books: 755,
      total_students: 850,
      total_staff: 45,
      recent_activity: [
        {
          action: "Book Issued",
          user: "STAFF001",
          book: "Python Programming",
          time: new Date().toISOString()
        }
      ]
    };
  }
}

export default new StaffService();
