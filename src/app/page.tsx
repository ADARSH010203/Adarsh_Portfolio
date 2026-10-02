'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/portfolio/Navbar';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Skills from '@/components/portfolio/Skills';
import Experience from '@/components/portfolio/Experience';
import Projects from '@/components/portfolio/Projects';
import CodeShowcase from '@/components/portfolio/CodeShowcase';
import Testimonials from '@/components/portfolio/Testimonials';
import Education from '@/components/portfolio/Education';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';
import AIChat from '@/components/portfolio/AIChat';
import LoadingScreen from '@/components/portfolio/LoadingScreen';
import CustomCursor from '@/components/portfolio/CustomCursor';
import ScrollProgress from '@/components/portfolio/ScrollProgress';

const ParticleField = dynamic(() => import('@/components/portfolio/ParticleField'), {
  ssr: false,
  loading: () => null,
});

const ShootingStars = dynamic(() => import('@/components/portfolio/ShootingStars'), {
  ssr: false,
  loading: () => null,
});

const Aurora = dynamic(() => import('@/components/portfolio/Aurora'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <ScrollProgress />
      <div className="min-h-screen flex flex-col relative">
        <Aurora />
        <ParticleField />
        <ShootingStars />

        {/*
          Readability shield: keeps the animated WebGL background visible while
          preventing particle/bloom highlights from washing out page content.
          This layer sits above the background effects (z-0) and below all
          portfolio content (z-10).
        */}
        <div
          className="fixed inset-0 z-[1] pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle at 50% 12%, rgba(3, 7, 18, 0.42) 0%, rgba(3, 7, 18, 0.58) 42%, rgba(2, 6, 23, 0.72) 100%)',
          }}
        />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <CodeShowcase />
            <Testimonials />
            <Education />
            <Contact />
          </main>
          <Footer />
        </div>
        <AIChat />
      </div>
    </>
  );
}
