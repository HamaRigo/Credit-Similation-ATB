import React from "react";
import { useRoutes } from "react-router-dom";
import ThemeRoutes from "./routes/Router";

const App = () => {
  const routing = useRoutes(ThemeRoutes);

  return <div className="dark">{routing}</div>;
};

export default App;
