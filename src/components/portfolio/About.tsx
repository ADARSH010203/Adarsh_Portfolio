'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bot, Brain, Cpu, Zap, Globe, Shield } from 'lucide-react';

function Counter({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      className="text-3xl sm:text-4xl font-bold gradient-text tabular-nums"
    >
      {inView ? (
        <CountUp target={target} suffix={suffix} duration={duration} />
      ) : (
        '0'
      )}
    </motion.span>
  );
}

function CountUp({ target, suffix, duration }: { target: number; suffix: string; duration: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  if (typeof window === 'undefined') return <span>0</span>;

  const start = Date.now();
  const end = start + duration * 1000;

  function tick() {
    if (!ref.current) return;
    const now = Date.now();
    const progress = Math.min((now - start) / (duration * 1000), 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    ref.current.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
  return <span ref={ref}>0</span>;
}

const highlights = [
  { icon: Bot, label: 'AI Chatbots', target: 3, suffix: '+', color: '#00f0ff' },
  { icon: Brain, label: 'AI Projects', target: 10, suffix: '+', color: '#8b5cf6' },
  { icon: Cpu, label: 'LLM Integrations', target: 5, suffix: '+', color: '#f59e0b' },
  { icon: Zap, label: 'APIs Built', target: 15, suffix: '+', color: '#10b981' },
];

const capabilities = [
  { icon: Globe, title: 'Multilingual AI', desc: 'Built chatbots supporting multiple languages with real-time translation capabilities.' },
  { icon: Brain, title: 'RAG Architectures', desc: 'Designed end-to-end retrieval pipelines with semantic chunking and vector indexing.' },
  { icon: Shield, title: 'Secure Systems', desc: 'Implemented JWT auth, RBAC, facial recognition, and encrypted biometric storage.' },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#00f0ff] font-mono text-sm tracking-widest uppercase">About Me</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
            Who I <span className="gradient-text">Am</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Bio + Stats */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 neon-border">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
                AI/ML Engineer & Full-Stack Developer
              </h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                I&apos;m an AI/ML Engineer with hands-on experience in Generative AI, NLP, RAG, LLMs, and Multi-Agent Systems. Currently pursuing B.Tech in Computer Engineering at RK University, Rajkot.
              </p>
              <p className="text-slate-400 leading-relaxed mb-4">
                I&apos;ve built healthcare chatbots, conversational AI platforms, and AI research copilots using Python, FastAPI, LangChain, MongoDB, Redis, and Groq. I thrive on developing end-to-end AI applications spanning retrieval pipelines, agentic workflows, multimodal interactions, and scalable backend systems.
              </p>
              <p className="text-slate-400 leading-relaxed">
                As Treasurer of NEURON (AI & ML Club), I&apos;ve conducted technical workshops for 100+ students on production-ready backend systems, API development, and database architecture.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="glass-card rounded-xl p-5 sm:p-6 text-center group cursor-default"
              >
                <item.icon
                  size={28}
                  className="mx-auto mb-3 transition-colors duration-300"
                  style={{ color: item.color }}
                />
                <Counter target={item.target} suffix={item.suffix} />
                <p className="text-sm text-slate-500 mt-1">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Capabilities */}
        <div className="grid md:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.15 }}
              className="glass-card rounded-2xl p-6 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center mb-4 group-hover:bg-[#00f0ff]/20 transition-colors">
                <cap.icon size={24} className="text-[#00f0ff]" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{cap.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{cap.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
