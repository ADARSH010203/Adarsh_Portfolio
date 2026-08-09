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
