import React, { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Loader from "../layouts/loader/Loader";

/***** Layouts *****/
const FullLayout = lazy(() => import("../layouts/FullLayout"));

/***** Pages *****/
const Dashboard = lazy(() => import("../views/Dashboard"));
const Clients = lazy(() => import("../views/ui/Clients"));
// const AddClientForm = lazy(() => import("../views/ui/AddClientForm"));
// const Comptes = lazy(() => import("../views/ui/Comptes"));
// const AddCompte = lazy(() => import("../views/ui/AddCompte"));
// const OcrList = lazy(() => import("../views/ui/OcrList"));
// const OcrUpload = lazy(() => import("../views/ui/OcrUpload"));
// const OcrDetail = lazy(() => import("../views/ui/OcrDetail"));
const UnauthorizedPage = lazy(() => import("../views/UnauthorizedPage"));

/***** Routes *****/
const ThemeRoutes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <FullLayout />
      </Suspense>
    ),
    children: [
      // Redirect root to /dashboard
      { path: "/", element: <Navigate to="/dashboard" replace /> },

      // Dashboard route
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute roles={["admin", "user"]}>
            <Suspense fallback={<Loader />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // Clients route
      {
        path: "/clients",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <Suspense fallback={<Loader />}>
              <Clients />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      /*{
        path: "/clients/add",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <Suspense fallback={<Loader />}>
              {<AddClientForm />}
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/comptes",
        element: (
          <ProtectedRoute roles={["admin", "user"]}>
            <Suspense fallback={<Loader />}>
              {<Comptes />}
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/comptes/add",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <Suspense fallback={<Loader />}>
              {<AddCompte />}
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/ocrs",
        element: (
          <ProtectedRoute roles={["admin", "user"]}>
            <Suspense fallback={<Loader />}>
              {<OcrList />}
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/ocrs/upload",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <Suspense fallback={<Loader />}>
              {<OcrUpload />}
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/ocrs/:id",
        element: (
          <ProtectedRoute roles={["admin", "user"]}>
            <Suspense fallback={<Loader />}>
              {<OcrDetail />}
            </Suspense>
          </ProtectedRoute>
        ),
      },*/
      {
        path: "/unauthorized",
        element: (
          <Suspense fallback={<Loader />}>
            <UnauthorizedPage />
          </Suspense>
        ),
      },
    ],
  },
];

export default ThemeRoutes;