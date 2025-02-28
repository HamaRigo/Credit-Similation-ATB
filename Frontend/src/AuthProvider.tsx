import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Keycloak from "keycloak-js";
import Loader from "./layouts/loader/Loader";

// Initialize Keycloak instance
const keycloak = new Keycloak({
  url: "http://localhost:8282",
  realm: "spring-microservices-realm",
  clientId: "frontend-client"
});

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { name: string; email: string } | null;
  roles: string[];
  hasRole: (requiredRoles: string[]) => boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Custom Hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const didInit = useRef(false);

  const [authState, setAuthState] = useState<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    roles: [],
    hasRole: () => false,
    login: async () => {},
    logout: async () => {},
  });

  // Memoize login so it doesn't change on every render.
  const handleLogin = useCallback(async () => {
    try {
      await keycloak.login({
        redirectUri: window.location.origin + location.pathname,
        prompt: 'login' // Force fresh login
      });
    } catch (error) {
      console.error("Login failed:", error);
      navigate("/");
    }
  }, [location.pathname, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await keycloak.logout({
        redirectUri: window.location.origin
      });
      // Clear tokens after successful logout callback
      keycloak.clearToken();
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error("Logout error:", error);
    }
    // Always reset state
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: false,
      isLoading: false,
      user: null,
      roles: [],
    }));
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    const initializeKeycloak = async () => {
      if (didInit.current) return;
      didInit.current = true;

      try {
        const authenticated = await keycloak.init({
          onLoad: "login-required",
          pkceMethod: "S256",
          checkLoginIframe: false,
          redirectUri: window.location.origin + location.pathname,
        });

        if (authenticated) {
          // Validate token immediately
          const refreshed = await keycloak.updateToken(30);
          if (refreshed) {
            console.debug("Token refreshed successfully");
          }

          // Process token claims
          const tokenParsed = keycloak.tokenParsed || {};
          const roles = [
            ...(tokenParsed.realm_access?.roles || []),
            ...(tokenParsed.resource_access?.[keycloak.clientId]?.roles || []),
          ];

          // Store tokens securely
          localStorage.setItem("kc_token", keycloak.token || "");
          localStorage.setItem("kc_refreshToken", keycloak.refreshToken || "");

          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: {
              name: tokenParsed.preferred_username || "Unknown",
              email: tokenParsed.email || "No email",
            },
            roles,
            hasRole: (requiredRoles) => requiredRoles.some(role => roles.includes(role)),
            login: handleLogin,
            logout: handleLogout,
          });
        }
      } catch (error) {
        console.error("Keycloak initialization failed:", error);
        handleLogout();
      }
    };

    // Add timeout to prevent race conditions
    const initTimeout = setTimeout(() => {
      initializeKeycloak();
    }, 100);

    return () => clearTimeout(initTimeout);
  }, [handleLogin, handleLogout, location.pathname]);

  // Token refresh logic
  useEffect(() => {
    const interval = setInterval(async () => {
      if (keycloak.authenticated) {
        try {
          await keycloak.updateToken(30);
          console.debug("Token refreshed automatically");
        } catch (error) {
          console.error("Token refresh failed:", error);
          handleLogout();
        }
      }
    }, 45000); // Refresh every 45 seconds

    return () => clearInterval(interval);
  }, [handleLogout]);

  return (
    <AuthContext.Provider value={authState}>
      {authState.isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;