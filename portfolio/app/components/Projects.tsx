"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState, useMemo, memo } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  icon: string;
  color: string;
  link: string;
  github: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  shouldReduceMotion: boolean | null;
}

const ProjectCard = memo(
  ({ project, index, shouldReduceMotion }: ProjectCardProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              y: -8,
              transition: { duration: 0.2, ease: "easeOut" },
            }
      }
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300 group will-change-transform"
    >
      {}
      <div className="p-8 pb-6">
        <motion.div
          whileHover={
            shouldReduceMotion
              ? {}
              : {
                  scale: 1.1,
                  transition: { duration: 0.2 },
                }
          }
          className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
          style={{ backgroundColor: `${project.color}20` }}
        >
          <Icon
            icon={project.icon}
            className="text-3xl"
            style={{ color: project.color }}
          />
        </motion.div>

        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00ff88] transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-white/60 mb-6 leading-relaxed">
          {project.description}
        </p>

        {}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((tech: string, techIndex: number) => (
            <span
              key={techIndex}
              className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {}
      <div className="px-8 pb-8 flex gap-4">
        <motion.a
          href={project.link}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex items-center justify-center gap-2 bg-[#00ff88] text-black px-4 py-3 rounded-xl font-semibold hover:bg-[#00cc6f] transition-colors duration-300"
        >
          <Icon icon="mdi:open-in-new" className="text-lg" />
          View Live
        </motion.a>
        <motion.a
          href={project.github}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center bg-white/5 border border-white/20 text-white px-4 py-3 rounded-xl hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon icon="mdi:github" className="text-2xl" />
          </motion.div>
        </motion.a>
      </div>
    </motion.div>
  ),
);

ProjectCard.displayName = "ProjectCard";

const Projects = () => {
  const [filter, setFilter] = useState("all");
  const shouldReduceMotion = useReducedMotion();

  const projects = useMemo(
    () => [
      {
        id: 1,
        title: "Portfolio Website",
        description:
          "A sleek and modern portfolio website with smooth animations and responsive design.",
        category: "frontend",
        technologies: ["Next.js", "Framer Motion", "Tailwind"],
        icon: "mdi:web",
        color: "#ffaa00",
        link: "#",
        github: "#",
      },
      {
        id: 2,
        title: "Discord Bot",
        description:
          "A multi-purpose Discord bot with features like moderation, music, and fun commands.",
        category: "fullstack",
        technologies: ["Discord.js", "TypeScript", "Drizzle"],
        icon: "mdi:robot",
        color: "#0088ff",
        link: "#",
        github: "#",
      },
      {
        id: 3,
        title: "Anime WatchList",
        description:
          "Anime list with features like adding, removing, and searching.",
        category: "fullstack",
        technologies: ["HTML", "Tailwind CSS", "Javascript", "JSON"],
        icon: "mdi:brain",
        color: "#ff0088",
        link: "#",
        github: "#",
      },
      {
        id: 4,
        title: "Acheron",
        description: "A LightweightGame Development Framework & ECS system",
        category: "backend",
        technologies: ["C#", "OpenGL"],
        icon: "mdi:hammer-screwdriver",
        color: "#00ff88",
        link: "#",
        github: "#",
      },
      {
        id: 5,
        title: "Analytics Dashboard",
        description:
          "Real-time analytics dashboard with interactive charts and data visualization.",
        category: "frontend",
        technologies: ["React", "D3.js", "TypeScript", "WebSocket"],
        icon: "mdi:chart-line",
        color: "#0088ff",
        link: "#",
        github: "#",
      },
    ],
    [],
  );

  const filters = [
    { id: "all", label: "All Projects", icon: "mdi:apps" },
    { id: "frontend", label: "Frontend", icon: "mdi:application-brackets" },
    { id: "backend", label: "Backend", icon: "mdi:server" },
    { id: "fullstack", label: "Full Stack", icon: "mdi:layers-triple" },
  ];

  const filteredProjects = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((project) => project.category === filter),
    [filter, projects],
  );

  return (
    <section id="projects" className="py-32 bg-black relative overflow-hidden">
      {}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-1/3 w-96 h-96 bg-[#00ff88] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#ff0088] rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Featured Projects
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="h-1 bg-[#00ff88] mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-white/60 max-w-2xl mx-auto"
          >
            A selection of my recent work showcasing my skills and passion for
            creating exceptional digital experiences
          </motion.p>
        </motion.div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {filters.map((filterItem, idx) => (
            <motion.button
              key={filterItem.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: 0.2 + idx * 0.05,
              }}
              whileHover={{
                scale: 1.05,
                y: -2,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filterItem.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                filter === filterItem.id
                  ? "bg-[#00ff88] text-black"
                  : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon icon={filterItem.icon} className="text-xl" />
              {filterItem.label}
            </motion.button>
          ))}
        </motion.div>

        {}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="sync">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={`${filter}-${project.id}`}
                project={project}
                index={index}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </AnimatePresence>
        </div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-16"
        >
          <motion.a
            href="#"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 40px rgba(0, 255, 136, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-white/5 border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300"
          >
            <Icon icon="mdi:github" className="text-xl" />
            View More on GitHub
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
