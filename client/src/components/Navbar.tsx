import { Link as ScrollLink } from "react-scroll";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SiGithub, SiLinkedin, SiMedium } from "react-icons/si";
import { ThemeControls } from "@/components/ThemeProvider";

const navItems = [
  { name: "Experience", to: "experience" },
  { name: "Projects", to: "projects" },
  { name: "Skills", to: "skills" },
  { name: "Writing", to: "blog" },
  { name: "Contact", to: "contact" },
];

const socialLinks = [
  { href: "https://github.com/Mehedi-Hasan-Abir", label: "GitHub", Icon: SiGithub },
  { href: "https://linkedin.com/in/mehedihasan102", label: "LinkedIn", Icon: SiLinkedin },
  { href: "https://medium.com/@mhabir102", label: "Medium", Icon: SiMedium },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen ? "bg-background/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      {/* Accent hairline under the bar once scrolled */}
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="max-w-6xl mx-auto px-5 md:px-8 h-[4.5rem] flex items-center justify-between gap-4">
        {/* Wordmark */}
        <ScrollLink
          {...{ href: "#hero" }}
          to="hero"
          smooth={true}
          duration={500}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
        >
          <span className="w-2.5 h-2.5 bg-primary rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]" aria-hidden="true" />
          <span className="font-extrabold tracking-tight text-lg" style={{ fontStretch: "110%" }}>
            Mehedi<span className="text-accent"> / </span>Hasan
          </span>
        </ScrollLink>

        {/* Floating pill nav (desktop) */}
        <div className="hidden lg:flex items-center gap-1 border border-border bg-card/60 backdrop-blur-sm rounded-full px-2 py-1.5">
          {navItems.map((item) => (
            <ScrollLink
              {...{ href: `#${item.to}` }}
              key={item.name}
              to={item.to}
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              className="nav-pill"
              activeClass="nav-pill-active"
            >
              {item.name}
            </ScrollLink>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5">
          <a
            href="mailto:abir.aust.102@gmail.com"
            className="hidden xl:inline-flex items-center gap-2 mono-label !text-[11px] text-accent border border-primary/40 bg-primary/10 rounded-full px-3.5 py-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            OPEN TO WORK
          </a>

          <div className="hidden md:flex items-center gap-0.5 border border-border rounded-full px-1.5 py-1">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
            <span className="w-px h-4 bg-border mx-1" aria-hidden="true" />
            <ThemeControls />
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden text-foreground p-2"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <ScrollLink
                  {...{ href: `#${item.to}` }}
                  key={item.name}
                  to={item.to}
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  className="text-muted-foreground hover:text-primary transition-colors block py-2.5 font-medium"
                  activeClass="text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </ScrollLink>
              ))}
              <div className="border-t border-border pt-3 mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {socialLinks.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="p-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
                <ThemeControls />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
