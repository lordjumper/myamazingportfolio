"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useMemo } from "react";
import Image from "next/image";

const Skills = () => {
  const shouldReduceMotion = useReducedMotion();

  const skillCategories = useMemo(
    () => [
      {
        title: "Frontend",
        color: "#00ff88",
        skills: [
          { name: "Next.js", icon: "mdi:nextjs", level: 90 },
          { name: "TypeScript", icon: "mdi:language-typescript", level: 90 },
          { name: "Tailwind CSS", icon: "mdi:tailwind", level: 95 },
          { name: "JavaScript", icon: "mdi:language-javascript", level: 95 },
          { name: "HTML5", icon: "mdi:language-html5", level: 100 },
        ],
      },
      {
        title: "Backend",
        color: "#0088ff",
        skills: [
          { name: "Node.js", icon: "mdi:nodejs", level: 90 },
          { name: "C#", icon: "mdi:language-python", level: 75 },
          { name: "C++", icon: "mdi:database", level: 60 },
          { name: "Drizzle", icon: "mdi:database-outline", level: 80 },
        ],
      },
      {
        title: "Tools & Others",
        color: "#ff0088",
        skills: [
          { name: "Git", icon: "mdi:git", level: 95 },
          { name: "AWS", icon: "mdi:aws", level: 80 },
          { name: "Figma", icon: "logos:figma", level: 85 },
          {
            name: "VS Code",
            icon: "mdi:microsoft-visual-studio-code",
            level: 100,
          },
          {
            name: "Zed",
            icon: "zed",
            level: 90,
          },
        ],
      },
    ],
    [],
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.3,
      },
    },
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
      },
    },
  };

  return (
    <section id="skills" className="py-32 bg-black relative overflow-hidden">
      {}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#ff0088] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#0088ff] opacity-5 rounded-full blur-3xl" />
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
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-[#00ff88] mx-auto mb-6" />
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            A comprehensive toolkit of modern technologies and frameworks I use
            to build exceptional digital experiences
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              variants={categoryVariants}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 will-change-transform"
            >
              {}
              <div className="mb-8">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <Icon
                    icon="mdi:code-braces"
                    className="text-2xl"
                    style={{ color: category.color }}
                  />
                </div>
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: category.color }}
                >
                  {category.title}
                </h3>
                <div
                  className="w-12 h-1 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>

              {}
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: categoryIndex * 0.2 + skillIndex * 0.1,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {skill.icon === "zed" ? (
                          <div className="w-5 h-5 flex items-center justify-center">
                            <Image
                              src="/zed.svg"
                              alt="Zed"
                              width={20}
                              height={20}
                              style={{
                                filter:
                                  "brightness(0) saturate(100%) invert(27%) sepia(89%) saturate(7471%) hue-rotate(318deg) brightness(100%) contrast(107%)",
                              }}
                            />
                          </div>
                        ) : (
                          <Icon
                            icon={skill.icon}
                            className="text-xl"
                            style={{
                              color: category.color,
                              filter:
                                skill.icon === "logos:figma"
                                  ? "brightness(0) saturate(100%) invert(27%) sepia(89%) saturate(7471%) hue-rotate(318deg) brightness(100%) contrast(107%)"
                                  : "none",
                            }}
                          />
                        )}
                        <span className="text-white font-medium">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-white/60 text-sm">
                        {skill.level}%
                      </span>
                    </div>

                    {}
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 1,
                          delay: shouldReduceMotion
                            ? 0
                            : categoryIndex * 0.2 + skillIndex * 0.1,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full will-change-transform"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-6 py-3">
            <Icon icon="mdi:lightbulb-on" className="text-[#ffaa00] text-xl" />
            <span className="text-white/70">
              Always learning and exploring new technologies
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
