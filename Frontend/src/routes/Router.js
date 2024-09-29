import { lazy } from "react";
import { Navigate } from "react-router-dom";
import AddClientForm from "../components/client/AddClientForm";
import AddCompte from "../components/compte/AddCompte";
import OcrList from "../components/ocr/OcrList";
import OcrUpload from "../components/ocr/OcrUpload"; // New component for uploading and analyzing OCR
import OcrDetail from "../components/ocr/OcrDetail"; // New component for detailed OCR view if needed

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/
const Starter = lazy(() => import("../views/Starter.js"));
const About = lazy(() => import("../views/About.js"));
const Clients = lazy(() => import("../views/ui/Clients"));
const Comptes = lazy(() => import("../views/ui/Comptes"));

/*****Routes******/
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/starter" /> },
      { path: "/starter", exact: true, element: <Starter /> },
      { path: "/about", exact: true, element: <About /> },
      { path: "/clients", exact: true, element: <Clients /> },
      { path: "/clients/add", exact: true, element: <AddClientForm /> },
      { path: "/comptes", exact: true, element: <Comptes /> },
      { path: "/comptes/add", exact: true, element: <AddCompte /> },
      { path: "/ocrs", exact: true, element: <OcrList /> },
      { path: "/ocrs/upload", exact: true, element: <OcrUpload /> }, // Route for uploading and analyzing OCR
      { path: "/ocrs/:id", exact: true, element: <OcrDetail /> }, // Route for OCR detail view if needed
    ],
  },
];

export default ThemeRoutes;
