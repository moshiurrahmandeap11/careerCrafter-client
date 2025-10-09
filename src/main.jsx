import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { route } from "./routes/route/route.jsx";
import AuthProvider from "./contexts/AuthProvider/AuthProvider.jsx";
import { ReTitleProvider } from "re-title";
import store from "./store/index.js";
import { Provider } from "react-redux";
import axiosIntense from "./hooks/AxiosIntense/axiosIntense.jsx";
import { HelmetProvider } from "react-helmet-async";

// --- fetch favicon before rendering app ---
const fetchFavicon = async () => {
  try {
    const response = await axiosIntense.get("/favicon"); // JSON return korche
    const faviconURL = response.data.imageUrl; // just URL

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconURL;
  } catch (err) {
    console.error("Favicon fetch failed:", err);
  }
};

await fetchFavicon(); // Vite allows top-level await

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <Provider store={store}>
      <AuthProvider>
        <ReTitleProvider defaultTitle="Career Crafter">
          <RouterProvider router={route} />
        </ReTitleProvider>
      </AuthProvider>
    </Provider>
  </HelmetProvider>
);
