import dashboardService from '../services/dashboardService';

// Utility to trigger dashboard updates after book transactions
export const triggerDashboardRefresh = async () => {
  try {
    // Trigger immediate refresh
    await dashboardService.triggerRefresh();
    
    // Show notification to user (optional)
    if (typeof window !== 'undefined' && window.showNotification) {
      window.showNotification('Dashboard updated with latest data', 'success');
    }
  } catch (error) {
    console.error('Error triggering dashboard refresh:', error);
  }
};

// Call this function after any book transaction
export const afterBookTransaction = async (transactionType, bookDetails) => {
  console.log(`${transactionType} transaction completed:`, bookDetails);
  
  // Trigger dashboard refresh
  await triggerDashboardRefresh();
  
  // You can also add analytics tracking here
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'book_transaction', {
      transaction_type: transactionType,
      book_title: bookDetails.title,
      user_role: bookDetails.userRole
    });
  }
};

// Mock transaction function for testing
export const mockBookIssue = async (bookTitle, studentName) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const transactionDetails = {
    title: bookTitle,
    studentName: studentName,
    transactionType: 'issue',
    timestamp: new Date()
  };
  
  await afterBookTransaction('issue', transactionDetails);
  
  return {
    success: true,
    message: `Book "${bookTitle}" issued to ${studentName}`,
    data: transactionDetails
  };
};

// Mock return function for testing
export const mockBookReturn = async (bookTitle, studentName) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const transactionDetails = {
    title: bookTitle,
    studentName: studentName,
    transactionType: 'return',
    timestamp: new Date()
  };
  
  await afterBookTransaction('return', transactionDetails);
  
  return {
    success: true,
    message: `Book "${bookTitle}" returned by ${studentName}`,
    data: transactionDetails
  };
};

export default {
  triggerDashboardRefresh,
  afterBookTransaction,
  mockBookIssue,
  mockBookReturn
};
