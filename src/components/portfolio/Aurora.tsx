'use client';

import { memo } from 'react';

/* ============================================================
   AURORA — CSS animated northern lights / aurora borealis
   ============================================================ */

const Aurora = memo(function Aurora() {
  return (
    <>
      <style>{`
        @keyframes aurora-drift-1 {
          0%, 100% {
            transform: translate(0%, 0%) scale(1) rotate(0deg);
          }
          25% {
            transform: translate(10%, -5%) scale(1.1) rotate(3deg);
          }
          50% {
            transform: translate(-5%, 5%) scale(0.95) rotate(-2deg);
          }
          75% {
            transform: translate(5%, -3%) scale(1.05) rotate(1deg);
          }
        }
        @keyframes aurora-drift-2 {
          0%, 100% {
            transform: translate(0%, 0%) scale(1) rotate(0deg);
          }
          33% {
            transform: translate(-8%, 6%) scale(1.15) rotate(-4deg);
          }
          66% {
            transform: translate(12%, -4%) scale(0.9) rotate(2deg);
          }
        }
        @keyframes aurora-drift-3 {
          0%, 100% {
            transform: translate(0%, 0%) scale(1);
          }
          50% {
            transform: translate(-10%, 8%) scale(1.2);
          }
        }
        @keyframes aurora-pulse {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.12; }
        }
      `}</style>
      <div className="fixed inset-0 z-[0] pointer-events-none overflow-hidden">
        {/* Cyan blob - top left */}
        <div
          className="absolute"
          style={{
            top: '-20%',
            left: '-10%',
            width: '60vw',
            height: '40vh',
            background: 'radial-gradient(ellipse, rgba(0, 240, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'aurora-drift-1 18s ease-in-out infinite, aurora-pulse 8s ease-in-out infinite',
          }}
        />
        {/* Purple blob - center right */}
        <div
          className="absolute"
          style={{
            top: '10%',
            right: '-15%',
            width: '55vw',
            height: '45vh',
            background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
            filter: 'blur(90px)',
            animation: 'aurora-drift-2 22s ease-in-out infinite, aurora-pulse 10s ease-in-out 2s infinite',
          }}
        />
        {/* Green/teal blob - bottom left */}
        <div
          className="absolute"
          style={{
            bottom: '-10%',
            left: '15%',
            width: '50vw',
            height: '35vh',
            background: 'radial-gradient(ellipse, rgba(0, 255, 136, 0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'aurora-drift-3 25s ease-in-out infinite, aurora-pulse 12s ease-in-out 4s infinite',
          }}
        />
        {/* Subtle cyan-purple blend - top center */}
        <div
          className="absolute"
          style={{
            top: '-5%',
            left: '30%',
            width: '40vw',
            height: '30vh',
            background: 'radial-gradient(ellipse, rgba(0, 240, 255, 0.06) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 70%)',
            filter: 'blur(120px)',
            animation: 'aurora-drift-1 30s ease-in-out 5s infinite, aurora-pulse 15s ease-in-out 3s infinite',
          }}
        />
        {/* Amber accent blob - very subtle */}
        <div
          className="absolute"
          style={{
            top: '40%',
            right: '5%',
            width: '30vw',
            height: '25vh',
            background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.05) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'aurora-drift-2 28s ease-in-out 7s infinite',
          }}
        />
      </div>
    </>
  );
});

export default Aurora;
