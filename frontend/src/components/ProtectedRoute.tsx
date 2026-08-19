import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Check role if allowedRoles is provided
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        // Redirect to their respective home page based on role
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'teacher') return <Navigate to="/instructor" replace />;
        if (user.role === 'student') return <Navigate to="/my-courses" replace />;
        return <Navigate to="/" replace />;
      }
    }

    return children ? <>{children}</> : <Outlet />;
  } catch (error) {
    // If parsing fails or something goes wrong, force re-login
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
