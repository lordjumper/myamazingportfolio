"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState, useEffect, useMemo } from "react";

const Hero = () => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const shouldReduceMotion = useReducedMotion();

  const roles = useMemo(
    () => ["Full Stack Developer", "Problem Solver", "Gamer"],
    [],
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      setText(roles[0]);
      return;
    }

    const handleTyping = () => {
      const currentRole = roles[loopNum % roles.length];
      const updatedText = isDeleting
        ? currentRole.substring(0, text.length - 1)
        : currentRole.substring(0, text.length + 1);

      setText(updatedText);

      if (!isDeleting && updatedText === currentRole) {
        setTimeout(() => setIsDeleting(true), 2000);
        setTypingSpeed(100);
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(150);
      } else {
        setTypingSpeed(isDeleting ? 50 : 150);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, roles, shouldReduceMotion]);

  const socialLinks = [
    { icon: "mdi:github", href: "#", color: "#ffffff" },
    { icon: "mdi:linkedin", href: "#", color: "#0088ff" },
    { icon: "mdi:twitter", href: "#", color: "#0088ff" },
    { icon: "mdi:email", href: "#contact", color: "#00ff88" },
  ];

  const scrollToProjects = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 left-20 w-72 h-72 bg-[#00ff88] opacity-10 rounded-full blur-3xl will-change-transform"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-[#0088ff] opacity-10 rounded-full blur-3xl will-change-transform"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#ff0088] opacity-10 rounded-full blur-3xl will-change-transform"
          />
        </div>
      )}

      {}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-6 py-3 mb-8"
          >
            <Icon icon="mdi:hand-wave" className="text-2xl text-[#ffaa00]" />
            <span className="text-white/70">Hello, I'm</span>
          </motion.div>

          {}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6"
          >
            Mina Zaky
          </motion.h1>

          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-20 md:h-24 flex items-center justify-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#00ff88] min-h-[1.2em]">
              {text}
              <span className="animate-pulse">|</span>
            </h2>
          </motion.div>

          {}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12"
          >
            Making cool stuff.
          </motion.p>

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToProjects}
              className="flex items-center gap-2 bg-[#00ff88] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#00cc6f] transition-colors duration-300"
            >
              <Icon icon="mdi:folder-eye" className="text-xl" />
              View My Work
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="flex items-center gap-2 bg-white/5 border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300"
            >
              <Icon icon="mdi:chat" className="text-xl" />
              Get In Touch
            </motion.a>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex items-center justify-center gap-6"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="text-white/50 hover:text-[#00ff88] transition-colors duration-300"
              >
                <Icon icon={social.icon} className="text-3xl" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/40 cursor-pointer"
          onClick={() =>
            document
              .querySelector("#about")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <Icon icon="mdi:chevron-down" className="text-4xl" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
