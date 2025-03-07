import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthProvider from "./Components/AuthContext.jsx";
import App from "./App.jsx";
import { CssBaseline } from "@mui/material";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CssBaseline />
      <App />
    </AuthProvider>
  </StrictMode>
);
