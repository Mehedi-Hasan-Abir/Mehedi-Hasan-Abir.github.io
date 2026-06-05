import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initSentry } from "./lib/sentry.config";
import { initAnalytics } from "./lib/analytics";

// Defer analytics and Sentry until after load + idle (critical path first; better for 2G)
function deferHeavy() {
  initSentry();
  initAnalytics();
}
function scheduleDeferred() {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(deferHeavy, { timeout: 2500 });
  } else {
    setTimeout(deferHeavy, 600);
  }
}
if (document.readyState === "complete") {
  scheduleDeferred();
} else {
  window.addEventListener("load", scheduleDeferred, { once: true });
}

createRoot(document.getElementById("root")!).render(<App />);
