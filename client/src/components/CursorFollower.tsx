import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function CursorFollower() {
  // useMotionValue + useSpring: position updates go directly to the DOM,
  // bypassing React state and reconciliation entirely (was: setState at 60fps).
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const dotSpringX = useSpring(rawX, { stiffness: 500, damping: 28 });
  const dotSpringY = useSpring(rawY, { stiffness: 500, damping: 28 });
  const ringSpringX = useSpring(rawX, { stiffness: 150, damping: 20 });
  const ringSpringY = useSpring(rawY, { stiffness: 150, damping: 20 });

  // Offset so the elements are centered on the cursor
  const dotX = useTransform(dotSpringX, (v) => v - 6);
  const dotY = useTransform(dotSpringY, (v) => v - 6);
  const ringX = useTransform(ringSpringX, (v) => v - 16);
  const ringY = useTransform(ringSpringY, (v) => v - 16);

  // React state only for booleans — these change rarely, not per frame
  const [isMoving, setIsMoving] = useState(false);
  const [isInteractiveHover, setIsInteractiveHover] = useState(false);

  const [tap, setTap] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });
  const hiddenTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const tapTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setIsMoving(true);
      if (hiddenTimerRef.current) clearTimeout(hiddenTimerRef.current);
      hiddenTimerRef.current = setTimeout(() => setIsMoving(false), 1000);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      setTap({ x: touch.clientX, y: touch.clientY, visible: true });
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      tapTimerRef.current = setTimeout(
        () => setTap((prev) => ({ ...prev, visible: false })),
        400
      );
    };

    const handlePointerOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      setIsInteractiveHover(
        !!target.closest("a, button, [role='button'], input, textarea, select")
      );
    };

    const handlePointerOut = () => setIsInteractiveHover(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart as EventListener, { passive: true });
    window.addEventListener("pointerover", handlePointerOver);
    window.addEventListener("pointerout", handlePointerOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart as EventListener);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerout", handlePointerOut);
      if (hiddenTimerRef.current) clearTimeout(hiddenTimerRef.current);
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    };
  }, [rawX, rawY]);

  return (
    <>
      {/* Desktop cursor dot — position via motion values (no React re-render on move) */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-50 hidden lg:block"
        style={{ x: dotX, y: dotY }}
        animate={{
          scale: isInteractiveHover ? 0 : 1,
          opacity: isInteractiveHover ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Desktop cursor ring */}
      <motion.div
        className="fixed top-0 left-0 border-2 border-primary rounded-full pointer-events-none z-50 hidden lg:block"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: isInteractiveHover ? 44 : 32,
          height: isInteractiveHover ? 44 : 32,
          opacity: isMoving ? 1 : 0.3,
          borderColor: isInteractiveHover
            ? "rgba(56, 189, 248, 0.95)"
            : "rgba(56, 189, 248, 0.75)",
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      />

      {/* Mobile tap ripple */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border-2 border-primary rounded-full pointer-events-none z-50 lg:hidden"
        animate={{
          x: tap.x - 24,
          y: tap.y - 24,
          scale: tap.visible ? 1 : 0.5,
          opacity: tap.visible ? 0.5 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </>
  );
}
