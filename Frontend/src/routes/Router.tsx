import React, { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout"));

/***** Pages ****/
const Dashboard = lazy(() => import("../views/Dashboard"));
const Clients = lazy(() => import("../components/client/Clients"));

/*****Routes******/
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" /> },
      { path: "/dashboard", exact: true, element: <Dashboard /> },
      { path: "/clients", exact: true, element: <Clients /> },
      /*{ path: "/comptes", exact: true, element: <Comptes /> },
      { path: "/comptes/add", exact: true, element: <AddCompte /> },
      { path: "/ocrs", exact: true, element: <OcrList /> },
      { path: "/ocrs/upload", exact: true, element: <OcrUpload /> }, // Route for uploading and analyzing OCR
      { path: "/ocrs/:id", exact: true, element: <OcrDetail /> }, // Route for OCR detail view if needed*/
    ],
  },
];

export default ThemeRoutes;
