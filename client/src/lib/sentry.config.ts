import * as Sentry from "@sentry/react";

export function initSentry() {
  const sentryDSN = import.meta.env.VITE_SENTRY_DSN ?? "";
  
  // Initialize Sentry in production
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: sentryDSN,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || "unknown",
      
      // Performance Monitoring
      tracesSampleRate: 0.1, // 10% of transactions
      
      // Error Sampling
      sampleRate: 1.0, // 100% of errors
      
      // Additional configuration
      attachStacktrace: true,
      sendDefaultPii: false, // Don't send personal data
      
      // Before sending event, scrub sensitive data
      beforeSend(event) {
        // Remove user IP if present
        if (event.user?.ip_address) {
          delete event.user.ip_address;
        }
        
        // Remove query parameters from URLs
        if (event.request?.url) {
          event.request.url = event.request.url.split('?')[0];
        }
        
        return event;
      },
    });

    console.log("✅ Sentry initialized for production monitoring");
  } else {
    console.log("⚠️ Sentry not initialized (development mode)");
  }
}

// Helper function to capture exceptions with context
export function captureError(error: Error, context?: Record<string, any>) {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      tags: context,
    });
  } else {
    console.error("Error captured:", error, context);
  }
}

// Helper function to capture message
export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}