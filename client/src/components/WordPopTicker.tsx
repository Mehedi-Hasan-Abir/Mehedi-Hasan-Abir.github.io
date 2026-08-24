import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WordPopTickerProps {
  phrases: string[];
}

const WORD_STAGGER = 0.09;
const HOLD_MS = 2100;

/**
 * Hero phrases pop in word by word, hold, then swap to the next phrase.
 * Always animates (site-owner requirement); loops indefinitely.
 */
export function WordPopTicker({ phrases }: WordPopTickerProps) {
  const [index, setIndex] = useState(0);

  const words = phrases[index]?.split(" ") ?? [];

  useEffect(() => {
    if (phrases.length <= 1) return;
    const hold = HOLD_MS + words.length * WORD_STAGGER * 1000;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, hold);
    return () => clearTimeout(t);
  }, [index, phrases, words.length]);

  return (
    <div
      className="min-h-[2.2rem] md:min-h-[2.4rem] overflow-hidden"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          className="text-lg md:text-xl font-semibold text-foreground flex flex-wrap gap-x-[0.45em]"
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -14, transition: { duration: 0.28, ease: "easeIn" } }}
          variants={{
            visible: {
              transition: { staggerChildren: WORD_STAGGER },
            },
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={`${index}-${i}`}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: "0.7em", scale: 0.92 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 320, damping: 24 },
                },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
