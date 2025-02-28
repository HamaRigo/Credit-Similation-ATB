// src/types/keycloak.d.ts
import 'keycloak-js';

declare module 'keycloak-js' {
    interface KeycloakStatic {
        /**
         * Enables or disables logging to the console
         * @param verbose Whether to enable verbose logging
         */
        enableLogging(verbose?: boolean): void;
    }
}