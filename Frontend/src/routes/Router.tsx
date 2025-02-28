import React, { JSX, lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

/**** Layouts *****/
const FullLayout = lazy(() => import("../layouts/FullLayout"));

/***** Pages ****/
const Dashboard = lazy(() => import("../components/dashboard/Dashboard"));
const Clients = lazy(() => import("../components/client/Clients"));
const ClientDetails = lazy(() => import("../components/client/ClientDetails"));
const Comptes = lazy(() => import("../components/compte/Comptes"));
const Credits = lazy(() => import("../components/credit/Credits"));
const Ocrs = lazy(() => import("../components/ocr/Ocrs"));
const Users = lazy(() => import("../components/user/Users"));
const Roles = lazy(() => import("../components/role/Roles"));
const UnauthorizedPage = lazy(() => import("../views/UnauthorizedPage"));

/*****Routes******/
const ThemeRoutes: AppRoute[] = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" /> },
      { path: "/dashboard", exact: true, element: (
          <ProtectedRoute requiredRoles={["admin"]}>
              <Dashboard />
          </ProtectedRoute>
        )},
      { path: "/clients", exact: true, element: (
          <ProtectedRoute requiredRoles={["user", "admin"]}>
            <Clients />
          </ProtectedRoute>
        )},
      { path: "/clients/:numeroDocument", exact: true, element: (
          <ProtectedRoute requiredRoles={["user", "admin"]}>
            <ClientDetails />
          </ProtectedRoute>
        )},
      { path: "/comptes", exact: true, element: (
          <ProtectedRoute requiredRoles={["user", "admin"]}>
            <Comptes />
          </ProtectedRoute>
        ) },
      { path: "/credits", exact: true, element: (
            <ProtectedRoute requiredRoles={["user", "admin"]}>
              <Credits />
            </ProtectedRoute>
        )},
      { path: "/ocrs", exact: true, element: (
          <ProtectedRoute requiredRoles={["user", "admin"]}>
            <Ocrs />
          </ProtectedRoute>
        )},
      { path: "/users", exact: true, element: (
          <ProtectedRoute requiredRoles={["admin"]}>
              <Users />
          </ProtectedRoute>
        )},
      { path: "/roles", exact: true, element: (
          <ProtectedRoute requiredRoles={["admin"]}>
            <Roles />
          </ProtectedRoute>
       )},
      { path: "/unauthorized", element: <UnauthorizedPage /> },
    ],
  },
];

interface AppRoute {
  path: string;
  exact?: boolean;
  element: JSX.Element | null;
  requiredRoles?: string[];
  children?: AppRoute[];
}

export default ThemeRoutes;
