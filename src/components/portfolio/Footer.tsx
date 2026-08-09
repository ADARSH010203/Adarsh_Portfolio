'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-slate-500"
          >
            &copy; {new Date().getFullYear()} Adarsh Kumar. Built with{' '}
            <Heart size={14} className="inline text-red-500 mx-0.5" /> and AI.
          </motion.p>
          <div className="flex items-center gap-6">
            <a href="#home" className="text-sm text-slate-500 hover:text-[#00f0ff] transition-colors">
              Home
            </a>
            <a href="#about" className="text-sm text-slate-500 hover:text-[#00f0ff] transition-colors">
              About
            </a>
            <a href="#projects" className="text-sm text-slate-500 hover:text-[#00f0ff] transition-colors">
              Projects
            </a>
            <a href="#contact" className="text-sm text-slate-500 hover:text-[#00f0ff] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
