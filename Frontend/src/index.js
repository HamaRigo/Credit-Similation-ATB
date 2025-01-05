import React, { Suspense } from "react";
// import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import "./assets/scss/style.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter } from "react-router-dom";
import Loader from "./layouts/loader/Loader";

// Create the root of the app
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Suspense fallback={<Loader />}>
    <HashRouter>
      <App />
    </HashRouter>
  </Suspense>
);

// Measure performance
reportWebVitals();
