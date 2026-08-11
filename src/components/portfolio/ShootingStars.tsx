'use client';

import { useState, useRef, memo } from 'react';

/* ============================================================
   SHOOTING STARS — CSS animated meteor streaks
   ============================================================ */

interface Star {
  id: number;
  left: string;
  top: string;
  angle: number;
  duration: number;
  delay: number;
  length: number;
  opacity: number;
  thickness: number;
  color: string;
}

const STAR_COLORS = ['#00f0ff', '#8b5cf6', '#a78bfa', '#06b6d4', '#0d9488'];
const STAR_COUNT = 8;

function generateStar(id: number): Star {
  return {
    id,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 60}%`,
    angle: 25 + Math.random() * 30,
    duration: 1.2 + Math.random() * 2.5,
    delay: Math.random() * 12,
    length: 60 + Math.random() * 140,
    opacity: 0.06 + Math.random() * 0.15,
    thickness: 1 + Math.random() * 1.5,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
  };
}

const ShootingStar = memo(function ShootingStar({ star }: { star: Star }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: star.left,
        top: star.top,
        transform: `rotate(${star.angle}deg)`,
      }}
    >
      <div
        style={{
          opacity: 0,
          animation: `meteor-streak ${star.duration}s ease-in ${star.delay}s infinite`,
        }}
      >
        {/* Glowing head */}
        <div
          className="absolute rounded-full"
          style={{
            width: star.thickness * 2 + 1,
            height: star.thickness * 2 + 1,
            background: star.color,
            boxShadow: `0 0 ${star.thickness * 2}px ${star.color}88, 0 0 ${star.thickness * 4}px ${star.color}44`,
            left: 0,
            top: -star.thickness,
          }}
        />
        {/* Fading tail */}
        <div
          className="absolute"
          style={{
            width: star.length,
            height: star.thickness,
            background: `linear-gradient(to left, ${star.color}, transparent)`,
            opacity: star.opacity,
            left: -star.length,
            top: -star.thickness / 2,
            borderRadius: star.thickness / 2,
          }}
        />
      </div>
    </div>
  );
});

export default function ShootingStars() {
  const [stars] = useState<Star[]>(() => {
    const newStars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      newStars.push(generateStar(i));
    }
    return newStars;
  });

  return (
    <>
      <style>{`
        @keyframes meteor-streak {
          0% {
            opacity: 0;
            transform: translateX(0);
          }
          2% {
            opacity: 1;
          }
          15% {
            opacity: 0.7;
          }
          30%, 100% {
            opacity: 0;
            transform: translateX(350px);
          }
        }
      `}</style>
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <ShootingStar key={star.id} star={star} />
        ))}
      </div>
    </>
  );
}
