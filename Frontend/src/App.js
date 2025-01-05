import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import Loader from "./layouts/loader/Loader"; // Assuming you have a loading component for Suspense

// Error Boundary component (to handle errors in lazy-loaded components)
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  // Using react-router's `useRoutes` hook for route management
  const routing = useRoutes(Themeroutes);

  return (
    <div className="dark"> {/* Dark mode class */}
      <Suspense fallback={<Loader />}> {/* Suspense Fallback */}
        {/* Wrapping routing in ErrorBoundary to catch any errors */}
        <ErrorBoundary>
          {routing}
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

export default App;
