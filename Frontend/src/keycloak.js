// @ts-ignore
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8282", // Keycloak server URL
    realm: "spring-microservices-realm", // Your Keycloak realm
    clientId: "frontend-client", // Client ID configured in Keycloak
});

export default keycloak;