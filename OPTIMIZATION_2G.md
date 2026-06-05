# 2G / Low-Data Optimizations

The portfolio loads **critical content first**, then **heavy assets** (animations, images, analytics) so 2G and slow-3G users see the page quickly.

## What loads first (critical path)

- HTML shell and minimal CSS
- React app and core UI (navbar, hero text, sections)
- Only **Geist + Geist Mono** fonts (via `index.css`; no huge font link in HTML)
- **No** TechAnimation, **no** CursorFollower, **no** hero image, **no** analytics/Sentry

## What loads later (deferred)

- **TechAnimation** – lazy-loaded and only mounted when `canLoadHeavy` is true (after idle when connection is slow)
- **CursorFollower** – rendered only when `canLoadHeavy` is true
- **Hero avatar image** – shown as initials placeholder until `canLoadHeavy`; then the real image loads
- **Sentry & Google Analytics** – initialized after `window.load` + `requestIdleCallback` (never block first paint)

## How “slow” is detected

- **`navigator.connection`** (where supported): `effectiveType` is `2g`, `slow-2g`, or `slow-3g`, or **`saveData === true`**
- **Fast connection**: heavy content loads immediately
- **Slow connection**: heavy content is deferred until after `requestIdleCallback` + short delay (~800 ms) so the shell paints first

## Files changed

| File | Change |
|------|--------|
| `client/index.html` | Removed large fonts link and inline analytics/Sentry scripts |
| `client/src/main.tsx` | Defer `initSentry()` and `initAnalytics()` until after load + idle |
| `client/src/contexts/ConnectionContext.tsx` | New: `ConnectionProvider`, `useConnection()` (slowConnection, canLoadHeavy) |
| `client/src/App.tsx` | Wrap with `ConnectionProvider`; render `CursorFollower` only when `canLoadHeavy` |
| `client/src/pages/Home.tsx` | Lazy-load `TechAnimation`; show hero image only when `canLoadHeavy`, else initials placeholder |

## Testing on 2G

**No Chrome?** Use **Microsoft Edge** (same steps – F12 → Network → Throttling) or **Firefox** (F12 → Network → Network throttling). Edge is preinstalled on Windows.

1. **Edge / Chrome**: **F12** → **Network** → Throttling → **Slow 3G** or add custom **50 kbps** (2G). **Firefox**: **F12** → **Network** → **⋮** → **Network throttling** → **Slow 3G** or **Custom**.
2. Hard reload (**Ctrl+Shift+R**); you should see hero text and layout within a few seconds; animation and avatar appear shortly after.
3. Optional: enable **Data Saver** (or set **Save-Data** in DevTools) to simulate `navigator.connection.saveData === true`.

## Optional: load fonts only when not slow

Today fonts (Geist, Geist Mono) are still loaded via `index.css` so the site looks correct. To save more on 2G you could:

- Load font CSS only when `!slowConnection` (e.g. inject `<link>` from JS after `useConnection().slowConnection === false`), and use system fonts until then.
