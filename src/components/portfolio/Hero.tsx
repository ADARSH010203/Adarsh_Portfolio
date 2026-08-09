'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download, ArrowRight } from 'lucide-react';

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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-slate-300 font-mono">Available for opportunities</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
          style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
        >
          <span className="text-white">Hi, I&apos;m </span>
          <span className="gradient-text">Adarsh</span>
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
          className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Crafting intelligent systems at the intersection of{' '}
          <span className="text-[#00f0ff]">Artificial Intelligence</span>,{' '}
          <span className="text-[#8b5cf6]">Machine Learning</span>, and{' '}
          <span className="text-[#f59e0b]">Scalable Engineering</span>.
        </motion.p>

        {/* CTA Buttons */}
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

        {/* Tech stack floating badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {['Python', 'FastAPI', 'LangChain', 'PyTorch', 'RAG', 'LLMs', 'MongoDB', 'Docker'].map(
            (tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 + i * 0.1, type: 'spring', stiffness: 200 }}
                className="px-3 py-1.5 text-xs font-mono text-slate-400 border border-white/5 rounded-lg bg-white/[0.02] hover:border-[#00f0ff]/30 hover:text-[#00f0ff] transition-colors cursor-default"
              >
                {tech}
              </motion.span>
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
    </section>
  );
}
