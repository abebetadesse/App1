import React, { forwardRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
const RoleBasedRoute = forwardRef(RoleBasedRoute);
export default function RoleBasedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}
RoleBasedRoute.displayName = 'RoleBasedRoute';
