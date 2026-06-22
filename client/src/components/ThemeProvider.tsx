import { useState, useEffect } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const THEMES = {
  cyan: {
    bg: "222 47% 11%",
    primary: "199 89% 48%",
    auraDarkA: "199 89% 48%",
    auraDarkB: "217 91% 60%",
    auraDarkC: "191 89% 42%",
    auraLightA: "193 92% 52%",
    auraLightB: "210 96% 62%",
    auraLightC: "186 88% 46%",
    name: "Cyan",
  },
  blue: {
    bg: "222 47% 11%",
    primary: "217 100% 50%",
    auraDarkA: "217 100% 56%",
    auraDarkB: "225 90% 63%",
    auraDarkC: "206 94% 52%",
    auraLightA: "214 97% 57%",
    auraLightB: "229 86% 66%",
    auraLightC: "200 91% 50%",
    name: "Blue",
  },
  purple: {
    bg: "222 47% 11%",
    primary: "280 85% 55%",
    auraDarkA: "280 85% 58%",
    auraDarkB: "262 90% 66%",
    auraDarkC: "302 74% 55%",
    auraLightA: "274 88% 60%",
    auraLightB: "255 90% 70%",
    auraLightC: "298 76% 62%",
    name: "Purple",
  },
  pink: {
    bg: "222 47% 11%",
    primary: "330 81% 60%",
    auraDarkA: "332 81% 62%",
    auraDarkB: "346 83% 66%",
    auraDarkC: "307 76% 58%",
    auraLightA: "330 86% 66%",
    auraLightB: "350 88% 70%",
    auraLightC: "308 80% 63%",
    name: "Pink",
  },
  green: {
    bg: "222 47% 11%",
    primary: "142 72% 29%",
    auraDarkA: "152 67% 42%",
    auraDarkB: "168 72% 40%",
    auraDarkC: "132 63% 38%",
    auraLightA: "152 72% 46%",
    auraLightB: "170 76% 44%",
    auraLightC: "136 64% 42%",
    name: "Green",
  },
  orange: {
    bg: "222 47% 11%",
    primary: "35 100% 55%",
    auraDarkA: "35 100% 58%",
    auraDarkB: "22 96% 58%",
    auraDarkC: "49 95% 56%",
    auraLightA: "35 100% 60%",
    auraLightB: "16 96% 62%",
    auraLightC: "49 96% 58%",
    name: "Orange",
  },
};

export function ThemeProvider() {
  const [isDark, setIsDark] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<keyof typeof THEMES>("cyan");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("app-theme") || "cyan";
    const savedDarkMode = localStorage.getItem("dark-mode") !== "false";
    
    setCurrentTheme(savedTheme as keyof typeof THEMES);
    setIsDark(savedDarkMode);
    
    applyTheme(savedTheme as keyof typeof THEMES, savedDarkMode);
  }, []);

  const applyTheme = (theme: keyof typeof THEMES, darkMode: boolean) => {
    const root = document.documentElement;
    const themeVars = THEMES[theme];
    root.dataset.colorMode = darkMode ? "dark" : "light";
    
    if (darkMode) {
      root.style.setProperty("--background", themeVars.bg);
      root.style.setProperty("--foreground", "210 40% 98%");
      root.style.setProperty("--card", "222 47% 13%");
      root.style.setProperty("--card-foreground", "210 40% 98%");
      root.style.setProperty("--muted", "217 33% 17%");
      root.style.setProperty("--muted-foreground", "215 20% 65%");
      root.style.setProperty("--secondary", "217 33% 17%");
      root.style.setProperty("--secondary-foreground", "210 40% 98%");
      root.style.setProperty("--border", "217 33% 20%");
      root.style.setProperty("--input", "217 33% 20%");
      root.style.setProperty("--ring", themeVars.primary);
      root.style.setProperty("--aura-1", themeVars.auraDarkA);
      root.style.setProperty("--aura-2", themeVars.auraDarkB);
      root.style.setProperty("--aura-3", themeVars.auraDarkC);
      root.classList.add("dark");
    } else {
      root.style.setProperty("--background", "212 57% 98%");
      root.style.setProperty("--foreground", "220 39% 16%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "220 39% 16%");
      root.style.setProperty("--muted", "210 34% 94%");
      root.style.setProperty("--muted-foreground", "220 20% 41%");
      root.style.setProperty("--secondary", "210 43% 96%");
      root.style.setProperty("--secondary-foreground", "220 39% 16%");
      root.style.setProperty("--border", "214 28% 87%");
      root.style.setProperty("--input", "214 30% 92%");
      root.style.setProperty("--ring", themeVars.primary);
      root.style.setProperty("--aura-1", themeVars.auraLightA);
      root.style.setProperty("--aura-2", themeVars.auraLightB);
      root.style.setProperty("--aura-3", themeVars.auraLightC);
      root.classList.remove("dark");
    }
    
    root.style.setProperty("--primary", themeVars.primary);
    root.style.setProperty("--accent", themeVars.primary);
    
    localStorage.setItem("app-theme", theme);
    localStorage.setItem("dark-mode", String(darkMode));
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    applyTheme(currentTheme, newDarkMode);
  };

  const changeTheme = (theme: keyof typeof THEMES) => {
    setCurrentTheme(theme);
    applyTheme(theme, isDark);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-8 left-8 z-40 flex flex-col items-end gap-4">
      {/* Theme Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="flex flex-wrap gap-2 p-4 bg-card rounded-xl border border-border shadow-lg max-w-xs"
          >
            {Object.entries(THEMES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => changeTheme(key as keyof typeof THEMES)}
                className={`w-10 h-10 rounded-full transition-all hover:scale-110 ${
                  currentTheme === key
                    ? "ring-2 ring-offset-2 ring-offset-card ring-primary"
                    : ""
                }`}
                style={{
                  backgroundColor: `hsl(${value.primary})`,
                }}
                title={value.name}
                aria-label={value.name}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="p-3 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-all shadow-lg"
          aria-label="Toggle theme picker"
        >
          <Palette className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
