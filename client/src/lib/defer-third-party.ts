/** Keep monitoring and analytics off the initial render path. */
export function afterLoadWhenIdle(callback: () => void): void {
  const schedule = () => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(callback, { timeout: 3000 });
    } else {
      setTimeout(callback, 0);
    }
  };

  if (document.readyState === "complete") {
    schedule();
  } else {
    window.addEventListener("load", schedule, { once: true });
  }
}
