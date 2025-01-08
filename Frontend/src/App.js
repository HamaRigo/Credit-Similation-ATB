import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import {  useRoutes } from "react-router-dom";
import ThemeRoutes from "./routes/Router";
import keycloak from "./keycloak";

const App = () => {
  const routing = useRoutes(ThemeRoutes);

  return (
    <ReactKeycloakProvider authClient={keycloak}>
      <React.StrictMode>
        <div className="dark">
         {routing}
        </div>
      </React.StrictMode>
    </ReactKeycloakProvider>
  );
};

export default App;