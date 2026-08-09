'use client';

import { useScroll, useSpring, motion, useTransform } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const barWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const dotLeft = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const dotOpacity = useTransform(
    smoothProgress,
    [0, 0.01, 0.99, 1],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      className="fixed top-0 left-0 w-full"
      style={{
        zIndex: 100,
        height: 3,
        backgroundColor: 'transparent',
      }}
    >
      {/* Gradient progress bar */}
      <motion.div
        className="absolute top-0 left-0 h-full"
        style={{
          width: barWidth,
          background: 'linear-gradient(90deg, #00f0ff, #8b5cf6, #f59e0b)',
          boxShadow: '0 0 8px rgba(0, 240, 255, 0.6), 0 2px 12px rgba(139, 92, 246, 0.4), 0 4px 16px rgba(245, 158, 11, 0.2)',
          willChange: 'width',
        }}
      />

      {/* Bright leading dot */}
      <motion.div
        className="absolute top-1/2"
        style={{
          left: dotLeft,
          y: '-50%',
          x: '-4px',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          opacity: dotOpacity,
          boxShadow: '0 0 6px #00f0ff, 0 0 12px rgba(0, 240, 255, 0.8), 0 0 20px rgba(0, 240, 255, 0.4)',
          willChange: 'left, opacity',
        }}
      />
    </motion.div>
  );
}
