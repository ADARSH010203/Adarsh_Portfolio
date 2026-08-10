'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronDown, ChevronUp, Star, GitFork, Clock } from 'lucide-react';
import TiltCard from './TiltCard';

const featuredProjects = [
  {
    title: 'BrainWeave ARC',
    subtitle: 'Multi-Agent AI Research Copilot',
    period: 'Dec 2025 – Apr 2026',
    color: '#00f0ff',
    tech: ['Python', 'FastAPI', 'MongoDB', 'Redis', 'FAISS', 'Docker'],
    description: 'Engineered a multi-agent AI research copilot featuring seven specialized agents for planning, research, coding, validation, repair, and report generation.',
    highlights: [
      'Designed end-to-end RAG pipeline with PDF/DOCX ingestion, semantic chunking, Sentence Transformers, and FAISS vector indexing.',
      'Integrated Groq LLaMA-3.3-70B for multi-agent reasoning with Redis caching that cut inference cost by 25%.',
      'Implemented real-time WebSockets, JWT auth, RBAC, delivering sub-200ms progress updates.',
    ],
    github: '#',
    live: '#',
  },
  {
    title: 'Neuro',
    subtitle: 'Multilingual Conversational AI Platform',
    period: 'May 2025 – Oct 2025',
    color: '#8b5cf6',
    tech: ['React.js', 'FastAPI', 'MongoDB', 'LangChain', 'Groq', 'Hugging Face'],
    description: 'Built a multilingual conversational platform featuring 9 specialized AI chatbots supporting real-time text and voice interaction.',
    highlights: [
      'Implemented Speech-to-Text and Text-to-Speech pipelines enabling real-time voice conversations.',
      'Developed secure dual-mode authentication using facial recognition and email-based login.',
      'Integrated LangChain, Groq, and Hugging Face for context-aware conversations with sub-second AI inference.',
    ],
    github: '#',
    live: '#',
  },
];

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Rust: '#DEA584',
  Go: '#00ADD8',
  Java: '#B07219',
  'C++': '#F34B7D',
  C: '#555555',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Shell: '#89E051',
  Dart: '#00B4AB',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Ruby: '#701516',
  PHP: '#4F5D95',
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (years > 0) return `${years}y ago`;
  if (months > 0) return `${months}mo ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

function FeaturedCard({ project, index }: { project: (typeof featuredProjects)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <TiltCard>
        <div
          className="glass-card rounded-2xl overflow-hidden neon-border group"
          style={{ '--glow-color': project.color } as React.CSSProperties}
        >
          <div className="h-1" style={{ background: `linear-gradient(90deg, ${project.color}, transparent)` }} />
          <div className="p-6 sm:p-8">
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
                <a href={project.github} className="text-slate-500 hover:text-white transition-colors">
                  <Github size={18} />
                </a>
                <a href={project.live} className="text-slate-500 hover:text-[#00f0ff] transition-colors">
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

function GitHubRepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || '#8b8b8b' : null;

  return (
    <motion.a
      ref={ref}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card rounded-xl p-5 group block hover:shadow-[0_0_25px_rgba(0,240,255,0.08)] transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="text-base font-semibold text-white group-hover:text-[#00f0ff] transition-colors truncate">
          {repo.name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </h4>
        <Github size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0 mt-1" />
      </div>
      <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
        {repo.description || 'No description provided.'}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {repo.topics.slice(0, 3).map((topic) => (
          <span key={topic} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
            {topic}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-500">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor }} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && (
          <span className="flex items-center gap-1">
            <Star size={12} />
            {repo.stargazers_count}
          </span>
        )}
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <GitFork size={12} />
            {repo.forks_count}
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Clock size={12} />
          {timeAgo(repo.updated_at)}
        </span>
      </div>
    </motion.a>
  );
}

function GitHubSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
          <div className="h-4 bg-white/5 rounded w-3/4 mb-3" />
          <div className="h-3 bg-white/5 rounded w-full mb-2" />
          <div className="h-3 bg-white/5 rounded w-2/3 mb-4" />
          <div className="flex gap-2 mb-3">
            <div className="h-4 bg-white/5 rounded-full w-12" />
            <div className="h-4 bg-white/5 rounded-full w-10" />
          </div>
          <div className="flex gap-4">
            <div className="h-3 bg-white/5 rounded w-14" />
            <div className="h-3 bg-white/5 rounded w-10" />
            <div className="h-3 bg-white/5 rounded w-16 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchRepos() {
      try {
        const res = await fetch('/api/github');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: GitHubRepo[] = await res.json();
        if (!cancelled) {
          setRepos(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }
    fetchRepos();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#10b981] font-mono text-sm tracking-widest uppercase">What I&apos;ve Built</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#10b981] to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="space-y-8 mb-16">
          {featuredProjects.map((project, i) => (
            <FeaturedCard key={project.title} project={project} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <h3 className="text-lg font-mono text-slate-400 whitespace-nowrap">
              <Github size={16} className="inline mr-2 -mt-0.5" />
              More from GitHub
            </h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          <AnimatePresence mode="wait">
            {loading && <GitHubSkeleton key="skeleton" />}
            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-xl p-8 text-center"
              >
                <p className="text-slate-500 text-sm">Unable to load GitHub repositories at this time.</p>
                <a
                  href="https://github.com/adarshkumar-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-sm text-[#00f0ff] hover:underline"
                >
                  <Github size={14} /> Visit GitHub directly
                </a>
              </motion.div>
            )}
            {!loading && !error && repos.length > 0 && (
              <motion.div
                key="repos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {repos.map((repo, i) => (
                  <GitHubRepoCard key={repo.name} repo={repo} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
