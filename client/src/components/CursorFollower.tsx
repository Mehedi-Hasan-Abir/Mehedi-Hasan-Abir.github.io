import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// Throttle function to reduce event listener calls
function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function CursorFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const hiddenTimerRef = useRef<NodeJS.Timeout>();

  // Mobile tap ripple state
  const [tap, setTap] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });
  const tapTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Throttle mouse move to every 16ms (~60fps)
    const handleMouseMove = throttle((e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      if (hiddenTimerRef.current) {
        clearTimeout(hiddenTimerRef.current);
      }

      hiddenTimerRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 1000);
    }, 16);

    // Tap ripple for touch devices (mobile)
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      const { clientX, clientY } = touch;

      setTap({ x: clientX, y: clientY, visible: true });
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
      tapTimerRef.current = setTimeout(() => {
        setTap((prev) => ({ ...prev, visible: false }));
      }, 400);
    };

    window.addEventListener("mousemove", handleMouseMove as EventListener);
    window.addEventListener("touchstart", handleTouchStart as EventListener, {
      passive: true,
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove as EventListener);
      window.removeEventListener("touchstart", handleTouchStart as EventListener);
      if (hiddenTimerRef.current) clearTimeout(hiddenTimerRef.current);
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    };
  }, []);

  return (
    <>
      {/* Desktop cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-primary rounded-full pointer-events-none z-50 hidden lg:block"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
        }}
      />

      {/* Desktop cursor ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-primary rounded-full pointer-events-none z-50 hidden lg:block"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          opacity: isMoving ? 1 : 0.3,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 20,
        }}
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
        transition={{
          duration: 0.35,
          ease: "easeOut",
        }}
      />
    </>
  );
}
