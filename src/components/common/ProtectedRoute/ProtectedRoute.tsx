import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux.ts';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { credentials, isAuthorized } = useAppSelector((state) => state.auth);

  if (!credentials || !isAuthorized) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
