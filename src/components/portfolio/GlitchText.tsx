'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
}

// Use a stable key to avoid re-injection
let styleInjected = false;
const STYLE_ID = 'glitch-text-keyframes';

function ensureStyles() {
  if (styleInjected || typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) {
    styleInjected = true;
    return;
  }
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes glitch-clip-1 {
      0% { clip-path: inset(40% 0 61% 0); }
      5% { clip-path: inset(10% 0 85% 0); }
      10% { clip-path: inset(80% 0 1% 0); }
      15% { clip-path: inset(30% 0 50% 0); }
      20% { clip-path: inset(60% 0 20% 0); }
      25% { clip-path: inset(90% 0 2% 0); }
      30% { clip-path: inset(20% 0 70% 0); }
      35% { clip-path: inset(50% 0 30% 0); }
      40% { clip-path: inset(70% 0 10% 0); }
      45% { clip-path: inset(5% 0 90% 0); }
      50% { clip-path: inset(85% 0 5% 0); }
      55% { clip-path: inset(15% 0 75% 0); }
      60% { clip-path: inset(45% 0 45% 0); }
      65% { clip-path: inset(75% 0 15% 0); }
      70% { clip-path: inset(25% 0 65% 0); }
      75% { clip-path: inset(55% 0 35% 0); }
      80% { clip-path: inset(95% 0 1% 0); }
      85% { clip-path: inset(35% 0 55% 0); }
      90% { clip-path: inset(65% 0 25% 0); }
      95% { clip-path: inset(8% 0 82% 0); }
      100% { clip-path: inset(40% 0 61% 0); }
    }

    @keyframes glitch-clip-2 {
      0% { clip-path: inset(65% 0 13% 0); }
      5% { clip-path: inset(25% 0 60% 0); }
      10% { clip-path: inset(90% 0 2% 0); }
      15% { clip-path: inset(50% 0 30% 0); }
      20% { clip-path: inset(10% 0 80% 0); }
      25% { clip-path: inset(70% 0 15% 0); }
      30% { clip-path: inset(35% 0 50% 0); }
      35% { clip-path: inset(5% 0 88% 0); }
      40% { clip-path: inset(55% 0 35% 0); }
      45% { clip-path: inset(85% 0 8% 0); }
      50% { clip-path: inset(20% 0 70% 0); }
      55% { clip-path: inset(45% 0 45% 0); }
      60% { clip-path: inset(75% 0 10% 0); }
      65% { clip-path: inset(30% 0 60% 0); }
      70% { clip-path: inset(60% 0 25% 0); }
      75% { clip-path: inset(15% 0 78% 0); }
      80% { clip-path: inset(80% 0 5% 0); }
      85% { clip-path: inset(40% 0 48% 0); }
      90% { clip-path: inset(8% 0 85% 0); }
      95% { clip-path: inset(92% 0 3% 0); }
      100% { clip-path: inset(65% 0 13% 0); }
    }

    @keyframes glitch-scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }

    @keyframes glitch-skew {
      0% { transform: skewX(0deg); }
      10% { transform: skewX(-3deg); }
      20% { transform: skewX(2deg); }
      30% { transform: skewX(-1deg); }
      40% { transform: skewX(3deg); }
      50% { transform: skewX(0deg); }
      100% { transform: skewX(0deg); }
    }

    .glitch-text-wrapper {
      position: relative;
      display: inline-block;
    }

    .glitch-text-wrapper::before,
    .glitch-text-wrapper::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .glitch-text-wrapper::before {
      color: #00f0ff;
      z-index: -1;
      animation: glitch-clip-1 2s infinite linear alternate-reverse;
      opacity: 0;
    }

    .glitch-text-wrapper::after {
      color: #8b5cf6;
      z-index: -2;
      animation: glitch-clip-2 3s infinite linear alternate-reverse;
      opacity: 0;
    }

    .glitch-text-wrapper.glitching::before {
      opacity: 0.8;
      animation: glitch-clip-1 0.3s infinite linear, glitch-skew 0.3s ease-in-out;
      left: -2px;
    }

    .glitch-text-wrapper.glitching::after {
      opacity: 0.8;
      animation: glitch-clip-2 0.3s infinite linear, glitch-skew 0.3s ease-in-out reverse;
      left: 2px;
    }

    .glitch-scanline {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: rgba(0, 240, 255, 0.06);
      animation: glitch-scanline 8s linear infinite;
      pointer-events: none;
      z-index: 5;
    }
  `;
  document.head.appendChild(style);
  styleInjected = true;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    ensureStyles();
  }, []);

  useEffect(() => {
    const minDelay = 3000;
    const maxDelay = 5000;
    const glitchDuration = 250;

    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleGlitch = () => {
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      timeoutId = setTimeout(() => {
        setIsGlitching(true);
        setTimeout(() => {
          setIsGlitching(false);
          scheduleGlitch();
        }, glitchDuration);
      }, delay);
    };

    scheduleGlitch();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const glitchClass = `glitch-text-wrapper ${isGlitching ? 'glitching' : ''}`;

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <span
        className={glitchClass}
        data-text={text}
        aria-label={text}
      >
        {text}
        {/* Scanline overlay */}
        <span className="glitch-scanline" aria-hidden />
      </span>
    </motion.span>
  );
}
