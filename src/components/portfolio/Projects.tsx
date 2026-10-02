'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Star, GitFork, Clock } from 'lucide-react';
import TiltCard from './TiltCard';

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

const FEATURED_ORDER = [
  'MCP_WITH_A2A',
  'BraneWaves',
  'Medivisit',
  'SmartMinds',
  'MachineLearningTask',
  'LearnAI',
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
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
      {repo.language && (
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor ?? '#8b8b8b' }} />
          {repo.language}
        </span>
      )}
      {repo.stargazers_count > 0 && (
        <span className="flex items-center gap-1"><Star size={12} />{repo.stargazers_count}</span>
      )}
      {repo.forks_count > 0 && (
        <span className="flex items-center gap-1"><GitFork size={12} />{repo.forks_count}</span>
      )}
      <span className="flex items-center gap-1"><Clock size={12} />{timeAgo(repo.updated_at)}</span>
    </div>
  );
}

function FeaturedRepoCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08 }}
    >
      <TiltCard>
        <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/25 hover:bg-white/[0.055] hover:shadow-[0_0_50px_rgba(0,240,255,0.06)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <span className="mb-2 inline-flex rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-300">
                Featured GitHub Project
              </span>
              <h3 className="text-2xl font-bold text-white transition-colors group-hover:text-cyan-300">
                {prettyName(repo.name)}
              </h3>
            </div>
            <Github className="mt-1 shrink-0 text-slate-600 transition-colors group-hover:text-slate-300" size={20} />
          </div>

          <p className="mb-5 min-h-[3rem] leading-relaxed text-slate-400">
            {repo.description || 'Explore the source code, architecture, experiments, and implementation details directly on GitHub.'}
          </p>

          {repo.topics.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {repo.topics.slice(0, 5).map((topic) => (
                <span key={topic} className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-mono text-slate-400">
                  {topic}
                </span>
              ))}
            </div>
          )}

          <div className="mb-5"><ProjectMeta repo={repo} /></div>

          <div className="flex flex-wrap gap-3">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-300/[0.11]"
            >
              <Github size={15} /> View Repository
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                <ExternalLink size={15} /> Live Project
              </a>
            )}
          </div>
        </article>
      </TiltCard>
    </motion.div>
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
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.32) }}
      className="group block rounded-xl border border-white/[0.07] bg-white/[0.025] p-5 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.045]"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <h4 className="truncate font-semibold text-white transition-colors group-hover:text-violet-300">
          {prettyName(repo.name)}
        </h4>
        <Github size={14} className="mt-1 shrink-0 text-slate-600 group-hover:text-slate-400" />
      </div>
      <p className="mb-4 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-slate-500">
        {repo.description || 'GitHub project by Adarsh Kumar.'}
      </p>
      <ProjectMeta repo={repo} />
    </motion.a>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.025]" />
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

    return () => { cancelled = true; };
  }, []);

  const featured = useMemo(() => {
    const byName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]));
    const preferred = FEATURED_ORDER
      .map((name) => byName.get(name.toLowerCase()))
      .filter((repo): repo is GitHubRepo => Boolean(repo));

    const fallback = repos.filter((repo) => !preferred.some((p) => p.name === repo.name));
    return [...preferred, ...fallback].slice(0, 4);
  }, [repos]);

  const moreRepos = useMemo(
    () => repos.filter((repo) => !featured.some((item) => item.name === repo.name)).slice(0, 12),
    [repos, featured]
  );

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" ref={sectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span className="font-mono text-sm uppercase tracking-widest text-emerald-400">Built in public</span>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Projects from <span className="gradient-text">My GitHub</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            This section is generated from my real public GitHub repositories, so the portfolio stays aligned with what I actually build and maintain.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <Skeleton key="loading" />
          ) : repos.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <p className="text-slate-400">GitHub projects are temporarily unavailable.</p>
              <a href="https://github.com/ADARSH010203" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-300 hover:underline">
                <Github size={15} /> Open GitHub profile
              </a>
            </motion.div>
          ) : (
            <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
                {featured.map((repo, i) => <FeaturedRepoCard key={repo.name} repo={repo} index={i} />)}
              </div>

              {moreRepos.length > 0 && (
                <>
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                    <h3 className="whitespace-nowrap font-mono text-sm text-slate-500">
                      <Github size={15} className="mr-2 inline -mt-0.5" /> More from GitHub
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {moreRepos.map((repo, i) => <RepoCard key={repo.name} repo={repo} index={i} />)}
                  </div>
                </>
              )}

              <div className="mt-10 text-center">
                <a href="https://github.com/ADARSH010203?tab=repositories" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-slate-300 transition hover:border-cyan-300/20 hover:text-cyan-300">
                  <Github size={16} /> View all repositories
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
