import React from 'react';
import { Navigate } from 'react-router-dom';
const RoleBasedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/unauthorized" />;
  return children;
};
export default RoleBasedRoute;
