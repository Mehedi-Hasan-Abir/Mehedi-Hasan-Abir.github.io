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
        scrolled || isOpen
          ? "bg-background/85 backdrop-blur-md rule-b h-16"
          : "bg-transparent h-[4.5rem]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-full flex items-center justify-between gap-4">
        {/* Wordmark */}
        <ScrollLink
          {...{ href: "#hero" }}
          to="hero"
          smooth={true}
          duration={500}
          className="font-extrabold tracking-tight text-lg shrink-0 cursor-pointer"
          style={{ fontStretch: "110%" }}
        >
          Mehedi<span className="text-accent"> / </span>Hasan
        </ScrollLink>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <ScrollLink
              {...{ href: `#${item.to}` }}
              key={item.name}
              to={item.to}
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              className="nav-link"
              activeClass="active"
            >
              {item.name}
            </ScrollLink>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-1">
          <div className="hidden md:flex items-center gap-0.5 mr-1">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
            <span className="w-px h-5 bg-border mx-2" aria-hidden="true" />
          </div>

          <div className="hidden md:block">
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
            className="lg:hidden bg-background rule-b overflow-hidden"
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
              <div className="rule-t pt-3 mt-2 flex items-center justify-between">
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
                      <Icon className="w-4.5 h-4.5" />
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
