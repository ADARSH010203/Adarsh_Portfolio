'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
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
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: langColor ?? '#8b8b8b' }}
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

function ArchitectureFlow({ items, accent }: { items: string[]; accent: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => (
        <div key={item} className="flex items-center gap-2">
          <span
            className="rounded-md border px-2.5 py-1 text-[11px] font-mono"
            style={{
              borderColor: `${accent}2b`,
              backgroundColor: `${accent}0b`,
              color: accent,
            }}
          >
            {item}
          </span>
          {index < items.length - 1 && (
            <span className="hidden text-slate-700 sm:inline">→</span>
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
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-950/55 backdrop-blur-xl"
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${study.accent}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ backgroundColor: `${study.accent}12`, opacity: 0.7 }}
      />

      <div className="relative p-6 sm:p-8">
        <div className="mb-7 flex items-start justify-between gap-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-slate-600">0{index + 1}</span>
              <span className="text-slate-700">/</span>
              <span
                className="rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em]"
                style={{
                  borderColor: `${study.accent}2b`,
                  backgroundColor: `${study.accent}0b`,
                  color: study.accent,
                }}
              >
                {study.category}
              </span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {study.displayName}
            </h3>
          </div>

          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${study.displayName} on GitHub`}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-slate-500 transition hover:border-white/20 hover:text-white"
          >
            <Github size={18} />
          </a>
        </div>

        <p className="max-w-4xl text-sm leading-7 text-slate-300 sm:text-[15px]">
          {study.summary}
        </p>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-500">
              <Network size={14} style={{ color: study.accent }} />
              Architecture snapshot
            </div>
            <ArchitectureFlow items={study.architecture} accent={study.accent} />
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-500">
              <ShieldCheck size={14} style={{ color: study.accent }} />
              Engineering signals
            </div>
            <ul className="space-y-2.5">
              {study.proof.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: study.accent }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {study.stack.map((item) => (
            <span
              key={item}
              className="rounded-md border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[11px] font-mono text-slate-400"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <ProjectMeta repo={repo} />
          <div className="flex flex-wrap gap-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition"
              style={{
                color: study.accent,
                backgroundColor: `${study.accent}0d`,
                border: `1px solid ${study.accent}25`,
              }}
            >
              Source code <ArrowUpRight size={14} />
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
              >
                Live project <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function RepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.a
      ref={ref}
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.28) }}
      className="group flex min-h-44 flex-col rounded-2xl border border-white/[0.07] bg-slate-950/45 p-5 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-slate-950/65"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-600">GitHub project</div>
          <h4 className="truncate font-semibold text-white transition-colors group-hover:text-cyan-300">
            {prettyName(repo.name)}
          </h4>
        </div>
        <ArrowUpRight size={15} className="mt-1 shrink-0 text-slate-700 transition group-hover:text-cyan-300" />
      </div>

      <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-500">
        {repo.description || 'Explore the repository for implementation details, experiments, and source code.'}
      </p>

      <div className="mt-auto">
        {repo.topics.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 3).map((topic) => (
              <span key={topic} className="rounded-md border border-white/[0.06] px-2 py-0.5 text-[10px] font-mono text-slate-600">
                {topic}
              </span>
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
        <div key={i} className="h-80 animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.02]" />
      ))}
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-100px' });
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
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300">
              <Sparkles size={12} /> Selected engineering work
            </span>
            <span className="text-xs font-mono text-slate-600">Real repositories • architecture-first</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                Systems I&apos;ve <span className="gradient-text">designed & built</span>
              </h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
                A recruiter-friendly view of my strongest work: what each system does, how the architecture is structured, and which engineering decisions are visible in the codebase.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-slate-950/45 p-5 backdrop-blur-lg">
              <div className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-slate-500">
                <Layers3 size={14} className="text-cyan-300" /> Engineering focus
              </div>
              <p className="text-sm leading-6 text-slate-400">
                Multi-agent orchestration, LLM evaluation, retrieval systems, backend architecture, real-time workflows, and production-oriented application design.
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <Skeleton key="loading" />
          ) : repos.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
            <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-6">
                {flagship.map(({ repo, study }, index) => (
                  <FlagshipCard key={study.repo} repo={repo} study={study} index={index} />
                ))}
              </div>

              {moreRepos.length > 0 && (
                <div className="mt-20">
                  <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-violet-300">More experiments & products</span>
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
                </div>
              )}

              <div className="mt-12 flex justify-center">
                <a
                  href="https://github.com/ADARSH010203?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/50 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-300/25 hover:text-cyan-300"
                >
                  <Github size={16} />
                  Explore all repositories
                  <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
