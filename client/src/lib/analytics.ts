// Google Analytics 4 integration
export const initAnalytics = () => {
  // Your Google Analytics ID
  const gaId = "G-XNZ049R7NF";

  if (import.meta.env.PROD) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    const gtagScript = document.createElement('script');
    gtagScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(gtagScript);

    console.log("✅ Google Analytics initialized");
  } else {
    console.log("⚠️ Google Analytics not initialized (development mode)");
  }
};

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (import.meta.env.PROD && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    console.log(`[Analytics] Event: ${action} | Category: ${category} | Label: ${label} | Value: ${value}`);
  }
};

// Track page views
export const trackPageView = (path: string) => {
  if (import.meta.env.PROD && (window as any).gtag) {
    (window as any).gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
      page_path: path,
    });
  } else {
    console.log(`[Analytics] Page View: ${path}`);
  }
};

// Track timing
export const trackTiming = (name: string, value: number, label?: string) => {
  if (import.meta.env.PROD && (window as any).gtag) {
    (window as any).gtag('event', 'timing_complete', {
      name: name,
      value: value,
      event_category: 'Timing',
      event_label: label,
    });
  } else {
    console.log(`[Analytics] Timing: ${name} | ${value}ms | ${label}`);
  }
};

/**
 * Trade-off Game Analytics
 */

export function trackTradeoffGameView(): void {
  trackEvent('tradeoff_game_view', 'Tradeoff Game', 'Game View');
}

export function trackTradeoffSessionStart(sessionId: string, questionCount: number): void {
  trackEvent('tradeoff_session_start', 'Tradeoff Game', `Session: ${sessionId}`, questionCount);
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
  // Track as a custom event with parameters
  if (import.meta.env.PROD && (window as any).gtag) {
    (window as any).gtag('event', 'tradeoff_choice', {
      question_id: params.questionId,
      option_id: params.optionId,
      category: params.category,
      latency_delta: params.latencyDelta,
      throughput_delta: params.throughputDelta,
      cost_delta: params.costDelta,
      complexity_delta: params.complexityDelta
    });
  } else {
    console.log(`[Analytics] Tradeoff Choice:`, params);
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
  if (import.meta.env.PROD && (window as any).gtag) {
    (window as any).gtag('event', 'tradeoff_session_complete', {
      xp_earned: params.xpEarned,
      style: params.style,
      totals: params.totals,
      time_seconds: params.timeSeconds,
      session_id: params.sessionId
    });
  } else {
    console.log(`[Analytics] Tradeoff Session Complete:`, params);
  }
}

export function trackTradeoffShareResult(sessionId: string, style: string): void {
  trackEvent('tradeoff_share_result', 'Tradeoff Game', `Session: ${sessionId} | Style: ${style}`);
}

/**
 * Utility function to generate session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}