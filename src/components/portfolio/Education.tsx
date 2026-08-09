'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award, Sparkles } from 'lucide-react';

function FloatingShape({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: number; color: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [-10, 10, -10],
        rotate: [0, 180, 360],
        opacity: [0.15, 0.3, 0.15],
      }}
      transition={{
        duration: 10 + delay * 2,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      aria-hidden="true"
    >
      <div
        className="w-full h-full rounded-sm"
        style={{
          border: `1px solid ${color}33`,
          background: `${color}08`,
        }}
      />
    </motion.div>
  );
}

export default function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate completion percentage
  const startDate = new Date(2022, 7); // Aug 2022
  const endDate = new Date(2026, 4);   // May 2026
  const now = new Date();
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  const completionPct = Math.min(Math.round((elapsed / totalDuration) * 100), 100);

  return (
    <section id="education" className="relative py-24 sm:py-32">
      {/* Floating geometric shapes */}
      <FloatingShape delay={0} x="5%" y="20%" size={20} color="#f43f5e" />
      <FloatingShape delay={1.5} x="90%" y="15%" size={14} color="#8b5cf6" />
      <FloatingShape delay={3} x="8%" y="70%" size={18} color="#00f0ff" />
      <FloatingShape delay={2} x="92%" y="75%" size={12} color="#f59e0b" />
      <FloatingShape delay={4} x="15%" y="45%" size={10} color="#10b981" />
      <FloatingShape delay={1} x="85%" y="50%" size={16} color="#f43f5e" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
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
              {/* Animated graduation cap */}
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f43f5e]/20 to-[#8b5cf6]/20 border border-[#f43f5e]/20 flex items-center justify-center flex-shrink-0 relative"
                animate={{
                  y: [0, -6, 0],
                  rotateZ: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <GraduationCap size={32} className="text-[#f43f5e]" />
                {/* Sparkle particles around cap */}
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#f59e0b]"
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-[#00f0ff]"
                  animate={{ opacity: [0, 1, 0], scale: [0.3, 1, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                />
              </motion.div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">Bachelor of Technology</h3>
                {/* University name with glow */}
                <motion.p
                  className="text-lg font-medium mb-4 edu-glow-text"
                  style={{ color: '#8b5cf6' }}
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(139, 92, 246, 0.3)',
                      '0 0 25px rgba(139, 92, 246, 0.6), 0 0 50px rgba(139, 92, 246, 0.2)',
                      '0 0 10px rgba(139, 92, 246, 0.3)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Computer Engineering
                </motion.p>
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

            {/* Animated progress bar showing completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-500">Program Progress</span>
                <motion.span
                  className="text-xs font-mono font-bold tabular-nums"
                  style={{ color: '#10b981' }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 1.5 }}
                >
                  {completionPct}%
                </motion.span>
              </div>
              <div className="h-2.5 rounded-full bg-white/[0.03] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${completionPct}%` } : {}}
                  transition={{ duration: 2, delay: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full relative"
                  style={{
                    background: 'linear-gradient(90deg, #f43f5e, #8b5cf6, #10b981)',
                    boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  {/* Moving shimmer on the bar */}
                  <div className="absolute inset-0 edu-progress-shimmer" />
                </motion.div>
              </div>
            </motion.div>

            {/* Leadership highlight with animated badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 p-5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer group"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center gap-2 mb-3">
                {/* Animated badge for Treasurer */}
                <motion.span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    backgroundColor: '#f59e0b15',
                    borderColor: '#f59e0b44',
                    color: '#f59e0b',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 5px rgba(245, 158, 11, 0.1)',
                      '0 0 15px rgba(245, 158, 11, 0.3)',
                      '0 0 5px rgba(245, 158, 11, 0.1)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles size={12} />
                  Treasurer
                </motion.span>
                <span className="text-xs font-mono text-slate-500">NEURON – AI & ML Club</span>
              </div>
              <h4 className="text-white font-medium mb-2">
                Leadership & Community
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Led technical workshops on production-ready backend systems, API development, and database architecture for 100+ students.
              </p>

              {/* Expandable details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t border-white/5">
                      <p className="text-sm text-slate-400 leading-relaxed mb-3">
                        Conducted hands-on sessions on REST API design, authentication strategies, microservices patterns, and deployment best practices.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['REST APIs', 'Auth', 'Microservices', 'Docker', 'CI/CD'].map((t) => (
                          <span
                            key={t}
                            className="px-2 py-1 text-xs font-mono rounded-md bg-[#f59e0b]/5 border border-[#f59e0b]/20 text-[#f59e0b]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-2 text-xs text-slate-600 font-mono group-hover:text-slate-500 transition-colors">
                {isExpanded ? 'Click to collapse ↑' : 'Click to see more ↓'}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .edu-progress-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: edu-shimmer 2s ease-in-out infinite;
        }
        @keyframes edu-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      ` }} />
    </section>
  );
}
