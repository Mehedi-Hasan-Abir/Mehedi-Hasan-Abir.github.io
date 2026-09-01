import { useEffect, useRef } from "react";

/**
 * Custom cursor: accent dot + lagging ring (mix-blend difference).
 * Desktop only (pointer: fine). Ring scales up over interactive elements.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.style.cursor = "none";
    dot.style.opacity = "1";
    ring.style.opacity = "1";

    let mx = -100, my = -100, rx = -100, ry = -100;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      // e.target is only typed as EventTarget: synthesized pointer moves (device
      // emulation / touch) and moves over the page gutter can hand us the
      // document or a text node, and only Element has .closest().
      const target = e.target;
      hovering =
        target instanceof Element &&
        target.closest("a, button, [role='button'], input, textarea, select, [data-cursor='grow']") !== null;
      dot.style.opacity = hovering ? "0" : "1";
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${hovering ? 1.9 : 1})`;
      ring.style.borderColor = hovering ? "hsl(var(--primary))" : "hsl(var(--border))";
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="hidden md:block fixed top-0 left-0 z-[100] w-2 h-2 rounded-full bg-primary pointer-events-none"
        style={{ opacity: 0 }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="hidden md:block fixed top-0 left-0 z-[100] w-9 h-9 rounded-full border pointer-events-none transition-[border-color] duration-200"
        style={{ opacity: 0 }}
      />
    </>
  );
}
