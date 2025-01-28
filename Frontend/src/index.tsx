import React, { Suspense } from "react";
import {createRoot} from 'react-dom/client';
import "./assets/scss/style.scss";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals";
import { HashRouter } from "react-router-dom";
import Loader from "./layouts/loader/Loader";

const rootElement: any = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <Suspense fallback={<Loader />}>
    <HashRouter>
      <App />
    </HashRouter>
  </Suspense>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
