import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AddClientForm from "../components/client/AddClientForm";
import AddCompte from "../components/compte/AddCompte";
import OcrList from "../components/ocr/OcrList";
import OcrUpload from "../components/ocr/OcrUpload"; // New component for uploading and analyzing OCR
import OcrDetail from "../components/ocr/OcrDetail";
import OcrPreview from "../components/ocr/OcrPreview"; // The new OCR Preview component
import Profile from "../components/client/profile"; // New component for detailed OCR view if needed

// Custom 404 page
import NotFound from "../components/NotFound";

// Layouts
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

// Pages
const Starter = lazy(() => import("../views/Starter.js"));
const About = lazy(() => import("../views/About.js"));
const Clients = lazy(() => import("../views/ui/Clients"));
const Comptes = lazy(() => import("../views/ui/Comptes"));

// Routes configuration with lazy loading
const Themeroutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      // Home redirect
      { path: "/", element: <Navigate to="/starter" /> },

      // Static pages
      { path: "/starter", element: <Starter /> },
      { path: "/about", element: <About /> },

      // Client-related routes
      { path: "/clients", element: <Clients /> },
      { path: "/clients/add", element: <AddClientForm /> },
      { path: "/clients/sign", element: <Profile /> },

      // Account-related routes
      { path: "/comptes", element: <Comptes /> },
      { path: "/comptes/add", element: <AddCompte /> },

      // OCR-related routes
      { path: "/ocrs", element: <OcrList /> },
      { path: "/ocrs/upload", element: <OcrUpload /> }, // Route for uploading and analyzing OCR
      { path: "/ocrs/preview", element: <OcrPreview /> }, // Route for the OCR preview
      { path: "/ocrs/:id", element: <OcrDetail /> }, // Route for OCR detail view based on the ID

      // Fallback for unknown routes (404)
      { path: "*", element: <NotFound /> }, // Custom 404 page
    ],
  },
];

export default Themeroutes;
