'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowUp, Github, Linkedin, Mail, Phone } from 'lucide-react';

const socialIcons = [
  { icon: Github, href: '#', color: '#ffffff', label: 'GitHub' },
  { icon: Linkedin, href: '#', color: '#0a66c2', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:adarshkumarsbrhs@gmail.com', color: '#00f0ff', label: 'Email' },
  { icon: Phone, href: 'tel:+919801742363', color: '#8b5cf6', label: 'Phone' },
];

const footerLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

function StarDot({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-white/10"
      style={{ left: x, top: y }}
      animate={{ opacity: [0.1, 0.4, 0.1] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    />
  );
}

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <footer className="relative mt-auto">
      {/* Gradient divider line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00f0ff]/40 via-50% via-[#8b5cf6]/40 to-transparent" />

      {/* Decorative dots/stars in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <StarDot x="5%" y="20%" delay={0} />
        <StarDot x="15%" y="60%" delay={1.2} />
        <StarDot x="30%" y="30%" delay={2.4} />
        <StarDot x="50%" y="70%" delay={0.8} />
        <StarDot x="70%" y="25%" delay={1.8} />
        <StarDot x="85%" y="55%" delay={0.4} />
        <StarDot x="95%" y="40%" delay={2} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright with pulse animation */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-slate-500 flex items-center gap-1.5"
          >
            &copy; {new Date().getFullYear()}{' '}
            <motion.span
              className="gradient-text font-semibold"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              Adarsh Kumar
            </motion.span>
            . Built with{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={14} className="inline text-red-500 mx-0.5" fill="currentColor" />
            </motion.span>{' '}
            and AI.
          </motion.p>

          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="footer-link text-sm text-slate-500 hover:text-[#00f0ff] transition-colors relative"
              >
                {link.label}
                <span className="footer-underline" />
              </a>
            ))}
          </div>

          {/* Animated social media icons */}
          <div className="flex items-center gap-3">
            {socialIcons.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                whileHover={{
                  scale: 1.25,
                  y: -3,
                }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/5 transition-colors hover:border-white/10"
              >
                <s.icon size={16} style={{ color: s.color }} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Back to Top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] hover:bg-[#00f0ff]/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
            aria-label="Back to top"
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowUp size={18} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer-link .footer-underline {
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, #00f0ff, #8b5cf6);
          transition: width 0.3s ease;
        }
        .footer-link:hover .footer-underline {
          width: 100%;
        }
      ` }} />
    </footer>
  );
}
