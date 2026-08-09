'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';

export default function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="education" className="relative py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#f43f5e] font-mono text-sm tracking-widest uppercase">Academic Background</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
            <span className="gradient-text">Education</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#f43f5e] to-transparent mx-auto mt-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl overflow-hidden neon-border"
        >
          <div className="h-1 bg-gradient-to-r from-[#f43f5e] via-[#8b5cf6] to-[#00f0ff]" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f43f5e]/20 to-[#8b5cf6]/20 border border-[#f43f5e]/20 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={32} className="text-[#f43f5e]" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">Bachelor of Technology</h3>
                <p className="text-lg text-[#8b5cf6] font-medium mb-4">Computer Engineering</p>
                <p className="text-slate-300 leading-relaxed mb-4">
                  RK University, Rajkot, Gujarat
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> Aug 2022 – May 2026
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> Rajkot, Gujarat
                  </span>
                </div>
              </div>
            </div>

            {/* Leadership highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 p-5 rounded-xl bg-white/[0.02] border border-white/5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Award size={18} className="text-[#f59e0b]" />
                <span className="text-sm font-semibold text-[#f59e0b]">Leadership & Community</span>
              </div>
              <h4 className="text-white font-medium mb-2">
                Treasurer – NEURON (AI & ML Club)
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Led technical workshops on production-ready backend systems, API development, and database architecture for 100+ students. Conducted hands-on sessions on REST API design, authentication strategies, microservices patterns, and deployment best practices.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
