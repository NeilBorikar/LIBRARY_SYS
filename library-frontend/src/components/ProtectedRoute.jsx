import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shield, AlertTriangle, LogOut } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  allowedRoles = [],
  fallbackPath = '/login' 
}) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole') || localStorage.getItem('role');
      const userIdentifier = localStorage.getItem('userIdentifier');

      if (!token || !userRole) {
        throw new Error('No authentication credentials found');
      }

      // Check if user has required role
      if (requiredRole && userRole !== requiredRole) {
        throw new Error(`Access denied. Required role: ${requiredRole}`);
      }

      // Check if user's role is in allowed roles
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        throw new Error('Access denied. Insufficient permissions');
      }

      setUser({
        role: userRole,
        identifier: userIdentifier,
        token: token
      });
    } catch (err) {
      setError(err.message);
      // Clear invalid credentials
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('role');
      localStorage.removeItem('userIdentifier');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Verifying authentication..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-full mb-4">
            <Shield className="w-6 h-6 text-yellow-600" />
          </div>
          
          <h1 className="text-xl font-semibold text-gray-900 text-center mb-2">
            Access Denied
          </h1>
          
          <p className="text-gray-600 text-center mb-6">
            {error}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.href = fallbackPath}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
            
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Clear Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Higher-order component for role-based protection
export const withRoleProtection = (Component, requiredRole) => {
  return (props) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Hook to check current user role
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole') || localStorage.getItem('role');
    const userIdentifier = localStorage.getItem('userIdentifier');

    if (token && userRole) {
      setUser({
        role: userRole,
        identifier: userIdentifier,
        token: token
      });
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  return { user, loading, logout, hasRole, hasAnyRole };
};

export default ProtectedRoute;
