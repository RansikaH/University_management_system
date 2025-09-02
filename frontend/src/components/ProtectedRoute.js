import React from 'react';
import { Navigate } from 'react-router-dom';
import { tokenService } from '../services/api';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const token = tokenService.getToken();
  const user = tokenService.getUser();

  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          <h4>Access Denied</h4>
          <p>You don't have permission to access this page.</p>
          <p>Required roles: {requiredRoles.join(', ')}</p>
          <p>Your role: {user.role}</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
