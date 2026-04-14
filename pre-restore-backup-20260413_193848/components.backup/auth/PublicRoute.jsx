import React, { forwardRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
const PublicRoute = forwardRef(PublicRoute);
export default function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
PublicRoute.displayName = 'PublicRoute';
