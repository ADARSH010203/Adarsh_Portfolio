'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
}

const COLORS = ['#00f0ff', '#8b5cf6', '#06b6d4', '#a78bfa', '#f59e0b', '#ffffff'];

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    mouseRef.current = {
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Create particles in a 3D galaxy distribution
    const PARTICLE_COUNT = Math.min(1500, Math.floor(width * height / 800));
    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = Math.random() * Math.min(width, height) * 0.6 + 20;
      const spinAngle = radius * 0.015;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;
      const randomness = (Math.random() - 0.5) * (radius < 200 ? 80 : 160);
      const randomnessY = (Math.random() - 0.5) * (radius < 200 ? 60 : 120);

      particles.push({
        x: width / 2 + Math.cos(branchAngle + spinAngle) * radius + randomness,
        y: height / 2 + Math.sin(branchAngle + spinAngle) * radius * 0.4 + randomnessY,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        vz: -Math.random() * 0.5 - 0.2,
        size: Math.random() * 2 + 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Connection lines (sparse)
    const LINE_COUNT = 60;
    const lines: { x1: number; y1: number; x2: number; y2: number; alpha: number }[] = [];
    for (let i = 0; i < LINE_COUNT; i++) {
      lines.push({
        x1: Math.random() * width,
        y1: Math.random() * height,
        x2: Math.random() * width,
        y2: Math.random() * height,
        alpha: Math.random() * 0.04 + 0.01,
      });
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('resize', handleResize);

    let time = 0;
    function animate() {
      if (!ctx || !canvas) return;
      time += 0.005;

      ctx.fillStyle = 'rgba(3, 0, 20, 0.12)';
      ctx.fillRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw connection lines
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 0.5;
      for (const line of lines) {
        ctx.globalAlpha = line.alpha;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        line.x1 += mx * 0.3;
        line.y1 += my * 0.3;
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Draw particles
      for (const p of particles) {
        // Update
        p.x += p.vx + Math.sin(time + p.z * 0.01) * 0.2 + mx * 0.15;
        p.y += p.vy + Math.cos(time + p.z * 0.01) * 0.15 + my * 0.1;
        p.z += p.vz;

        // Wrap around
        if (p.z < 0) p.z = 1000;
        if (p.z > 1000) p.z = 0;
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;

        // 3D depth effect
        const scale = 300 / (300 + p.z);
        const drawSize = p.size * scale;
        const drawAlpha = p.alpha * scale;

        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(drawAlpha, 0.9);
        ctx.fill();

        // Glow for closer particles
        if (p.z < 200 && drawSize > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = drawAlpha * 0.08;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [handlePointerMove]);

  return (
    <div className="fixed inset-0 z-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
