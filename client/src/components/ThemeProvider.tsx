import { useState, useEffect } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const THEMES = {
  cyan: { bg: "222 47% 11%", primary: "199 89% 48%", name: "Cyan" },
  blue: { bg: "222 47% 11%", primary: "217 100% 50%", name: "Blue" },
  purple: { bg: "222 47% 11%", primary: "280 85% 55%", name: "Purple" },
  pink: { bg: "222 47% 11%", primary: "330 81% 60%", name: "Pink" },
  green: { bg: "222 47% 11%", primary: "142 72% 29%", name: "Green" },
  orange: { bg: "222 47% 11%", primary: "35 100% 55%", name: "Orange" },
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
      root.classList.add("dark");
    } else {
      // Light mode background
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222 47% 11%");
      root.style.setProperty("--card", "0 0% 98%");
      root.style.setProperty("--card-foreground", "222 47% 11%");
      root.style.setProperty("--muted", "0 0% 90%");
      root.style.setProperty("--muted-foreground", "222 47% 50%");
      root.style.setProperty("--secondary", "0 0% 93%");
      root.style.setProperty("--secondary-foreground", "222 47% 11%");
      root.style.setProperty("--border", "0 0% 90%");
      root.style.setProperty("--input", "0 0% 95%");
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
