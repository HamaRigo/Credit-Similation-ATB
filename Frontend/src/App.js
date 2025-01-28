import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import {  useRoutes } from "react-router-dom";
import ThemeRoutes from "./routes/Router";
import keycloak from "./keycloak";

const App = () => {
  const routing = useRoutes(ThemeRoutes);

  return (<div>{routing}</div>);
  /*
    return (
        <ReactKeycloakProvider
            authClient={keycloak}
            initOptions={{
                onLoad: 'login-required',
                checkLoginIframe: false,
            }}
        >
            <React.StrictMode>{routing}</React.StrictMode>
        </ReactKeycloakProvider>
    );*/
};

export default App;