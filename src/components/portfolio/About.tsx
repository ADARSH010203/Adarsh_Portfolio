'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Bot, Brain, Cpu, Zap, Globe, Shield } from 'lucide-react';
import TiltCard from './TiltCard';

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
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || !ref.current) return;
    hasAnimated.current = true;
    const start = Date.now();
    function tick() {
      if (!ref.current) return;
      const progress = Math.min((Date.now() - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      ref.current.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, suffix, duration]);

  return <span ref={ref}>0</span>;
}

function TypingText({ text, delay = 0, speed = 15 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [inView, delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  return <p ref={ref}>{displayed}<span className={displayed.length < text.length ? 'animate-blink text-[#00f0ff]/60' : 'invisible'}>|</span></p>;
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

const bioText = "I'm an AI/ML Engineer with hands-on experience in Generative AI, NLP, RAG, LLMs, and Multi-Agent Systems. Currently pursuing B.Tech in Computer Engineering at RK University, Rajkot.";

const bioText2 = "I've built healthcare chatbots, conversational AI platforms, and AI research copilots using Python, FastAPI, LangChain, MongoDB, Redis, and Groq. I thrive on developing end-to-end AI applications spanning retrieval pipelines, agentic workflows, multimodal interactions, and scalable backend systems.";

const bioText3 = "As Treasurer of NEURON (AI & ML Club), I've conducted technical workshops for 100+ students on production-ready backend systems, API development, and database architecture.";

function NeuralNetworkBG() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.06]" aria-hidden="true">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern id="about-neural-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.2" fill="#00f0ff" className="about-neural-dot" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#about-neural-dots)" />
        <line x1="60" y1="60" x2="140" y2="80" stroke="#8b5cf6" strokeWidth="0.5" className="about-neural-line" />
        <line x1="180" y1="40" x2="260" y2="120" stroke="#00f0ff" strokeWidth="0.5" className="about-neural-line-delayed" />
        <line x1="300" y1="80" x2="380" y2="40" stroke="#f59e0b" strokeWidth="0.5" className="about-neural-line" />
        <line x1="420" y1="100" x2="500" y2="60" stroke="#10b981" strokeWidth="0.5" className="about-neural-line-delayed" />
        <line x1="100" y1="200" x2="200" y2="180" stroke="#f43f5e" strokeWidth="0.5" className="about-neural-line" />
        <line x1="250" y1="220" x2="350" y2="200" stroke="#00f0ff" strokeWidth="0.5" className="about-neural-line-delayed" />
        <line x1="400" y1="180" x2="500" y2="220" stroke="#8b5cf6" strokeWidth="0.5" className="about-neural-line" />
        <line x1="60" y1="280" x2="160" y2="300" stroke="#f59e0b" strokeWidth="0.5" className="about-neural-line-delayed" />
        <line x1="200" y1="300" x2="300" y2="280" stroke="#10b981" strokeWidth="0.5" className="about-neural-line" />
      </svg>
    </div>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <NeuralNetworkBG />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
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
              <div className="text-slate-400 leading-relaxed mb-4">
                <TypingText text={bioText} delay={400} speed={12} />
              </div>
              <div className="text-slate-400 leading-relaxed mb-4">
                <TypingText text={bioText2} delay={1800} speed={8} />
              </div>
              <div className="text-slate-400 leading-relaxed">
                <TypingText text={bioText3} delay={4000} speed={10} />
              </div>
            </div>
          </motion.div>

          {/* Stat cards with 3D hover flip + connecting lines */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            {/* Animated connecting lines between cards */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block" aria-hidden="true">
              <svg className="w-full h-full">
                <line x1="50%" y1="25%" x2="50%" y2="75%" stroke="url(#about-connector-grad)" strokeWidth="1" strokeDasharray="4 4" className="about-connector-line" />
                <line x1="25%" y1="50%" x2="75%" y2="50%" stroke="url(#about-connector-grad)" strokeWidth="1" strokeDasharray="4 4" className="about-connector-line-delayed" />
                <defs>
                  <linearGradient id="about-connector-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4 relative">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  whileHover={{
                    rotateY: 8,
                    rotateX: -5,
                    scale: 1.05,
                    boxShadow: `0 0 30px ${item.color}22`,
                    transition: { duration: 0.3 },
                  }}
                  className="glass-card rounded-xl p-5 sm:p-6 text-center group cursor-default perspective-1000"
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <item.icon
                      size={28}
                      className="mx-auto mb-3 transition-colors duration-300"
                      style={{ color: item.color }}
                    />
                  </motion.div>
                  <Counter target={item.target} suffix={item.suffix} />
                  <p className="text-sm text-slate-500 mt-1">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Capabilities wrapped in TiltCard */}
        <div className="grid md:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.15 }}
            >
              <TiltCard className="h-full">
                <div className="glass-card rounded-2xl p-6 group h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center mb-4 group-hover:bg-[#00f0ff]/20 transition-colors">
                    <cap.icon size={24} className="text-[#00f0ff]" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{cap.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{cap.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes about-dot-pulse {
          0%, 100% { opacity: 0.3; r: 1.2; }
          50% { opacity: 0.8; r: 1.8; }
        }
        @keyframes about-line-draw {
          0% { stroke-dashoffset: 200; opacity: 0; }
          50% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.5; }
        }
        @keyframes about-connector-dash {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        .about-neural-dot {
          animation: about-dot-pulse 3s ease-in-out infinite;
        }
        .about-neural-line, .about-neural-line-delayed {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: about-line-draw 4s ease-in-out infinite;
        }
        .about-neural-line-delayed {
          animation-delay: 1.5s;
        }
        .about-connector-line, .about-connector-line-delayed {
          animation: about-connector-dash 2s linear infinite;
        }
        .about-connector-line-delayed {
          animation-delay: 0.5s;
        }
      ` }} />
    </section>
  );
}
