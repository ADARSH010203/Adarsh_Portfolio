'use client';

import { memo } from 'react';

const Aurora = memo(function Aurora() {
  return (
    <>
      <style>{`
        @keyframes aurora-drift-1 {
          0%, 100% { transform: translate3d(0,0,0) scale(1) rotate(0deg); }
          50% { transform: translate3d(7%,-5%,0) scale(1.12) rotate(2deg); }
        }
        @keyframes aurora-drift-2 {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-8%,6%,0) scale(1.15); }
        }
        @keyframes aurora-drift-3 {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(5%,-8%,0) scale(1.08); }
        }
        @keyframes aurora-pulse {
          0%, 100% { opacity: .55; }
          50% { opacity: .9; }
        }
      `}</style>

      <div className="fixed inset-0 z-[0] pointer-events-none overflow-hidden bg-[#02030a]">
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(circle at 18% 12%, rgba(0, 240, 255, 0.10), transparent 30%)',
              'radial-gradient(circle at 78% 18%, rgba(124, 58, 237, 0.14), transparent 34%)',
              'radial-gradient(circle at 48% 62%, rgba(14, 165, 233, 0.06), transparent 38%)',
              'linear-gradient(180deg, #02030a 0%, #050816 46%, #02030a 100%)',
            ].join(','),
          }}
        />

        <div
          className="absolute left-[-12%] top-[-18%] h-[46vh] w-[68vw]"
          style={{
            background: 'radial-gradient(ellipse, rgba(34,211,238,0.17) 0%, rgba(34,211,238,0.04) 42%, transparent 72%)',
            filter: 'blur(90px)',
            animation: 'aurora-drift-1 22s ease-in-out infinite, aurora-pulse 10s ease-in-out infinite',
          }}
        />

        <div
          className="absolute right-[-18%] top-[2%] h-[52vh] w-[62vw]"
          style={{
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, rgba(79,70,229,0.05) 46%, transparent 72%)',
            filter: 'blur(100px)',
            animation: 'aurora-drift-2 26s ease-in-out infinite, aurora-pulse 13s ease-in-out 2s infinite',
          }}
        />

        <div
          className="absolute bottom-[-16%] left-[8%] h-[44vh] w-[58vw]"
          style={{
            background: 'radial-gradient(ellipse, rgba(8,145,178,0.10) 0%, rgba(16,185,129,0.025) 48%, transparent 74%)',
            filter: 'blur(110px)',
            animation: 'aurora-drift-3 30s ease-in-out infinite',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'linear-gradient(to bottom, black, transparent 88%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 88%)',
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 35%, rgba(2,3,10,0.42) 82%, rgba(2,3,10,0.82) 100%)',
          }}
        />
      </div>
    </>
  );
});

export default Aurora;
