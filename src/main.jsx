import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { SidebarProvider } from "./context/SidebarContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  // Add more routes here
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster />
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </Provider>
  </StrictMode>
);
