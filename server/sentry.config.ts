import * as Sentry from "@sentry/node";

export function initSentry() {
  // Your Sentry DSN
  const sentryDSN = "https://f106d2ca34250ebfe63aea448a216933@o4510682863239168.ingest.de.sentry.io/4510682869858384";
  
  // Initialize Sentry in production
  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: sentryDSN,
      environment: process.env.NODE_ENV,
      release: process.env.APP_VERSION || "unknown",
      
      // Performance Monitoring
      tracesSampleRate: 0.1, // 10% of transactions
      
      // Error Sampling
      sampleRate: 1.0, // 100% of errors
      
      // Additional configuration
      attachStacktrace: true,
      sendDefaultPii: false,
      
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

    console.log("✅ Sentry initialized for backend monitoring");
  } else {
    console.log("⚠️ Sentry not initialized (development mode)");
  }
}

// Express error handler middleware
export function sentryErrorHandler() {
  // Return a middleware function that handles errors
  return (err: any, req: any, res: any, next: any) => {
    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(err);
    }
    next(err);
  };
}

// Helper function to capture exceptions
export function captureError(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      tags: context,
    });
  } else {
    console.error("Error captured:", error, context);
  }
}

// Helper function to capture message
export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}