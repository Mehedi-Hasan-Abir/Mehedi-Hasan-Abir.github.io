import * as Sentry from "@sentry/node";
import type { ErrorRequestHandler } from "express";

let sentryInitialized = false;

export function initSentry(): boolean {
  const sentryDsn = process.env.SENTRY_DSN?.trim();

  if (process.env.NODE_ENV !== "production") return false;

  if (!sentryDsn) {
    console.warn("Sentry disabled: SENTRY_DSN is not configured.");
    return false;
  }

  if (sentryInitialized) return true;

  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.NODE_ENV,
    release: process.env.APP_VERSION || "unknown",
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

export function sentryErrorHandler(): ErrorRequestHandler {
  return (error, _request, _response, next) => {
    if (sentryInitialized) {
      Sentry.captureException(error);
    }
    next(error);
  };
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  if (sentryInitialized) {
    Sentry.captureException(error, { extra: context });
  } else if (process.env.NODE_ENV !== "production") {
    console.error("Error captured:", error, context);
  }
}

export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
) {
  if (sentryInitialized) {
    Sentry.captureMessage(message, level);
  } else if (process.env.NODE_ENV !== "production") {
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}
