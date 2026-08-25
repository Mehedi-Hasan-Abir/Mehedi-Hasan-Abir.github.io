const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;
const gaId = (import.meta.env.VITE_GOOGLE_ANALYTICS_ID ?? "").trim();
let analyticsInitialized = false;

function isAnalyticsAvailable(): boolean {
  return import.meta.env.PROD && GA_ID_PATTERN.test(gaId) && typeof window.gtag === "function";
}

export const initAnalytics = (): boolean => {
  if (!import.meta.env.PROD) return false;

  if (!GA_ID_PATTERN.test(gaId)) {
    console.warn("Google Analytics disabled: VITE_GOOGLE_ANALYTICS_ID is missing or invalid.");
    return false;
  }

  if (analyticsInitialized) return true;

  window.dataLayer ??= [];
  // CRITICAL: must push the Arguments object (official stub pattern), NOT a
  // real Array - gtag.js ignores Array entries and never initializes,
  // silently suppressing every hit.
  window.gtag ??= function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[data-google-analytics-id="${gaId}"]`,
  );

  if (!existingScript) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    script.dataset.googleAnalyticsId = gaId;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", gaId, { send_page_view: false });
  analyticsInitialized = true;
  return true;
};

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
) => {
  if (isAnalyticsAvailable()) {
    window.gtag?.("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  } else if (!import.meta.env.PROD) {
    console.log(`[Analytics] Event: ${action} | Category: ${category} | Label: ${label} | Value: ${value}`);
  }
};

export const trackPageView = (path: string) => {
  if (isAnalyticsAvailable()) {
    window.gtag?.("event", "page_view", {
      page_title: document.title,
      page_location: new URL(path, window.location.origin).href,
      page_path: path,
    });
  } else if (!import.meta.env.PROD) {
    console.log(`[Analytics] Page View: ${path}`);
  }
};

export const trackTiming = (name: string, value: number, label?: string) => {
  if (isAnalyticsAvailable()) {
    window.gtag?.("event", "timing_complete", {
      name,
      value,
      event_category: "Timing",
      event_label: label,
    });
  } else if (!import.meta.env.PROD) {
    console.log(`[Analytics] Timing: ${name} | ${value}ms | ${label}`);
  }
};

export function trackTradeoffGameView(): void {
  trackEvent("tradeoff_game_view", "Tradeoff Game", "Game View");
}

export function trackTradeoffSessionStart(sessionId: string, questionCount: number): void {
  trackEvent("tradeoff_session_start", "Tradeoff Game", `Session: ${sessionId}`, questionCount);
}

export interface TradeoffChoiceParams {
  questionId: string;
  optionId: string;
  category: string;
  latencyDelta: number;
  throughputDelta: number;
  costDelta: number;
  complexityDelta: number;
}

export function trackTradeoffChoice(params: TradeoffChoiceParams): void {
  if (isAnalyticsAvailable()) {
    window.gtag?.("event", "tradeoff_choice", {
      question_id: params.questionId,
      option_id: params.optionId,
      category: params.category,
      latency_delta: params.latencyDelta,
      throughput_delta: params.throughputDelta,
      cost_delta: params.costDelta,
      complexity_delta: params.complexityDelta,
    });
  } else if (!import.meta.env.PROD) {
    console.log("[Analytics] Tradeoff Choice:", params);
  }
}

export interface TradeoffSessionCompleteParams {
  xpEarned: number;
  style: string;
  totals: {
    latency: number;
    throughput: number;
    cost: number;
    complexity: number;
  };
  timeSeconds: number;
  sessionId: string;
}

export function trackTradeoffSessionComplete(params: TradeoffSessionCompleteParams): void {
  if (isAnalyticsAvailable()) {
    window.gtag?.("event", "tradeoff_session_complete", {
      xp_earned: params.xpEarned,
      style: params.style,
      latency_total: params.totals.latency,
      throughput_total: params.totals.throughput,
      cost_total: params.totals.cost,
      complexity_total: params.totals.complexity,
      time_seconds: params.timeSeconds,
      session_id: params.sessionId,
    });
  } else if (!import.meta.env.PROD) {
    console.log("[Analytics] Tradeoff Session Complete:", params);
  }
}

export function trackTradeoffShareResult(sessionId: string, style: string): void {
  trackEvent("tradeoff_share_result", "Tradeoff Game", `Session: ${sessionId} | Style: ${style}`);
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
