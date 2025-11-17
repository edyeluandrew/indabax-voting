import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Verifying access..." />;
  }

  // Check if user is logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if route is admin-only
  if (adminOnly && !isAdmin) {
    return <Navigate to="/vote" replace />;
  }

  return children;
};

export default ProtectedRoute;