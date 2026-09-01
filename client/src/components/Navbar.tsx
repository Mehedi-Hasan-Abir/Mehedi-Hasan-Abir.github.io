import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { SiGithub, SiLinkedin, SiMedium } from "react-icons/si";
import { ThemeControls } from "@/components/ThemeProvider";
import { scrollToSection, activeSection } from "@/lib/scroll-to";

const navItems = [
  { name: "Experience", to: "experience" },
  { name: "Projects", to: "projects" },
  { name: "Skills", to: "skills" },
  { name: "Writing", to: "blog" },
  { name: "Contact", to: "contact" },
];

const navIds = navItems.map((item) => item.to);

const socialLinks = [
  { href: "https://github.com/Mehedi-Hasan-Abir", label: "GitHub", Icon: SiGithub },
  { href: "https://linkedin.com/in/mehedihasan102", label: "LinkedIn", Icon: SiLinkedin },
  { href: "https://medium.com/@mhabir102", label: "Medium", Icon: SiMedium },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  /**
   * Active section, measured ourselves rather than via react-scroll's `spy`.
   * `spy` marked the first registered link active at scrollTop 0, so "Experience"
   * lit up while the hero was still filling the viewport. `activeSection` returns
   * null when nothing is under the navbar, which is the correct hero state.
   */
  const [active, setActive] = useState<string | null>(null);

  // Reading-progress: reuse the existing accent hairline as the track.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  useEffect(() => {
    let queued = false;

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      // getBoundingClientRect per section is a layout read; batch it to one
      // rAF per frame so a fast scroll cannot thrash.
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        setActive(activeSection(navIds));
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Sections change height on resize (and as cv-auto content materialises).
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen ? "bg-background/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      {/* Accent hairline under the bar once scrolled, doubling as a
          reading-progress rail (scaleX is compositor-only). */}
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 right-0 h-px overflow-hidden transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      >
        <motion.span
          className="block h-full origin-left bg-gradient-to-r from-primary/40 via-primary to-primary/40"
          style={{ scaleX: progress }}
        />
      </span>

      <div className="max-w-6xl mx-auto px-5 md:px-8 h-[4.5rem] flex items-center justify-between gap-4">
        {/* Wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
        >
          <span className="w-2.5 h-2.5 bg-primary rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]" aria-hidden="true" />
          <span className="font-extrabold tracking-tight text-lg" style={{ fontStretch: "110%" }}>
            Mehedi<span className="text-accent"> / </span>Hasan
          </span>
        </a>

        {/* Floating pill nav (desktop) */}
        <div className="hidden lg:flex items-center gap-1 border border-border bg-card/60 backdrop-blur-sm rounded-full px-2 py-1.5">
          {navItems.map((item) => {
            const isActive = active === item.to;
            return (
              <a
                key={item.name}
                href={`#${item.to}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.to);
                }}
                aria-current={isActive ? "true" : undefined}
                className={`nav-pill ${isActive ? "nav-pill-on" : ""}`}
              >
                {/* Shared layoutId: framer-motion glides this single pill from
                    the old item to the new one instead of cross-fading two. */}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.6 }}
                  />
                )}
                {/* Dual label: the second copy sits one line below and both
                    slide up together on hover, wiping to the accent colour. */}
                <span className="nav-pill-labels">
                  <span className="nav-pill-label">{item.name}</span>
                  <span className="nav-pill-label nav-pill-label-alt" aria-hidden="true">
                    {item.name}
                  </span>
                </span>
              </a>
            );
          })}
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

          {/* Compact theme controls always visible on mobile */}
          <div className="md:hidden">
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
                <a
                  key={item.name}
                  href={`#${item.to}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    // Let the menu's collapse commit first: it shrinks the page,
                    // so measuring before it closes aims at a stale layout.
                    requestAnimationFrame(() => scrollToSection(item.to));
                  }}
                  aria-current={active === item.to ? "true" : undefined}
                  className={`block py-2.5 font-medium transition-colors ${
                    active === item.to ? "text-foreground" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </a>
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
