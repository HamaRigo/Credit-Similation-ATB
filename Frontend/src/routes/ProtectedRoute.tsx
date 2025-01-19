import React, { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactElement;
    roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
    const { keycloak } = useKeycloak();
    const [isReady, setIsReady] = useState(false);

    // Ensure Keycloak initialization before rendering
    useEffect(() => {
        if (keycloak.authenticated !== undefined) {
            setIsReady(true);
        }
    }, [keycloak]);

    if (!isReady) {
        return <div>Loading...</div>;
    }

    const isLoggedIn = keycloak.authenticated;

    const isAuthorized = roles
        ? roles.some((role) => keycloak.hasRealmRole(role))
        : true;

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (!isAuthorized) {
        return <Navigate to="/unauthorized" />; // Redirect unauthorized users
    }

    return children;
};

export default ProtectedRoute;