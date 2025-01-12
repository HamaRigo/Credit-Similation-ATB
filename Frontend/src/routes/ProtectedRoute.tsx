import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactElement;
    roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
    const { keycloak } = useKeycloak();

    const isLoggedIn = keycloak.authenticated;

    /*const isAuthorized = roles
        ? roles.some((role) => keycloak.hasRealmRole(role))
        : true;

    if (!isAuthorized) {
        return <Navigate to="/unauthorized" />;
    }*/

    return isLoggedIn ? children : null;
};

export default ProtectedRoute;