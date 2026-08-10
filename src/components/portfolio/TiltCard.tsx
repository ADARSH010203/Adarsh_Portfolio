'use client';

import React, { useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glare?: boolean;
}

export default function TiltCard({
  children,
  className = '',
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [showGlare, setShowGlare] = useState(false);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.2 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  const maxTilt = 15;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      rotateX.set(-percentY * maxTilt);
      rotateY.set(percentX * maxTilt);

      if (glare) {
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;
        setGlarePos({ x: glareX, y: glareY });
        setShowGlare(true);
      }
    },
    [rotateX, rotateY, glare]
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    setShowGlare(false);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {children}
      </motion.div>

      {/* Glare overlay */}
      {glare && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            opacity: showGlare ? 0.2 : 0,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)`,
            transition: 'opacity 0.3s ease',
            zIndex: 10,
          }}
        />
      )}
    </motion.div>
  );
}
