import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');

  if (!isAuthenticated) {
    // user is not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;