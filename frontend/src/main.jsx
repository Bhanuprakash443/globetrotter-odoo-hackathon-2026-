import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { TripsProvider } from "./context/TripsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TripsProvider>
      <App />
    </TripsProvider>
  </React.StrictMode>
);


