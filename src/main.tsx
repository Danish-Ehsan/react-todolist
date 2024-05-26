import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/general.scss";
import AppProvider from "./contexts/AppProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
