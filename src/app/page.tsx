'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/portfolio/Navbar';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Skills from '@/components/portfolio/Skills';
import Experience from '@/components/portfolio/Experience';
import Projects from '@/components/portfolio/Projects';
import Education from '@/components/portfolio/Education';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';
import AIChat from '@/components/portfolio/AIChat';

const ParticleField = dynamic(() => import('@/components/portfolio/ParticleField'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticleField />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
      <AIChat />
    </div>
  );
}
