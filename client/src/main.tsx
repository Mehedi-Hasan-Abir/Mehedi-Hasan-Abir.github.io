import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initSentry } from "./lib/sentry.config";
import { initAnalytics } from "./lib/analytics";

// Initialize Sentry error monitoring
initSentry();

// Initialize Google Analytics
initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
