// Library Operations Utility - Triggers real-time dashboard updates
import dashboardService from '../services/dashboardService';

class LibraryOperations {
  constructor() {
    this.isUpdating = false;
  }

  // Trigger dashboard refresh after any library operation
  async triggerDashboardRefresh(operation, details) {
    if (this.isUpdating) return; // Prevent multiple simultaneous updates
    
    this.isUpdating = true;
    
    try {
      console.log(`🔄 Library Operation: ${operation}`, details);
      
      // Trigger immediate refresh of all dashboard data
      await dashboardService.triggerRefresh();
      
      // Log the operation for debugging
      console.log(`✅ Dashboard updated after ${operation}`);
      
    } catch (error) {
      console.error(`❌ Error updating dashboard after ${operation}:`, error);
    } finally {
      this.isUpdating = false;
    }
  }

  // Book issued - call this when library staff issues a book
  async bookIssued(bookDetails, studentDetails) {
    const operation = 'BOOK_ISSUED';
    const details = {
      bookTitle: bookDetails.title,
      bookId: bookDetails.id,
      studentName: studentDetails.name,
      studentId: studentDetails.id,
      department: studentDetails.department,
      issueDate: new Date().toISOString(),
      dueDate: bookDetails.dueDate
    };

    await this.triggerDashboardRefresh(operation, details);
    return { success: true, message: 'Book issued successfully' };
  }

  // Book returned - call this when library staff receives a returned book
  async bookReturned(bookDetails, studentDetails) {
    const operation = 'BOOK_RETURNED';
    const details = {
      bookTitle: bookDetails.title,
      bookId: bookDetails.id,
      studentName: studentDetails.name,
      studentId: studentDetails.id,
      department: studentDetails.department,
      returnDate: new Date().toISOString(),
      daysOverdue: this.calculateDaysOverdue(bookDetails.dueDate)
    };

    await this.triggerDashboardRefresh(operation, details);
    return { success: true, message: 'Book returned successfully' };
  }

  // Fine paid - call this when student pays fine
  async finePaid(studentDetails, fineDetails) {
    const operation = 'FINE_PAID';
    const details = {
      studentName: studentDetails.name,
      studentId: studentDetails.id,
      fineAmount: fineDetails.amount,
      fineReason: fineDetails.reason,
      paymentDate: new Date().toISOString()
    };

    await this.triggerDashboardRefresh(operation, details);
    return { success: true, message: 'Fine paid successfully' };
  }

  // Book added to inventory - call when new books are added
  async bookAdded(bookDetails, quantity) {
    const operation = 'BOOK_ADDED';
    const details = {
      bookTitle: bookDetails.title,
      bookId: bookDetails.id,
      quantity: quantity,
      author: bookDetails.author,
      category: bookDetails.category,
      addedDate: new Date().toISOString()
    };

    await this.triggerDashboardRefresh(operation, details);
    return { success: true, message: `${quantity} books added successfully` };
  }

  // Calculate days overdue
  calculateDaysOverdue(dueDate) {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  // Get operation status
  isOperationInProgress() {
    return this.isUpdating;
  }
}

// Create singleton instance
const libraryOperations = new LibraryOperations();

export default libraryOperations;
