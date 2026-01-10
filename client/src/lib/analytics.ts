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