'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowUpRight,
  Clock,
  ExternalLink,
  Github,
  GitFork,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';

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

interface CaseStudy {
  repo: string;
  displayName: string;
  category: string;
  summary: string;
  architecture: string[];
  proof: string[];
  stack: string[];
  accent: string;
}

const FLAGSHIP_CASE_STUDIES: CaseStudy[] = [
  {
    repo: 'MCP_WITH_A2A',
    displayName: 'MCP + A2A Multi-Agent System',
    category: 'Agent Infrastructure',
    summary:
      'A modular multi-agent runtime that combines Agent-to-Agent communication with MCP tools, deterministic capability routing, dependency-aware planning, parallel specialist execution, and critic synthesis.',
    architecture: [
      'A2A JSON-RPC',
      'Capability Router',
      'Dependency Planner',
      '8 Specialists',
      'Critic Synthesis',
      'MCP Tool Server',
    ],
    proof: [
      'Deterministic agent selection',
      'Parallel dependency graph',
      'Streaming task updates',
    ],
    stack: ['Python', 'FastAPI', 'MCP', 'Groq', 'SSE', 'Docker'],
    accent: '#22d3ee',
  },
  {
    repo: 'BraneWaves',
    displayName: 'BrainWeave ARC',
    category: 'Agentic Research Platform',
    summary:
      'A full-stack research copilot built around a seven-agent DAG pipeline with retrieval-augmented knowledge, real-time execution telemetry, persistent state, authentication, caching, and exportable research outputs.',
    architecture: [
      'Next.js UI',
      'FastAPI',
      '7-Agent DAG',
      'RAG / FAISS',
      'Redis',
      'MongoDB',
    ],
    proof: [
      '7 specialized agents',
      'Live WebSocket telemetry',
      'PDF / DOCX / Markdown export',
    ],
    stack: ['Next.js', 'FastAPI', 'MongoDB', 'Redis', 'FAISS', 'Groq'],
    accent: '#a78bfa',
  },
  {
    repo: 'llm-code-generation-benchmark',
    displayName: 'LLM Code Generation Benchmark',
    category: 'AI Evaluation & Research',
    summary:
      'A repository-aware benchmark for comparing coding models under the same context and evaluation policy using retrieval, deterministic validation, isolated Docker execution, semantic judging, and bounded self-repair.',
    architecture: [
      'Repo Ingestion',
      'Task Retrieval',
      '2 LLMs',
      'Validation',
      'Docker Sandbox',
      'DeepEval',
      'Self-Repair',
    ],
    proof: [
      'Two model providers',
      'Network-isolated execution',
      'Bounded repair loop',
    ],
    stack: ['Python', 'Docker', 'DeepEval', 'Groq', 'OpenRouter', 'Streamlit'],
    accent: '#34d399',
  },
  {
    repo: 'Medivisit',
    displayName: 'MediVisit Pro',
    category: 'HealthTech Product System',
    summary:
      'A Flutter-based field operations platform for medical representatives with shared domain packages, doctor discovery, route planning, GPS-enforced visit logging, administrative workflows, and backend integrations.',
    architecture: [
      'Flutter MR App',
      'Shared Core',
      'Firebase',
      'Supabase Edge',
      'Geofencing',
      'Admin Web',
    ],
    proof: [
      '50 m GPS visit validation',
      'Mobile + web suite',
      'Clean architecture',
    ],
    stack: ['Flutter', 'GetX', 'Firebase', 'Supabase', 'OpenStreetMap'],
    accent: '#fbbf24',
  },
];

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
};

function prettyName(name: string) {
  return name.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function ProjectMeta({ repo }: { repo: GitHubRepo }) {
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || '#8b8b8b' : null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
      {repo.language && (
        <span className="flex items-center gap-1.5">
          <motion.span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: langColor ?? '#8b8b8b' }}
            animate={{ opacity: [0.55, 1, 0.55], scale: [0.9, 1.12, 0.9] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          {repo.language}
        </span>
      )}
      {repo.stargazers_count > 0 && (
        <span className="flex items-center gap-1">
          <Star size={12} /> {repo.stargazers_count}
        </span>
      )}
      {repo.forks_count > 0 && (
        <span className="flex items-center gap-1">
          <GitFork size={12} /> {repo.forks_count}
        </span>
      )}
      <span className="flex items-center gap-1">
        <Clock size={12} /> Updated {timeAgo(repo.updated_at)}
      </span>
    </div>
  );
}

