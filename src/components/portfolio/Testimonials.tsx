'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Users, Code, Star, Zap, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Achievement {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  color: string;
}

const achievements: Achievement[] = [
  {
    icon: Trophy,
    title: 'AI/ML Projects',
    value: '10+',
    description: 'Production-grade AI applications built and deployed',
    color: '#00f0ff',
  },
  {
    icon: Users,
    title: 'Workshop Students',
    value: '100+',
    description: 'Technical workshops conducted as NEURON Club Treasurer and Basketball Cordinator',
    color: '#8b5cf6',
  },
  {
    icon: Code,
    title: 'Tech Stack',
    value: '20+',
    description: 'Technologies mastered across AI, backend, data and App',
    color: '#f59e0b',
  },
  {
    icon: Star,
    title: 'Specializations',
    value: '5',
    description: 'RAG, LLMs, Multi-Agent, NLP, Computer Vision',
    color: '#10b981',
  },
  {
    icon: Zap,
    title: 'API Endpoints',
    value: '50+',
    description: 'RESTful APIs designed and deployed for AI services',
    color: '#f43f5e',
  },
  {
    icon: Globe,
    title: 'Languages',
    value: '3',
    description: 'English, Hindi, Bhojpuri — enabling global collaboration',
    color: '#06b6d4',
  },
];

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = achievement.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="relative group"
    >
      <div className="glass-card rounded-2xl p-6 h-full transition-all duration-300 hover:bg-white/[0.06] hover:border-white/10">
        {/* Icon background glow */}
        <div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: achievement.color }}
        />

        {/* Icon */}
        <div
          className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundColor: `${achievement.color}10`,
            border: `1px solid ${achievement.color}25`,
          }}
        >
          <Icon size={22} style={{ color: achievement.color }} />
        </div>

        {/* Value */}
        <div
          className="text-3xl sm:text-4xl font-bold mb-1"
          style={{ color: achievement.color }}
        >
          {achievement.value}
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-sm sm:text-base mb-2">
          {achievement.title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
          {achievement.description}
        </p>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${achievement.color}40, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={sectionRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#8b5cf6] font-mono text-sm tracking-widest uppercase">Milestones</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
            <span className="gradient-text">Recognition</span>
          </h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base">
            Numbers that reflect the journey
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievements.map((achievement, i) => (
            <AchievementCard
              key={achievement.title}
              achievement={achievement}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
