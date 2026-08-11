'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Users, Award, Lightbulb } from 'lucide-react';

const experiences = [
  {
    role: 'Data Science Intern',
    company: 'Gatim AI Tech Innovation Pvt Ltd',
    location: 'Remote',
    period: 'Jul 2024 – Dec 2024',
    color: '#00f0ff',
    icon: Briefcase,
    yearsOfExp: 0.5,
    techStack: ['LangChain', 'Meta LLaMA', 'Groq API', 'Hugging Face', 'FastAPI'],
    highlights: [
      'Applied Generative AI and NLP techniques to real-world healthcare datasets, performing data preparation and model optimization that strengthened multilingual information retrieval.',
      'Developed a RAG-based healthcare chatbot with multilingual support, voice-to-voice interaction, and image-based question answering.',
      'Delivered real-time question-answering and translation features using LangChain, Meta LLaMA, Groq API, and Hugging Face.',
      'Optimized text preprocessing, embedding generation, and vectorization techniques, increasing answer relevance by 30%.',
    ],
  },
  {
    role: 'Treasurer – NEURON (AI & ML Club)',
    company: 'RK University, Rajkot, Gujarat',
    location: 'Rajkot, Gujarat',
    period: 'Mar 2024 – May 2026',
    color: '#8b5cf6',
    icon: Users,
    yearsOfExp: 2,
    techStack: ['LLM', 'MLops', 'Python', 'Docker', 'Langchain','AI AGENT'],
    highlights: [
      'Conducted technical workshops on building production-ready backend systems, API development, and database architecture for 100+ students.',
      'Led hands-on sessions covering REST API design, authentication strategies, microservices patterns, query optimization, and deployment best practices.',
    ],
  },
];

function TimelineCard({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8`} ref={ref}>
      {/* Timeline node with glow animation */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2, type: 'spring' }}
          className="relative"
        >
          <div
            className="w-5 h-5 rounded-full border-2"
            style={{ borderColor: exp.color, backgroundColor: `${exp.color}33` }}
          />
          {/* Glow ring when in view */}
          <motion.div
            initial={{ scale: 1, opacity: 0 }}
            animate={inView ? { scale: [1, 2, 1], opacity: [0, 0.6, 0] } : {}}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full"
            style={{ border: `1px solid ${exp.color}44` }}
          />
        </motion.div>
      </div>

      {/* Mobile node */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2, type: 'spring' }}
        className="md:hidden w-4 h-4 rounded-full border-2 ml-0.5 flex-shrink-0"
        style={{ borderColor: exp.color, backgroundColor: `${exp.color}33` }}
      />

      {/* Content card with 3D flip on hover */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`flex-1 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} pl-6 md:pl-0`}
      >
        <div
          className="perspective-1000 cursor-pointer"
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
        >
          <AnimatePresence mode="wait">
            {!isFlipped ? (
              <motion.div
                key="front"
                initial={{ rotateY: 0 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-2xl p-5 sm:p-6 neon-border"
                style={{ '--glow-color': exp.color } as React.CSSProperties}
              >
                <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Briefcase size={16} style={{ color: exp.color }} />
                  </motion.div>
                  <span className="text-sm font-mono" style={{ color: exp.color }}>{exp.role}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{exp.company}</h3>
                <div className={`flex items-center gap-4 text-sm text-slate-500 mb-4 ${isLeft ? 'md:justify-end' : ''}`}>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> {exp.period}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {exp.location}
                  </span>
                </div>
                <ul className={`space-y-2 ${isLeft ? 'md:text-left' : ''}`}>
                  {exp.highlights.map((h, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                      className="text-sm text-slate-400 leading-relaxed"
                    >
                      <span style={{ color: exp.color }}>▹</span> {h}
                    </motion.li>
                  ))}
                </ul>
                <p className="text-xs text-slate-600 mt-3 font-mono">Hover for more →</p>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-2xl p-5 sm:p-6 backface-hidden"
                style={{ border: `1px solid ${exp.color}33` }}
              >
                <div className={`flex items-center gap-2 mb-4 ${isLeft ? 'md:justify-end' : ''}`}>
                  <Award size={16} style={{ color: exp.color }} />
                  <span className="text-sm font-mono" style={{ color: exp.color }}>Key Details</span>
                </div>
                <div className="mb-4">
                  <p className="text-xs text-slate-500 font-mono mb-2">Years of Contribution</p>
                  <div className="text-3xl font-bold gradient-text tabular-nums">{exp.yearsOfExp}+</div>
                </div>
                <div className="mb-4">
                  <p className="text-xs text-slate-500 font-mono mb-2">Tech Stack</p>
                  <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                    {exp.techStack.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 text-xs font-mono rounded-md"
                        style={{
                          backgroundColor: `${exp.color}10`,
                          border: `1px solid ${exp.color}22`,
                          color: exp.color,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Lightbulb size={14} style={{ color: exp.color }} />
                  <span>{exp.highlights.length} key achievements</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function TotalExperience({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-center mb-12"
    >
      <div className="inline-flex items-center gap-3 glass-card rounded-full px-6 py-3">
        <span className="text-xs text-slate-500 font-mono">Total Experience</span>
        <span className="text-2xl font-bold gradient-text">2+ Years</span>
        <span className="text-xs text-slate-500 font-mono">in AI/ML</span>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="relative py-24 sm:py-32">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#f59e0b] font-mono text-sm tracking-widest uppercase">Career Journey</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent mx-auto mt-4" />
        </motion.div>

        <TotalExperience inView={inView} />

        {/* Timeline with glowing line */}
        <div className="relative">
          {/* Glowing vertical line - desktop */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <motion.div
              initial={{ y: '-100%' }}
              animate={inView ? { y: '100%' } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#f59e0b]/60 to-transparent"
            />
          </div>
          {/* Glowing vertical line - mobile */}
          <div className="md:hidden absolute left-[7px] top-0 bottom-0 w-px">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <motion.div
              initial={{ y: '-100%' }}
              animate={inView ? { y: '100%' } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#f59e0b]/60 to-transparent"
            />
          </div>

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <TimelineCard key={exp.role} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes exp-timeline-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(245, 158, 11, 0.1); }
          50% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.3); }
        }
      ` }} />
    </section>
  );
}
