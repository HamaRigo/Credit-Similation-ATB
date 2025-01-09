import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import ThemeRoutes from "./routes/Router";
import Loader from "./layouts/loader/Loader"; // Assuming you have a loading component for Suspense

// Error Boundary component (to handle errors in lazy-loaded components)
// @ts-ignore
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const routing = useRoutes(ThemeRoutes);

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
