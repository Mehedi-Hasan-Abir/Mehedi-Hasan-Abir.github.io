interface NetworkInformation {
  readonly effectiveType: "slow-2g" | "2g" | "3g" | "4g";
  readonly saveData: boolean;
  readonly downlink: number;
  readonly rtt: number;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

interface Navigator {
  readonly connection?: NetworkInformation;
}

interface Window {
  dataLayer?: any[];
  gtag?: (...args: unknown[]) => void;
}
