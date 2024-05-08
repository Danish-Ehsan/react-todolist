import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/general.scss";
import { ListsProvider } from "./providers/ListProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ListsProvider>
      <App />
    </ListsProvider>
  </React.StrictMode>
);
