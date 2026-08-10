'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isHoveringRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        document.body.style.cursor = 'none';
      } else {
        document.body.style.cursor = '';
      }
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => {
      window.removeEventListener('resize', checkDesktop);
      document.body.style.cursor = '';
    };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
    if (!isVisible) setIsVisible(true);
  }, [mouseX, mouseY, isVisible]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactive = target.closest('a, button, input, textarea, [role=\"button\"], [data-cursor-hover]');
    if (interactive) {
      isHoveringRef.current = true;
      setIsHovering(true);
    }
  }, []);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactive = target.closest('a, button, input, textarea, [role=\"button\"], [data-cursor-hover]');
    if (interactive) {
      isHoveringRef.current = false;
      setIsHovering(false);
    }
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDesktop, handleMouseMove, handleMouseOver, handleMouseOut]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Small dot - follows mouse instantly */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none"
        style={{
          zIndex: 9998,
          x: mouseX,
          y: mouseY,
          width: 6,
          height: 6,
          backgroundColor: '#00f0ff',
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
          boxShadow: '0 0 6px #00f0ff, 0 0 12px rgba(0, 240, 255, 0.4)',
        }}
      />

      {/* Larger ring - follows with spring delay */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none"
        style={{
          zIndex: 9998,
          x: ringX,
          y: ringY,
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          translateX: '-50%',
          translateY: '-50%',
          border: `1.5px solid ${isHovering ? 'rgba(0, 240, 255, 0.8)' : 'rgba(0, 240, 255, 0.5)'}`,
          opacity: isVisible ? 1 : 0,
          boxShadow: isHovering
            ? '0 0 15px rgba(0, 240, 255, 0.4), inset 0 0 15px rgba(0, 240, 255, 0.05)'
            : '0 0 8px rgba(0, 240, 255, 0.2)',
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          willChange: 'transform',
        }}
      />
    </>
  );
}
