import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import Loader from "../layouts/loader/Loader";

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRoles && !hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;