'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, ChevronDown, ChevronUp } from 'lucide-react';

const projects = [
  {
    title: 'BrainWeave ARC',
    subtitle: 'Multi-Agent AI Research Copilot',
    period: 'Dec 2025 – Apr 2026',
    color: '#00f0ff',
    tech: ['Python', 'FastAPI', 'MongoDB', 'Redis', 'FAISS', 'Docker'],
    description:
      'Engineered a multi-agent AI research copilot featuring seven specialized agents for planning, research, coding, validation, repair, and report generation.',
    highlights: [
      'Designed end-to-end RAG pipeline with PDF/DOCX ingestion, semantic chunking, Sentence Transformers, and FAISS vector indexing for context-aware, citation-backed responses.',
      'Integrated Groq LLaMA-3.3-70B for multi-agent reasoning, automated research synthesis, and fact validation with Redis caching that cut inference cost by 25%.',
      'Implemented real-time WebSockets, JWT auth, RBAC, delivering sub-200ms progress updates with one-click export to PDF and DOCX reports.',
    ],
  },
  {
    title: 'Neuro',
    subtitle: 'Multilingual Conversational AI Platform',
    period: 'May 2025 – Oct 2025',
    color: '#8b5cf6',
    tech: ['React.js', 'FastAPI', 'MongoDB', 'LangChain', 'Groq', 'Hugging Face'],
    description:
      'Built a multilingual conversational platform featuring 9 specialized AI chatbots supporting real-time text and voice interaction.',
    highlights: [
      'Implemented Speech-to-Text and Text-to-Speech pipelines enabling real-time voice conversations, reducing language-barrier friction by 30%.',
      'Developed secure dual-mode authentication using facial recognition and email-based login with encrypted biometric embeddings.',
      'Integrated LangChain, Groq, and Hugging Face for context-aware conversations with persistent memory and sub-second AI inference.',
    ],
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="perspective-1000"
    >
      <div className="glass-card rounded-2xl overflow-hidden neon-border group" style={{ '--glow-color': project.color } as React.CSSProperties}>
        {/* Header gradient bar */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }} />

        <div className="p-6 sm:p-8">
          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white group-hover:text-[#00f0ff] transition-colors">
                {project.title}
              </h3>
              <p className="text-sm font-mono mt-1" style={{ color: project.color }}>
                {project.subtitle}
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 border border-white/10 rounded-lg px-3 py-1 whitespace-nowrap self-start">
              {project.period}
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed mb-5">{project.description}</p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-xs font-mono rounded-md border"
                style={{
                  borderColor: `${project.color}33`,
                  backgroundColor: `${project.color}08`,
                  color: project.color,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Expandable highlights */}
          <motion.div
            initial={false}
            animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="space-y-2 pb-2">
              {project.highlights.map((h, i) => (
                <li key={i} className="text-sm text-slate-400 leading-relaxed">
                  <span style={{ color: project.color }}>▹</span> {h}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-sm font-mono transition-colors hover:text-white"
              style={{ color: project.color }}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {expanded ? 'Show less' : 'View details'}
            </button>
            <div className="flex items-center gap-3">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-slate-500 hover:text-[#00f0ff] transition-colors">
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#10b981] font-mono text-sm tracking-widest uppercase">What I&apos;ve Built</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#10b981] to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="space-y-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
