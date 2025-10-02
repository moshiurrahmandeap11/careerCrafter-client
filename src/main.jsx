import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { route } from "./routes/route/route.jsx";
import AuthProvider from "./contexts/AuthProvider/AuthProvider.jsx";
import { ReTitleProvider } from "re-title";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ReTitleProvider defaultTitle="Career Crafter">
        <RouterProvider router={route} />
      </ReTitleProvider>
    </AuthProvider>
  </StrictMode>
);
