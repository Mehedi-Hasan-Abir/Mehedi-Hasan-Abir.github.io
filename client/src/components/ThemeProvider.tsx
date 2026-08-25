import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Editorial v3 theme system.
 * - Dark is the default identity; light is opt-in.
 * - Six accent palettes; each defines dark-surface and light-surface variants.
 * - Only --primary / --accent / --ring are runtime-overridden; all other
 *   tokens live in index.css.
 */

const ACCENTS = {
  blue: {
    name: "Klein Blue",
    dark: "231 100% 79%",
    light: "233 73% 48%",
  },
  cyan: {
    name: "Cyan",
    dark: "187 92% 69%",
    light: "192 80% 28%",
  },
  green: {
    name: "Emerald",
    dark: "142 69% 58%",
    light: "161 90% 26%",
  },
  orange: {
    name: "Amber",
    dark: "27 96% 61%",
    light: "21 90% 42%",
  },
  pink: {
    name: "Rose",
    dark: "330 85% 70%",
    light: "330 76% 42%",
  },
  purple: {
    name: "Violet",
    dark: "251 91% 76%",
    light: "262 83% 50%",
  },
} as const;

export type AccentKey = keyof typeof ACCENTS;

type ThemeContextValue = {
  isDark: boolean;
  currentTheme: AccentKey;
  toggleDark: () => void;
  changeTheme: (key: AccentKey) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: AccentKey, isDark: boolean) {
  const root = document.documentElement;
  const palette = ACCENTS[theme];
  root.dataset.colorMode = isDark ? "dark" : "light";
  root.style.setProperty("--primary", isDark ? palette.dark : palette.light);
  root.style.setProperty("--accent", isDark ? palette.dark : palette.light);
  root.style.setProperty("--ring", isDark ? palette.dark : palette.light);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<AccentKey>("pink");

  useEffect(() => {
    // Dark is default; light only when explicitly saved.
    const savedDark = localStorage.getItem("dark-mode") !== "false";
    const savedTheme = (localStorage.getItem("app-theme") as AccentKey) || "pink";
    setCurrentTheme(savedTheme in ACCENTS ? savedTheme : "pink");
    setIsDark(savedDark);
    applyTheme(savedTheme in ACCENTS ? savedTheme : "pink", savedDark);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("dark-mode", String(next));
    applyTheme(currentTheme, next);
  };

  const changeTheme = (key: AccentKey) => {
    setCurrentTheme(key);
    localStorage.setItem("app-theme", key);
    applyTheme(key, isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, currentTheme, toggleDark, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/** Compact control cluster: mode toggle + accent picker. */
export function ThemeControls() {
  const { isDark, currentTheme, toggleDark, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-1">
      {/* Mobile: fixed bottom sheet; Desktop: anchored popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[65] bg-background/50 backdrop-blur-[2px] md:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              role="group"
              aria-label="Accent color"
              className="fixed bottom-24 left-0 right-0 z-[70] mx-auto w-fit flex gap-3 p-5 bg-card rounded-2xl border border-border shadow-2xl md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-2 md:w-auto md:gap-2 md:p-3 md:rounded-lg md:shadow-xl"
            >
              {(Object.keys(ACCENTS) as AccentKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => { changeTheme(key); setIsOpen(false); }}
                  className={`w-9 h-9 md:w-7 md:h-7 rounded-full transition-transform hover:scale-110 active:scale-95 ${
                    currentTheme === key ? "ring-2 ring-offset-2 ring-offset-card ring-primary" : ""
                  }`}
                  style={{ backgroundColor: `hsl(${isDark ? ACCENTS[key].dark : ACCENTS[key].light})` }}
                  title={ACCENTS[key].name}
                  aria-label={ACCENTS[key].name}
                  aria-pressed={currentTheme === key}
                />
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggleDark}
        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={isDark}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Choose accent color"
        aria-expanded={isOpen}
        aria-controls="accent-picker"
      >
        <Palette className="w-4 h-4" />
      </button>
    </div>
  );
}
