// Dashboard Utils - Utility functions for dashboard operations
import dashboardService from '../services/dashboardService';

// Trigger dashboard refresh after any library operation
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
  
  // Show success message
  if (typeof window !== 'undefined' && window.showNotification) {
    window.showNotification(`${transactionType} completed successfully`, 'success');
  }
};

// Subscribe to dashboard updates
export const subscribeToDashboard = (callback) => {
  return dashboardService.subscribe(callback);
};

// Get dashboard data with error handling
export const getDashboardData = async (role) => {
  try {
    return await dashboardService.getData(role);
  } catch (error) {
    console.error(`Error getting ${role} dashboard data:`, error);
    return null;
  }
};

// Calculate book statistics
export const calculateBookStats = (books) => {
  if (!Array.isArray(books)) return null;
  
  const total = books.length;
  const available = books.filter(book => book.status === 'available').length;
  const issued = books.filter(book => book.status === 'issued').length;
  const overdue = books.filter(book => book.status === 'overdue').length;
  
  return {
    total,
    available,
    issued,
    overdue,
    availabilityRate: total > 0 ? ((available / total) * 100).toFixed(1) : 0
  };
};

// Format dashboard data for display
export const formatDashboardData = (data, role) => {
  if (!data) return null;
  
  const baseData = {
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  // Add role-specific formatting
  switch (role) {
    case 'student':
      return {
        ...baseData,
        currentlyIssued: baseData.currentlyIssued || 0,
        booksReturned: baseData.booksReturned || 0,
        pendingFines: baseData.pendingFines || 0
      };
      
    case 'library':
      return {
        ...baseData,
        overdueBooks: baseData.overdueBooks || 0,
        pendingFines: baseData.pendingFines || 0,
        recentActivity: baseData.recentActivity || []
      };
      
    case 'college':
      return {
        ...baseData,
        totalStudents: baseData.totalStudents || 0,
        totalStaff: baseData.totalStaff || 0,
        recentActivity: baseData.recentActivity || []
      };
      
    default:
      return baseData;
  }
};

// Check if dashboard data is stale
export const isDataStale = (lastUpdated, maxAgeMinutes = 5) => {
  if (!lastUpdated) return true;
  
  const now = new Date();
  const lastUpdate = new Date(lastUpdated);
  const ageInMinutes = (now - lastUpdate) / (1000 * 60);
  
  return ageInMinutes > maxAgeMinutes;
};
