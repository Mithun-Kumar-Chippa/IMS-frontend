import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const RoleBasedRoute = ({ children, allowedRoles, role }) => {
  const { user, isAuthenticated, loading } = useAuth();

  const roles = allowedRoles || (role ? [role] : []);

  if (loading) {
    return <LoadingSpinner message="Verifying user role authorization..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Redirect to respective role dashboard or home
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'COMPANY') return <Navigate to="/company/dashboard" replace />;
    if (user?.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;
