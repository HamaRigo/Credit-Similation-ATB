import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://localhost:8282",
  realm: "spring-microservices-realm",
  clientId: "frontend-client"
};

const keycloak = new Keycloak(keycloakConfig);

// Initialize with proper error handling
keycloak.init({ onLoad: "check-sso" })
  .then(() => console.debug("Keycloak initialized"))
  .catch((error) => console.error("Keycloak init error:", error));

export default keycloak;