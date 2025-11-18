'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    navigation: [
      { name: 'Home', href: '#home' },
      { name: 'About', href: '#about' },
      { name: 'Skills', href: '#skills' },
      { name: 'Projects', href: '#projects' },
      { name: 'Contact', href: '#contact' },
    ],
    social: [
      { icon: 'mdi:github', href: '#', label: 'GitHub' },
      { icon: 'mdi:linkedin', href: '#', label: 'LinkedIn' },
      { icon: 'mdi:twitter', href: '#', label: 'Twitter' },
      { icon: 'mdi:instagram', href: '#', label: 'Instagram' },
    ],
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-white/10 relative overflow-hidden">
      {}
      <div className="absolute inset-0 overflow-hidden opacity-50">
        <div className="absolute -bottom-32 left-1/4 w-64 h-64 bg-[#00ff88] opacity-5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-64 h-64 bg-[#0088ff] opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon icon="mdi:code-tags" className="text-[#00ff88] text-3xl" />
              <span className="text-xl font-bold text-white">DevPortfolio</span>
            </div>
            <p className="text-white/60 mb-4">
              Crafting exceptional digital experiences with clean code and creative
              solutions.
            </p>
            <div className="flex items-center gap-2 text-white/60">
              <Icon icon="mdi:email" className="text-lg text-[#00ff88]" />
              <a
                href="mailto:your.email@example.com"
                className="hover:text-[#00ff88] transition-colors duration-300"
              >
                your.email@example.com
              </a>
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-[#00ff88] transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <Icon
                      icon="mdi:chevron-right"
                      className="text-[#00ff88] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-white font-bold text-lg mb-4">Connect With Me</h3>
            <div className="flex flex-wrap gap-4">
              {footerLinks.social.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-[#00ff88] hover:bg-white/10 hover:border-[#00ff88] transition-all duration-300"
                  aria-label={social.label}
                >
                  <Icon icon={social.icon} className="text-2xl" />
                </motion.a>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-white/60 text-sm mb-3">Stay updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#00ff88] transition-colors duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#00ff88] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#00cc6f] transition-colors duration-300"
                >
                  <Icon icon="mdi:send" className="text-xl" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-white/60 text-sm text-center md:text-left">
            © {currentYear} DevPortfolio. All rights reserved. Built with{' '}
            <span className="text-[#ff0088]">❤</span> using Next.js & Tailwind CSS
          </p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-[#00ff88] text-black rounded-lg flex items-center justify-center hover:bg-[#00cc6f] transition-colors duration-300"
            aria-label="Scroll to top"
          >
            <Icon icon="mdi:chevron-up" className="text-2xl" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
