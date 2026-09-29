type SentryModule = typeof import("@sentry/react");

let sentry: SentryModule | null = null;
let sentryInitialization: Promise<boolean> | null = null;

export function initSentry(): Promise<boolean> {
  const sentryDsn = (import.meta.env.VITE_SENTRY_DSN ?? "").trim();

  if (!import.meta.env.PROD) return Promise.resolve(false);

  if (!sentryDsn) {
    console.warn("Sentry disabled: VITE_SENTRY_DSN is not configured.");
    return Promise.resolve(false);
  }

  if (sentry) return Promise.resolve(true);
  sentryInitialization ??= import("@sentry/react").then((module) => {
    module.init({
      dsn: sentryDsn,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || "unknown",
      // Error reporting is useful here; performance tracing is not needed.
      tracesSampleRate: 0,
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
    sentry = module;
    return true;
  }).catch((error) => {
    sentryInitialization = null;
    console.warn("Sentry failed to initialize:", error);
    return false;
  });
  return sentryInitialization;
}

export function captureError(error: Error, context?: Record<string, unknown>) {
  if (!import.meta.env.PROD) {
    console.error("Error captured:", error, context);
  } else {
    void initSentry().then((ready) => {
      if (ready) sentry?.captureException(error, { extra: context });
    });
  }
}

export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
) {
  if (!import.meta.env.PROD) {
    console.log(`[${level.toUpperCase()}] ${message}`);
  } else {
    void initSentry().then((ready) => {
      if (ready) sentry?.captureMessage(message, level);
    });
  }
}
