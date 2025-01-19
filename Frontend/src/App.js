import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import {  useRoutes } from "react-router-dom";
import ThemeRoutes from "./routes/Router";
import keycloak from "./keycloak";
import Header from "./layouts/Header";

const App = () => {
  const routing = useRoutes(ThemeRoutes);

  return (
    <ReactKeycloakProvider
        authClient={keycloak}
        initOptions={{
            onLoad: 'login-required',
            checkLoginIframe: false,
        }}
    >
        <Header />
        <React.StrictMode>{routing}</React.StrictMode>
    </ReactKeycloakProvider>
  );
};

export default App;