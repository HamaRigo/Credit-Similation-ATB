import React, {Suspense} from "react";
import { Routes, Route } from "react-router-dom";
import ThemeRoutes from "./routes/Router";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loader from "./layouts/loader/Loader";

const App = () => {
  //const routing = useRoutes(ThemeRoutes);
  //return (<div>{routing}</div>);

  return (
    <Routes>
      {ThemeRoutes.map(({ path, element, requiredRoles, children }) => (
        <Route
          key={path}
          path={path}
          element={
            requiredRoles ? (
              <ProtectedRoute requiredRoles={requiredRoles}>
                <Suspense fallback={<Loader />}>
                  {element}
                </Suspense>
              </ProtectedRoute>
            ) : (
              <Suspense fallback={<Loader />}>
                {element}
              </Suspense>
            )
          }
        >
          {children?.map((child) => (
            <Route
              key={child.path}
              path={child.path}
              element={
                <ProtectedRoute requiredRoles={child.requiredRoles}>
                  <Suspense fallback={<Loader />}>
                    {child.element}
                  </Suspense>
                </ProtectedRoute>
              }
            />
          ))}
        </Route>
      ))}
    </Routes>
  );
}

export default App;
