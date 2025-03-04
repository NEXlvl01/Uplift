import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
  <Toaster />
    <App />
  </BrowserRouter>
);
