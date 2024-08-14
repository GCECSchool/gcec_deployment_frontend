import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { SearchProvider } from "./components/hooks/searchContext";
import { AcademicProvider } from "./pages/Finance/FinanceContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SearchProvider>
    <AcademicProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AcademicProvider>
  </SearchProvider>
);
