import { createContext, useContext, useState, useEffect, useMemo, startTransition, type ReactNode } from "react";

type ConnectionContextValue = {
  slowConnection: boolean;
  canLoadHeavy: boolean;
};

const ConnectionContext = createContext<ConnectionContextValue | null>(null);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [slowConnection, setSlowConnection] = useState(false);
  // Start false so we never render lazy components during synchronous initial paint (avoids suspend warning)
  const [canLoadHeavy, setCanLoadHeavy] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const slow =
      conn &&
      (conn.saveData === true ||
        conn.effectiveType === "slow-2g" ||
        conn.effectiveType === "2g" ||
        conn.effectiveType === "slow-3g");
    setSlowConnection(!!slow);

    const enableHeavy = () => startTransition(() => setCanLoadHeavy(true));

    if (!slow) {
      // Fast connection: enable heavy content after paint (avoids suspend on first paint)
      enableHeavy();
      return;
    }
    const useIdle = typeof window !== "undefined" && "requestIdleCallback" in window;
    const idleId = useIdle
      ? window.requestIdleCallback(
          () => setTimeout(enableHeavy, 800),
          { timeout: 2000 }
        )
      : 0;
    const timeoutId = useIdle ? 0 : setTimeout(enableHeavy, 1500);
    return () => {
      if (useIdle && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const value = useMemo(
    () => ({ slowConnection, canLoadHeavy }),
    [slowConnection, canLoadHeavy]
  );

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const ctx = useContext(ConnectionContext);
  if (!ctx) {
    return { slowConnection: false, canLoadHeavy: true };
  }
  return ctx;
}
