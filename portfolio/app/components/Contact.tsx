"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useState } from "react";

const EMAILJS_CONFIG = {
  PUBLIC_KEY: "IlLJ2IfZSJrwc_xNs",
  SERVICE_ID: "service_vz56ikd",
  TEMPLATE_ID: "template_u1eyosu",
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      
      const emailjs = await import("@emailjs/browser");

      emailjs.default.init(EMAILJS_CONFIG.PUBLIC_KEY);

      const response = await emailjs.default.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: "lordjumperdev@gmail.com", 
        },
      );

      console.log("Email sent successfully:", response);
      setStatus("sent");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Failed to send email:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const contactInfo = [
    {
      icon: "mdi:email",
      title: "Email",
      value: "lordjumperdev@gmail.com",
      link: "mailto:lordjumperdev@gmail.com",
      color: "#00ff88",
    },
    {
      icon: "mdi:discord",
      title: "Discord",
      value: "lordjumper",
      link: "https://discord.com/users/lordjumper",
      color: "#ffaa00",
    },
  ];

  const socialLinks = [
    { icon: "mdi:github", href: "#", label: "GitHub", color: "#ffffff" },
    { icon: "mdi:linkedin", href: "#", label: "LinkedIn", color: "#0088ff" },
    { icon: "mdi:twitter", href: "#", label: "Twitter", color: "#0088ff" },
    { icon: "mdi:instagram", href: "#", label: "Instagram", color: "#ff0088" },
  ];

  return (
    <section id="contact" className="py-32 bg-black relative overflow-hidden">
      {}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88] opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0088ff] opacity-5 rounded-full blur-3xl" />
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
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-[#00ff88] mx-auto mb-6" />
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Have a project in mind or just want to chat? Feel free to reach out.
            I&apos;m always open to discussing new opportunities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Icon icon="mdi:send" className="text-[#00ff88] text-3xl" />
                Send Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-white/70 mb-2 text-sm font-medium"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00ff88] transition-colors duration-300"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-white/70 mb-2 text-sm font-medium"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00ff88] transition-colors duration-300"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-white/70 mb-2 text-sm font-medium"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00ff88] transition-colors duration-300"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-white/70 mb-2 text-sm font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00ff88] transition-colors duration-300 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileHover={{ scale: status === "sending" ? 1 : 1.02 }}
                  whileTap={{ scale: status === "sending" ? 1 : 0.98 }}
                  className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    status === "sent"
                      ? "bg-[#00ff88] text-black"
                      : status === "error"
                        ? "bg-[#ff0088] text-white"
                        : status === "sending"
                          ? "bg-white/20 text-white/50 cursor-not-allowed"
                          : "bg-[#00ff88] text-black hover:bg-[#00cc6f]"
                  }`}
                >
                  {status === "sending" && (
                    <Icon icon="mdi:loading" className="text-xl animate-spin" />
                  )}
                  {status === "sent" && (
                    <Icon icon="mdi:check-circle" className="text-xl" />
                  )}
                  {status === "error" && (
                    <Icon icon="mdi:alert-circle" className="text-xl" />
                  )}
                  {status === "idle" && (
                    <Icon icon="mdi:send" className="text-xl" />
                  )}
                  {status === "sending"
                    ? "Sending..."
                    : status === "sent"
                      ? "Message Sent!"
                      : status === "error"
                        ? "Failed to Send"
                        : "Send Message"}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Icon
                  icon="mdi:information"
                  className="text-[#0088ff] text-3xl"
                />
                Contact Information
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.link}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300 group"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${info.color}20` }}
                    >
                      <Icon
                        icon={info.icon}
                        className="text-2xl"
                        style={{ color: info.color }}
                      />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">{info.title}</p>
                      <p className="text-white font-medium group-hover:text-[#00ff88] transition-colors duration-300">
                        {info.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-6">Follow Me</h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300 group"
                  >
                    <Icon
                      icon={social.icon}
                      className="text-2xl text-white/70 group-hover:text-[#00ff88] transition-colors duration-300"
                    />
                    <span className="text-white/70 font-medium group-hover:text-[#00ff88] transition-colors duration-300">
                      {social.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm text-center"
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="w-3 h-3 bg-[#00ff88] rounded-full"
                />
                <span className="text-white font-semibold">
                  Available for Opportunities
                </span>
              </div>
              <p className="text-white/60 text-sm">
                Open to freelance projects and full-time positions
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
