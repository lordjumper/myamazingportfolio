"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    if (menuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const navItems = [
    { name: "Home", href: "#home", icon: "mdi:home" },
    { name: "About", href: "#about", icon: "mdi:account" },
    {
      name: "Skills",
      href: "#skills",
      icon: "mdi:code-braces",
    },
    {
      name: "Projects",
      href: "#projects",
      icon: "mdi:folder-multiple",
    },
    { name: "Blog", href: "/blog", icon: "mdi:post" },
    { name: "Contact", href: "#contact", icon: "mdi:email" },
  ];

  const handleNavClick = useCallback((e: React.MouseEvent, href: string) => {
    if (href === "/blog") {
      return;
    }

    e.preventDefault();
    setMenuOpen(false);

    window.history.pushState(null, "", href);

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              <span className="text-xl font-bold text-white">Mina Zaky</span>
            </motion.div>

            {}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex items-center gap-2 text-white/70 hover:text-[#00ff88] transition-colors duration-300 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon icon={item.icon} className="text-lg" />
                  {item.name}
                </motion.a>
              ))}
            </div>

            {}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white text-2xl relative z-50"
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: menuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Icon icon={menuOpen ? "mdi:close" : "mdi:menu"} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {}
      <AnimatePresence>
        {menuOpen && (
          <>
            {}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-20 left-4 right-4 z-40 md:hidden bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                    }}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="flex items-center gap-3 w-full text-left py-4 px-4 text-white/70 hover:text-[#00ff88] hover:bg-white/5 rounded-xl transition-all duration-300 group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 group-hover:bg-[#00ff88]/20 transition-colors"
                    >
                      <Icon icon={item.icon} className="text-xl" />
                    </motion.div>
                    <span className="text-base font-medium">{item.name}</span>
                    <Icon
                      icon="mdi:chevron-right"
                      className="ml-auto text-white/30 group-hover:text-[#00ff88] transition-colors"
                    />
                  </motion.a>
                ))}
              </div>

              {}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-1 bg-linear-to-r from-[#00ff88]"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
