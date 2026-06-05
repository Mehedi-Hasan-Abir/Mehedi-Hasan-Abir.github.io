import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export function TechAnimation() {
  const symbols = ["<", "/>", "{", "}", "[", "]", "(", ")", "=>"];
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {symbols.map((symbol, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/10 font-mono text-2xl md:text-4xl font-bold"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            opacity: 0,
          }}
          animate={{
            y: Math.random() > 0.5 ? -100 : dimensions.height + 100,
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
