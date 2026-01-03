import { motion } from "framer-motion";

export function TechAnimation() {
  const symbols = ["<", "/>", "{", "}", "[", "]", "(", ")", "=>"];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {symbols.map((symbol, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/10 font-mono text-2xl md:text-4xl font-bold"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            y: Math.random() > 0.5 ? -100 : window.innerHeight + 100,
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {symbol}
        </motion.div>
      ))}
    </div>
  );
}
