'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2500;

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const raw = Math.min((elapsed / duration) * 100, 100);
      setProgress(raw);
    }, 16);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration);

    const unmountTimer = setTimeout(() => {
      setMounted(false);
      clearInterval(progressInterval);
    }, duration + 600);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{
            backgroundColor: '#030014',
            zIndex: 9999,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={
            isExiting
              ? { opacity: 0, scale: 1.1 }
              : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Logo with typing/glitch effect */}
          <div className="relative mb-8">
            <motion.span
              className="text-5xl md:text-7xl font-bold font-mono"
              style={{ color: '#00f0ff' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.8, 1, 0.6, 1, 0.9, 1] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'linear',
              }}
            >
              {'<AK />'}
            </motion.span>

            {/* Glitch pseudo layers */}
            <motion.span
              className="absolute top-0 left-0 text-5xl md:text-7xl font-bold font-mono"
              style={{ color: '#00f0ff', opacity: 0 }}
              animate={{
                opacity: [0, 0, 0.7, 0, 0, 0.5, 0, 0, 0, 0, 0.3, 0],
                x: [0, 0, -3, 0, 0, 2, 0, 0, 0, 0, -2, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              aria-hidden
            >
              {'<AK />'}
            </motion.span>
            <motion.span
              className="absolute top-0 left-0 text-5xl md:text-7xl font-bold font-mono"
              style={{ color: '#8b5cf6', opacity: 0 }}
              animate={{
                opacity: [0, 0, 0, 0, 0.6, 0, 0, 0.4, 0, 0, 0, 0],
                x: [0, 0, 0, 0, 3, 0, 0, -2, 0, 0, 0, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              aria-hidden
            >
              {'<AK />'}
            </motion.span>
          </div>

          {/* Progress bar */}
          <div className="w-64 md:w-80 h-[2px] rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #00f0ff, #8b5cf6)',
                boxShadow: '0 0 10px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.3)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>

          {/* Loading text with pulse */}
          <motion.p
            className="mt-4 text-sm font-mono tracking-widest"
            style={{ color: 'rgba(0, 240, 255, 0.6)' }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Loading Portfolio...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