function ArchitectureFlow({
  items,
  accent,
  active,
}: {
  items: string[];
  accent: string;
  active: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => (
        <div key={item} className="flex items-center gap-2">
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={active ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 0.38,
              delay: 0.2 + index * 0.09,
              type: 'spring',
              stiffness: 180,
              damping: 18,
            }}
            whileHover={reduceMotion ? undefined : { y: -2, scale: 1.04 }}
            className="rounded-md border px-2.5 py-1 text-[11px] font-mono"
            style={{
              borderColor: `${accent}2b`,
              backgroundColor: `${accent}0b`,
              color: accent,
            }}
          >
            {item}
          </motion.span>

          {index < items.length - 1 && (
            <motion.span
              className="relative hidden w-5 overflow-hidden text-center text-slate-700 sm:inline-block"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={active ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.28 + index * 0.09 }}
            >
              <span>→</span>
              {!reduceMotion && (
                <motion.span
                  className="absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full"
                  style={{ backgroundColor: accent }}
                  animate={{ x: [0, 16], opacity: [0, 0.9, 0] }}
                  transition={{
                    duration: 1.35,
                    repeat: Infinity,
                    delay: index * 0.18,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.span>
          )}
        </div>
      ))}
    </div>
  );
}

function FlagshipCard({
  repo,
  study,
  index,
}: {
  repo: GitHubRepo;
  study: CaseStudy;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-90px' });
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 58, scale: 0.975 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.68,
        delay: index * 0.11,
        type: 'spring',
        stiffness: 95,
        damping: 18,
      }}
      whileHover={reduceMotion ? undefined : { y: -7, scale: 1.004 }}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-950/55 backdrop-blur-xl"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${study.accent}, transparent)` }}
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.15 + index * 0.08 }}
      />

      <motion.div
        className="pointer-events-none absolute -top-20 h-40 w-1/3 -skew-x-12 blur-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${study.accent}16, transparent)` }}
        animate={
          reduceMotion
            ? undefined
            : { x: ['-140%', '420%'], opacity: [0, 0.7, 0] }
        }
        transition={{
          duration: 5.8,
          repeat: Infinity,
          repeatDelay: 2.4 + index * 0.5,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full blur-3xl"
        style={{ backgroundColor: `${study.accent}10` }}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -16, 0],
                y: [0, 12, 0],
                scale: [1, 1.08, 1],
                opacity: [0.45, 0.7, 0.45],
              }
        }
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative p-6 sm:p-8">
        <div className="mb-7 flex items-start justify-between gap-5">
          <div>
            <motion.div
              className="mb-3 flex flex-wrap items-center gap-2"
              initial={{ opacity: 0, x: -14 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.42, delay: 0.14 + index * 0.08 }}
            >
              <span className="font-mono text-xs text-slate-600">0{index + 1}</span>
              <span className="text-slate-700">/</span>
              <motion.span
                className="rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em]"
                style={{
                  borderColor: `${study.accent}2b`,
                  backgroundColor: `${study.accent}0b`,
                  color: study.accent,
                }}
                animate={
                  reduceMotion
                    ? undefined
                    : { y: [0, -2, 0], boxShadow: [`0 0 0 ${study.accent}00`, `0 0 18px ${study.accent}18`, `0 0 0 ${study.accent}00`] }
                }
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {study.category}
              </motion.span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
              className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              {study.displayName}
            </motion.h3>
          </div>

          <motion.a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${study.displayName} on GitHub`}
            whileHover={reduceMotion ? undefined : { scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.94 }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-slate-500 transition-colors hover:border-white/20 hover:text-white"
          >
            <Github size={18} />
          </motion.a>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.48, delay: 0.28 + index * 0.08 }}
          className="max-w-4xl text-sm leading-7 text-slate-300 sm:text-[15px]"
        >
          {study.summary}
        </motion.p>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.34 + index * 0.08 }}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            className="rounded-2xl border border-white/[0.06] bg-black/20 p-4 sm:p-5"
          >
            <div className="mb-4 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-500">
              <motion.span
                animate={reduceMotion ? undefined : { rotate: [0, 8, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Network size={14} style={{ color: study.accent }} />
              </motion.span>
              Architecture snapshot
            </div>
            <ArchitectureFlow items={study.architecture} accent={study.accent} active={inView} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 22 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.08 }}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            className="rounded-2xl border border-white/[0.06] bg-black/20 p-4 sm:p-5"
          >
            <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-500">
              <ShieldCheck size={14} style={{ color: study.accent }} />
              Engineering signals
            </div>
            <ul className="space-y-2.5">
              {study.proof.map((item, proofIndex) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.52 + proofIndex * 0.08 + index * 0.06 }}
                  className="flex items-start gap-2 text-sm text-slate-400"
                >
                  <motion.span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: study.accent }}
                    animate={reduceMotion ? undefined : { scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: proofIndex * 0.25 }}
                  />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.055, delayChildren: 0.55 } },
          }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {study.stack.map((item) => (
            <motion.span
              key={item}
              variants={{
                hidden: { opacity: 0, y: 8, scale: 0.94 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.04 }}
              className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[11px] font-mono text-slate-400"
            >
              {item}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.65 + index * 0.06 }}
          className="mt-7 flex flex-col gap-4 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <ProjectMeta repo={repo} />
          <div className="flex flex-wrap gap-2">
            <motion.a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium"
              style={{
                color: study.accent,
                backgroundColor: `${study.accent}0d`,
                border: `1px solid ${study.accent}25`,
              }}
            >
              Source code
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </motion.a>

            {repo.homepage && (
              <motion.a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-white/20 hover:text-white"
              >
                Live project
                <ExternalLink size={14} className="transition-transform duration-300 group-hover:scale-110" />
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}

function RepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      ref={ref}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.46,
        delay: Math.min(index * 0.055, 0.38),
        type: 'spring',
        stiffness: 125,
        damping: 18,
      }}
      whileHover={reduceMotion ? undefined : { y: -7, scale: 1.012 }}
      className="group relative flex min-h-44 flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-950/45 p-5 backdrop-blur-lg transition-colors duration-300 hover:border-cyan-300/20 hover:bg-slate-950/65"
    >
      <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/3 rotate-12 bg-gradient-to-r from-transparent via-cyan-200/[0.035] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[460%]" />

      <div className="relative mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <motion.div
            className="mb-1 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-600"
            animate={reduceMotion ? undefined : { opacity: [0.55, 0.9, 0.55] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.12 }}
          >
            GitHub project
          </motion.div>
          <h4 className="truncate font-semibold text-white transition-colors group-hover:text-cyan-300">
            {prettyName(repo.name)}
          </h4>
        </div>
        <ArrowUpRight size={15} className="mt-1 shrink-0 text-slate-700 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan-300" />
      </div>

      <p className="relative mb-5 line-clamp-3 text-sm leading-6 text-slate-500">
        {repo.description || 'Explore the repository for implementation details, experiments, and source code.'}
      </p>

      <div className="relative mt-auto">
        {repo.topics.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 3).map((topic, topicIndex) => (
              <motion.span
                key={topic}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.18 + index * 0.03 + topicIndex * 0.05 }}
                className="rounded-md border border-white/[0.06] px-2 py-0.5 text-[10px] font-mono text-slate-600"
              >
                {topic}
              </motion.span>
            ))}
          </div>
        )}
        <ProjectMeta repo={repo} />
      </div>
    </motion.a>
  );
}

function Skeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="h-80 rounded-3xl border border-white/[0.06] bg-white/[0.02]"
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const reduceMotion = useReducedMotion();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/github')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: GitHubRepo[]) => {
        if (!cancelled) setRepos(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setRepos([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const flagship = useMemo(() => {
    const repoMap = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]));
    return FLAGSHIP_CASE_STUDIES.map((study) => ({
      study,
      repo: repoMap.get(study.repo.toLowerCase()),
    })).filter((item): item is { study: CaseStudy; repo: GitHubRepo } => Boolean(item.repo));
  }, [repos]);

  const flagshipNames = useMemo(
    () => new Set(FLAGSHIP_CASE_STUDIES.map((study) => study.repo.toLowerCase())),
    []
  );

  const moreRepos = useMemo(
    () => repos.filter((repo) => !flagshipNames.has(repo.name.toLowerCase())).slice(0, 12),
    [repos, flagshipNames]
  );

  return (
    <section id="projects" className="relative overflow-hidden py-24 sm:py-32">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-20 h-80 w-80 rounded-full bg-cyan-500/[0.035] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 70, 0], y: [0, 35, 0], scale: [1, 1.12, 1] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-52 top-[34%] h-96 w-96 rounded-full bg-violet-500/[0.035] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -60, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 42 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.68, type: 'spring', stiffness: 95, damping: 18 }}
          className="mb-14"
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300"
              animate={
                reduceMotion
                  ? undefined
                  : { y: [0, -3, 0], boxShadow: ['0 0 0 rgba(52,211,153,0)', '0 0 22px rgba(52,211,153,0.08)', '0 0 0 rgba(52,211,153,0)'] }
              }
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={12} /> Selected engineering work
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={sectionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.18, duration: 0.42 }}
              className="text-xs font-mono text-slate-600"
            >
              Real repositories • architecture-first
            </motion.span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.12, duration: 0.52 }}
                className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
              >
                Systems I&apos;ve <span className="gradient-text">designed & built</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.22, duration: 0.48 }}
                className="mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base"
              >
                A recruiter-friendly view of my strongest work: what each system does, how the architecture is structured, and which engineering decisions are visible in the codebase.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.97 }}
              animate={sectionInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ delay: 0.24, duration: 0.55, type: 'spring', stiffness: 110, damping: 18 }}
              whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-slate-950/45 p-5 backdrop-blur-lg"
            >
              <motion.div
                className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-300/60 to-transparent"
                animate={reduceMotion ? undefined : { opacity: [0.25, 0.9, 0.25] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-500">
                <motion.span
                  animate={reduceMotion ? undefined : { rotate: [0, 6, -6, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Layers3 size={14} className="text-cyan-300" />
                </motion.span>
                Engineering focus
              </div>
              <p className="text-sm leading-6 text-slate-400">
                Multi-agent orchestration, LLM evaluation, retrieval systems, backend architecture, real-time workflows, and production-oriented application design.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="mt-8 h-px w-full overflow-hidden bg-white/[0.04]"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={sectionInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            {!reduceMotion && (
              <motion.div
                className="h-full w-24 bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent"
                animate={{ x: ['-120%', '1200%'] }}
                transition={{ duration: 5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
              />
            )}
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <Skeleton key="loading" />
          ) : repos.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="rounded-2xl border border-white/10 bg-slate-950/55 p-10 text-center"
            >
              <p className="text-slate-400">GitHub projects are temporarily unavailable.</p>
              <a
                href="https://github.com/ADARSH010203"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-300 hover:underline"
              >
                <Github size={15} /> Open GitHub profile
              </a>
            </motion.div>
          ) : (
            <motion.div
              key="projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="space-y-6">
                {flagship.map(({ repo, study }, index) => (
                  <FlagshipCard key={study.repo} repo={repo} study={study} index={index} />
                ))}
              </div>

              {moreRepos.length > 0 && (
                <motion.div
                  className="mt-20"
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-90px' }}
                  transition={{ duration: 0.58 }}
                >
                  <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <motion.span
                        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-violet-300"
                        animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Zap size={12} /> More experiments & products
                      </motion.span>
                      <h3 className="mt-2 text-2xl font-bold text-white">Selected GitHub repositories</h3>
                    </div>
                    <p className="max-w-lg text-sm leading-6 text-slate-500">
                      Additional ML, AI, data, application, and engineering work pulled directly from my public GitHub profile.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {moreRepos.map((repo, index) => (
                      <RepoCard key={repo.name} repo={repo} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                className="mt-12 flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
              >
                <motion.a
                  href="https://github.com/ADARSH010203?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={reduceMotion ? undefined : { y: -3, scale: 1.025 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/50 px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-cyan-300/25 hover:text-cyan-300"
                >
                  <motion.span
                    animate={reduceMotion ? undefined : { rotate: [0, 6, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Github size={16} />
                  </motion.span>
                  Explore all repositories
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
