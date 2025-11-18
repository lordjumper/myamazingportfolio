"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useEffect, useState, useRef } from "react";

const About = () => {
  const shouldReduceMotion = useReducedMotion();
  const hasAnimated = useRef(false);
  const [counters, setCounters] = useState({
    experience: 0,
    projects: 0,
    clients: 0,
    coffee: 0,
  });

  const targets = {
    experience: 3,
    projects: 5,
    clients: 2,
    coffee: 999,
  };

  useEffect(() => {
    if (shouldReduceMotion || hasAnimated.current) {
      setCounters(targets);
      return;
    }

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounters((prev) => {
        const newCounters = { ...prev };
        let allComplete = true;

        Object.keys(targets).forEach((key) => {
          const target = targets[key as keyof typeof targets];
          const current = prev[key as keyof typeof prev];
          if (current < target) {
            allComplete = false;
            const increment = Math.ceil(target / steps);
            newCounters[key as keyof typeof newCounters] = Math.min(
              current + increment,
              target,
            );
          }
        });

        if (allComplete) {
          clearInterval(timer);
          hasAnimated.current = true;
        }

        return newCounters;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  const stats = [
    {
      icon: "mdi:briefcase",
      count: counters.experience,
      suffix: "+",
      label: "Years Experience",
      color: "#00ff88",
    },
    {
      icon: "mdi:rocket-launch",
      count: counters.projects,
      suffix: "+",
      label: "Projects Completed",
      color: "#0088ff",
    },
    {
      icon: "mdi:account-group",
      count: counters.clients,
      suffix: "+",
      label: "Happy Clients",
      color: "#ff0088",
    },
    {
      icon: "mdi:coffee",
      count: counters.coffee,
      suffix: "+",
      label: "Cups of Coffee",
      color: "#ffaa00",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
      },
    },
  };

  return (
    <section id="about" className="py-32 bg-black relative overflow-hidden">
      {}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00ff88] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0088ff] opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-[#00ff88] mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                Turning Ideas Into{" "}
                <span className="text-[#00ff88]">Reality</span>
              </h3>
              <p className="text-lg text-white/70 leading-relaxed">
                I'm not sure what people write here so imagine I said something
                cool and inspiring.
              </p>
              <p className="text-lg text-white/70 leading-relaxed">
                When I'm not coding, you can find me exploring random interests
                and hobbies, or im usually enjoying a video game because who
                doesn't like to play games?
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-[#00ff88] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#00cc6f] transition-colors duration-300"
                >
                  <Icon icon="mdi:download" className="text-xl" />
                  Download CV
                </motion.button>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white/5 border-2 border-white/20 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300"
                >
                  <Icon icon="mdi:phone" className="text-xl" />
                  Let's Talk
                </motion.a>
              </div>
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#ff0088]" />
                <div className="w-3 h-3 rounded-full bg-[#ffaa00]" />
                <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
              </div>
              <div className="space-y-3 font-mono text-sm">
                <div className="text-white/50">
                  <span className="text-[#ff0088]">const</span>{" "}
                  <span className="text-[#00ff88]">developer</span>{" "}
                  <span className="text-white/70">=</span>{" "}
                  <span className="text-white/70">{"{"}</span>
                </div>
                <div className="pl-6 text-white/50">
                  <span className="text-[#0088ff]">name:</span>{" "}
                  <span className="text-[#ffaa00]">'Mina Zaky'</span>,
                </div>
                <div className="pl-6 text-white/50">
                  <span className="text-[#0088ff]">role:</span>{" "}
                  <span className="text-[#ffaa00]">'Full Stack Developer'</span>
                  ,
                </div>
                <div className="pl-6 text-white/50">
                  <span className="text-[#0088ff]">location:</span>{" "}
                  <span className="text-[#ffaa00]">'USA'</span>,
                </div>
                <div className="pl-6 text-white/50">
                  <span className="text-[#0088ff]">skills:</span>{" "}
                  <span className="text-white/70">[</span>
                </div>
                <div className="pl-12 text-white/50">
                  <span className="text-[#ffaa00]">'Node.js'</span>,{" "}
                  <span className="text-[#ffaa00]">'Next.js'</span>,
                </div>
                <div className="pl-12 text-white/50">
                  <span className="text-[#ffaa00]">'TypeScript'</span>,{" "}
                  <span className="text-[#ffaa00]">'C#'</span>
                </div>
                <div className="pl-6 text-white/70">],</div>
                <div className="pl-6 text-white/50">
                  <span className="text-[#0088ff]">passionate:</span>{" "}
                  <span className="text-[#00ff88]">true</span>
                </div>
                <div className="text-white/70">{"};"}</div>
              </div>

              {}
              <motion.div
                animate={shouldReduceMotion ? {} : { opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block w-2 h-5 bg-[#00ff88] ml-1"
              />
            </div>
          </motion.div>
        </div>

        {}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -5 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300"
            >
              <Icon
                icon={stat.icon}
                className="text-5xl mx-auto mb-4"
                style={{ color: stat.color }}
              />
              <div className="text-4xl font-bold text-white mb-2">
                {stat.count}
                {stat.suffix}
              </div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
