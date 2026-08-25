import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initSentry } from "./lib/sentry.config";
import { initAnalytics } from "./lib/analytics";

initSentry();
initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
