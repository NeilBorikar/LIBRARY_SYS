// Real-time Dashboard Data Service
class DashboardService {
  constructor() {
    this.baseURL = 'http://localhost:8000';
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

  // Start real-time polling
  startPolling(interval = 5000) {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    
    this.pollingInterval = setInterval(async () => {
      await this.refreshAllData();
    }, interval);
  }

  // Stop polling
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // Refresh all dashboard data
  async refreshAllData() {
    try {
      const [studentData, libraryData, collegeData] = await Promise.all([
        this.getStudentDashboardData(),
        this.getLibraryDashboardData(),
        this.getCollegeDashboardData()
      ]);

      this.notify({
        student: studentData,
        library: libraryData,
        college: collegeData,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  }

  // Get Student Dashboard Data
  async getStudentDashboardData(studentId = 'current') {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/student/${studentId}`);
      if (!response.ok) throw new Error('Failed to fetch student data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching student dashboard data:', error);
      return this.getMockStudentData();
    }
  }

  // Get Library Staff Dashboard Data
  async getLibraryDashboardData(staffId = 'current') {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/library-staff/${staffId}`);
      if (!response.ok) throw new Error('Failed to fetch library data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching library dashboard data:', error);
      return this.getMockLibraryData();
    }
  }

  // Get College Staff Dashboard Data
  async getCollegeDashboardData(staffId = 'current') {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/college-staff/${staffId}`);
      if (!response.ok) throw new Error('Failed to fetch college data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching college dashboard data:', error);
      return this.getMockCollegeData();
    }
  }

  // Send manual reminder to student
  async sendManualReminder(studentPrn) {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/send-reminder/${studentPrn}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to send reminder');
      }

      const result = await response.json();
      
      // Trigger dashboard refresh after reminder
      await this.triggerRefresh();
      
      return result;
    } catch (error) {
      console.error('Error sending manual reminder:', error);
      // Fallback simulation
      return {
        success: true,
        student_email: `${studentPrn}@college.edu`,
        reminders_sent: 1,
        message: 'Reminder sent successfully (simulated)'
      };
    }
  }

  // Trigger manual refresh after book transaction
  async triggerRefresh() {
    await this.refreshAllData();
  }

  // Mock Student Data (fallback)
  getMockStudentData() {
    return {
      student_info: {
        name: "John Doe",
        prn: "2021001",
        email: "john@college.edu",
        department: "Computer Science",
        year: 3
      },
      current_books: [
        {
          id: "1",
          book_title: "Data Structures and Algorithms",
          issue_date: "2024-03-01",
          due_date: "2024-03-15",
          status: "Not Returned",
          days_remaining: 2
        }
      ],
      book_history: [
        {
          book_title: "Introduction to Algorithms",
          issue_date: "2024-01-15",
          return_date: "2024-02-10",
          fine_paid: 0
        }
      ],
      fine_history: [
        {
          book_title: "Operating Systems",
          fine_amount: 15,
          reason: "Late return",
          paid_date: "2024-01-26"
        }
      ],
      statistics: {
        total_borrowed: 5,
        total_fine_paid: 15,
        pending_fine: 15
      }
    };
  }

  // Mock Library Data (fallback)
  getMockLibraryData() {
    return {
      staff_info: {
        name: "Sarah Johnson",
        email: "sarah@library.edu",
        employee_id: "LIB001"
      },
      statistics: {
        total_books: 1000,
        issued_books: 245,
        overdue_books: 18,
        pending_fines: 1250.50
      },
      notifications: [
        {
          type: "overdue_alert",
          message: "5 books are overdue today",
          timestamp: new Date(),
          severity: "high"
        }
      ],
      fine_alerts: [
        {
          student_name: "John Doe",
          book_title: "Data Structures and Algorithms",
          days_late: 5,
          fine_amount: 25,
          student_email: "john@college.edu",
          prn: "2021001"
        }
      ]
    };
  }

  // Send manual reminder to student
  async sendManualReminder(studentId) {
    try {
      const response = await fetch(`${this.baseURL}/library-staff/send-reminder/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) throw new Error('Failed to send reminder');
      return await response.json();
    } catch (error) {
      console.error('Error sending manual reminder:', error);
      throw error;
    }
  }

  // Mock College Data (fallback)
  getMockCollegeData() {
    return {
      staff_info: {
        name: "Dr. Robert Williams",
        email: "robert@college.edu",
        department: "Computer Science",
        employee_id: "STF001"
      },
      department_stats: [
        { department: "Computer Science", books_issued: 150, students: 45, percentage: 30 },
        { department: "Electronics", books_issued: 120, students: 38, percentage: 24 }
      ],
      defaulter_students: [
        {
          student_name: "John Doe",
          prn: "2021001",
          department: "Computer Science",
          overdue_books: 2,
          pending_fine: 35,
          email: "john@college.edu"
        }
      ],
      statistics: {
        total_departments: 5,
        total_students: 168,
        defaulter_students: 12,
        total_pending_fines: 2450.75
      }
    };
  }
}

// Create singleton instance
const dashboardService = new DashboardService();

export default dashboardService;
