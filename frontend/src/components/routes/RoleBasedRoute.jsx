import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default RoleBasedRoute;
