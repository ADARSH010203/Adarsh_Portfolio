'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

const experiences = [
  {
    role: 'Data Science Intern',
    company: 'Gatim AI Tech Innovation Pvt Ltd',
    location: 'Remote',
    period: 'Jul 2024 – Dec 2024',
    color: '#00f0ff',
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

  return (
    <div className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8`} ref={ref}>
      {/* Timeline node */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2, type: 'spring' }}
          className="w-5 h-5 rounded-full border-2"
          style={{ borderColor: exp.color, backgroundColor: `${exp.color}33`, boxShadow: `0 0 15px ${exp.color}44` }}
        />
      </div>

      {/* Mobile node */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.2, type: 'spring' }}
        className="md:hidden w-4 h-4 rounded-full border-2 ml-0.5 flex-shrink-0"
        style={{ borderColor: exp.color, backgroundColor: `${exp.color}33` }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`flex-1 ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'} pl-6 md:pl-0`}
      >
        <div className={`glass-card rounded-2xl p-5 sm:p-6 neon-border`}
          style={{ '--glow-color': exp.color } as React.CSSProperties}
        >
          <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:justify-end' : ''}`}>
            <Briefcase size={16} style={{ color: exp.color }} />
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
        </div>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
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

        {/* Timeline line */}
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="md:hidden absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <TimelineCard key={exp.role} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
