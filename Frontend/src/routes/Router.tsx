import React, { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout"));

/***** Pages ****/
const Dashboard = lazy(() => import("../components/dashboard/Dashboard"));
const Clients = lazy(() => import("../components/client/Clients"));
const Comptes = lazy(() => import("../components/compte/Comptes"));
const Credits = lazy(() => import("../components/credit/Credits"));
const Ocrs = lazy(() => import("../components/ocr/Ocrs"));
const Users = lazy(() => import("../components/user/Users"));
const Roles = lazy(() => import("../components/role/Roles"));

/*****Routes******/
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" /> },
      { path: "/dashboard", exact: true, element: <Dashboard /> },
      { path: "/clients", exact: true, element: <Clients /> },
      { path: "/comptes", exact: true, element: <Comptes /> },
      { path: "/credits", exact: true, element: <Credits /> },
      { path: "/ocrs", exact: true, element: <Ocrs /> },
      { path: "/users", exact: true, element: <Users /> },
      { path: "/roles", exact: true, element: <Roles /> },
    ],
  },
];

export default ThemeRoutes;
