import { useState, useEffect, useCallback } from 'react';
import dashboardService from '../services/dashboardService';

// Custom hook for real-time dashboard data
export const useDashboardData = (userRole, userId = 'current') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch data based on user role
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      switch (userRole) {
        case 'student':
          result = await dashboardService.getStudentDashboardData(userId);
          break;
        case 'library_staff':
          result = await dashboardService.getLibraryDashboardData(userId);
          break;
        case 'college_staff':
          result = await dashboardService.getCollegeDashboardData(userId);
          break;
        default:
          throw new Error('Invalid user role');
      }
      
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [userRole, userId]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Subscribe to real-time updates
  useEffect(() => {
    const handleUpdate = (updatedData) => {
      // Update data if it matches current user role
      if (updatedData[userRole]) {
        setData(updatedData[userRole]);
        setLastUpdated(updatedData.timestamp);
      }
    };

    // Subscribe to dashboard service updates
    const unsubscribe = dashboardService.subscribe(handleUpdate);

    // Initial data fetch
    fetchData();

    // Start polling for real-time updates
    dashboardService.startPolling(5000); // Poll every 5 seconds

    // Cleanup
    return () => {
      unsubscribe();
      dashboardService.stopPolling();
    };
  }, [userRole, fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  };
};

// Hook for global dashboard statistics (for cross-role updates)
export const useGlobalStats = () => {
  const [stats, setStats] = useState({
    totalBooks: 1000,
    issuedBooks: 245,
    availableBooks: 755,
    overdueBooks: 18,
    pendingFines: 1250.50
  });

  useEffect(() => {
    const handleUpdate = (updatedData) => {
      // Update global stats from any dashboard data
      if (updatedData.library?.statistics) {
        const libStats = updatedData.library.statistics;
        setStats({
          totalBooks: libStats.total_books || libStats.totalBooks || 1000,
          issuedBooks: libStats.issued_books || libStats.issuedBooks || 245,
          availableBooks: (libStats.total_books || libStats.totalBooks || 1000) - (libStats.issued_books || libStats.issuedBooks || 245),
          overdueBooks: libStats.overdue_books || libStats.overdueBooks || 18,
          pendingFines: libStats.pending_fines || libStats.pendingFines || 1250.50
        });
      }
    };

    const unsubscribe = dashboardService.subscribe(handleUpdate);
    return unsubscribe;
  }, []);

  return stats;
};

export default useDashboardData;
