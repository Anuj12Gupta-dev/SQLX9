import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Show nothing while checking authentication status
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If specific role is required and user doesn't have it, redirect to appropriate dashboard
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" />;
    } else if (user.role === 'student') {
      return <Navigate to="/student" />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  // If everything checks out, render the children
  return children;
};

export default ProtectedRoute;