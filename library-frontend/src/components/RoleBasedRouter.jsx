import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleBasedRouter = ({ userRole, userId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Route based on user role after login
    switch (userRole) {
      case 'student':
        navigate('/student/dashboard');
        break;
      case 'library_staff':
        navigate('/library/dashboard');
        break;
      case 'college_staff':
        navigate('/staff/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  }, [userRole, userId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default RoleBasedRouter;
