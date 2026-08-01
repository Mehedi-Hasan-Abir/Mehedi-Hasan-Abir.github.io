import * as Sentry from "@sentry/react";

let sentryInitialized = false;

export function initSentry(): boolean {
  const sentryDsn = (import.meta.env.VITE_SENTRY_DSN ?? "").trim();

  if (!import.meta.env.PROD) return false;

  if (!sentryDsn) {
    console.warn("Sentry disabled: VITE_SENTRY_DSN is not configured.");
    return false;
  }

  if (sentryInitialized) return true;

  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION || "unknown",
    tracesSampleRate: 0.1,
    sampleRate: 1.0,
    attachStacktrace: true,
    sendDefaultPii: false,
    beforeSend(event) {
      if (event.user?.ip_address) {
        delete event.user.ip_address;
      }

      if (event.request?.url) {
        event.request.url = event.request.url.split("?")[0];
      }

      return event;
    },
  });

  sentryInitialized = true;
  return true;
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  if (sentryInitialized) {
    Sentry.captureException(error, { extra: context });
  } else if (!import.meta.env.PROD) {
    console.error("Error captured:", error, context);
  }
}

export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
) {
  if (sentryInitialized) {
    Sentry.captureMessage(message, level);
  } else if (!import.meta.env.PROD) {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}
