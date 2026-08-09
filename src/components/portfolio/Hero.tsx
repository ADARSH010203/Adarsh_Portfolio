'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download, ArrowRight } from 'lucide-react';
import GlitchText from './GlitchText';

function TypewriterText({ texts, speed = 80, deleteSpeed = 40, pause = 2000 }: {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pause?: number;
}) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && displayText === current) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && displayText === '') {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }, 300);
    } else {
      timeout = setTimeout(
        () => {
          setDisplayText(
            isDeleting
              ? current.substring(0, displayText.length - 1)
              : current.substring(0, displayText.length + 1)
          );
        },
        isDeleting ? deleteSpeed : speed
      );
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex, texts, speed, deleteSpeed, pause]);

  return (
    <span>
      {displayText}
      <span className="animate-blink text-[#00f0ff]">|</span>
    </span>
  );
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = 'rgba(3, 0, 20, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00f0ff';
      ctx.font = `${fontSize}px monospace`;
      ctx.globalAlpha = 0.06;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-[1] opacity-30 pointer-events-none" />;
}

function AnimatedCounter({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const heroStats = [
  { value: 2, suffix: '+', label: 'Years Exp' },
  { value: 10, suffix: '+', label: 'Projects' },
  { value: 5, suffix: '+', label: 'AI Models' },
];

function StaggeredLetter({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.4,
            delay: baseDelay + i * 0.04,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className="inline-block"
          style={{ transformOrigin: 'bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </>
  );
}

function OrbitalBadge({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.3 + index * 0.1, type: 'spring', stiffness: 200 }}
      className="relative inline-flex items-center justify-center px-3 py-1.5 text-xs font-mono text-slate-400 border border-white/5 rounded-lg bg-white/[0.02] cursor-default"
      whileHover={{
        scale: 1.15,
        borderColor: 'rgba(0, 240, 255, 0.3)',
        color: '#00f0ff',
        y: -4,
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.span>
  );
}

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <MatrixRain />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_20%,#030014_70%)]" />

      {/* Animated grid */}
      <div className="absolute inset-0 z-[2] grid-bg opacity-40" />

      {/* 3D Spinning wireframe cube behind text */}
      <div className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none">
        <div
          className="hero-wireframe-cube"
          style={{ transform: `translate(${mousePos.x * -0.2}px, ${mousePos.y * -0.2}px)` }}
          aria-hidden="true"
        >
          <div className="face" />
          <div className="face" />
          <div className="face" />
          <div className="face" />
          <div className="face" />
          <div className="face" />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Status badge with pulsing ring */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 mb-8"
        >
          <span className="absolute inset-0 rounded-full border border-[#00f0ff]/10 hero-pulse-ring" aria-hidden="true" />
          <span className="absolute inset-0 rounded-full border border-[#00f0ff]/5 hero-pulse-ring-delayed" aria-hidden="true" />
          <span className="relative w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="relative text-sm text-slate-300 font-mono">Available for opportunities</span>
        </motion.div>

        {/* Name with staggered letter animation + GlitchText */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
          style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
        >
          <span className="text-white">
            <StaggeredLetter text="Hi, I'm " baseDelay={0.3} />
          </span>
          <br className="sm:hidden" />
          <GlitchText text="Adarsh" className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold gradient-text" />
        </motion.h1>

        {/* Typewriter Role */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xl sm:text-2xl md:text-3xl font-light text-slate-400 mb-6 h-10"
        >
          <TypewriterText
            texts={[
              'AI/ML Engineer',
              'Full-Stack AI Developer',
              'RAG Specialist',
              'Multi-Agent Systems Builder',
              'Generative AI Engineer',
            ]}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto mb-6 leading-relaxed"
        >
          Crafting intelligent systems at the intersection of{' '}
          <span className="text-[#00f0ff]">Artificial Intelligence</span>,{' '}
          <span className="text-[#8b5cf6]">Machine Learning</span>, and{' '}
          <span className="text-[#f59e0b]">Scalable Engineering</span>.
        </motion.p>

        {/* Animated counters row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-10"
        >
          {heroStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text tabular-nums">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={2} />
              </div>
              <p className="text-xs text-slate-500 font-mono mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons with holographic shimmer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#contact"
            className="group relative px-8 py-3.5 rounded-xl font-semibold text-[#030014] bg-gradient-to-r from-[#00f0ff] to-[#06b6d4] overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
          >
            <span className="absolute inset-0 hero-holographic-shimmer" aria-hidden="true" />
            <span className="relative z-10 flex items-center gap-2">
              Get In Touch
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#06b6d4] to-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a
            href="#projects"
            className="px-8 py-3.5 rounded-xl font-semibold text-white border border-white/10 hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/10 transition-all duration-300 flex items-center gap-2"
          >
            <Download size={18} />
            View Projects
          </a>
        </motion.div>

        {/* Tech stack floating badges with orbital hover effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {['Python', 'FastAPI', 'LangChain', 'PyTorch', 'RAG', 'LLMs', 'MongoDB', 'Docker'].map(
            (tech, i) => (
              <OrbitalBadge key={tech} index={i}>
                {tech}
              </OrbitalBadge>
            )
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>

      {/* Inject keyframes for hero-specific animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hero-spin-cube {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg); }
        }
        @keyframes hero-pulse-ring-anim {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes hero-holographic-anim {
          0% { transform: translateX(-100%); }
          40% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        .hero-wireframe-cube {
          width: 200px;
          height: 200px;
          position: relative;
          animation: hero-spin-cube 20s linear infinite;
          transform-style: preserve-3d;
          opacity: 0.12;
        }
        .hero-wireframe-cube .face {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid #00f0ff;
          border-radius: 8px;
          box-shadow: inset 0 0 20px rgba(0, 240, 255, 0.05);
        }
        .hero-wireframe-cube .face:nth-child(1) { transform: translateZ(100px); border-color: #00f0ff; }
        .hero-wireframe-cube .face:nth-child(2) { transform: rotateY(180deg) translateZ(100px); border-color: #8b5cf6; }
        .hero-wireframe-cube .face:nth-child(3) { transform: rotateY(90deg) translateZ(100px); border-color: #f59e0b; }
        .hero-wireframe-cube .face:nth-child(4) { transform: rotateY(-90deg) translateZ(100px); border-color: #10b981; }
        .hero-wireframe-cube .face:nth-child(5) { transform: rotateX(90deg) translateZ(100px); border-color: #f43f5e; }
        .hero-wireframe-cube .face:nth-child(6) { transform: rotateX(-90deg) translateZ(100px); border-color: #00f0ff; }
        .hero-pulse-ring {
          animation: hero-pulse-ring-anim 2s ease-in-out infinite;
        }
        .hero-pulse-ring-delayed {
          animation: hero-pulse-ring-anim 2s ease-in-out infinite 0.5s;
        }
        .hero-holographic-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: hero-holographic-anim 3s ease-in-out infinite;
        }
      ` }} />
    </section>
  );
}
