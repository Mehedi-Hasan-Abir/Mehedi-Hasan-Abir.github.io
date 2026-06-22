import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RoleTickerProps {
  phrases: string[];
}

export function RoleTicker({ phrases }: RoleTickerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [phrases.length]);

  return (
    <div className="mb-8 h-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={phrases[index]}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="font-mono text-primary/85"
        >
          {phrases[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
