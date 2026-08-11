'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface SkillCategory {
  title: string;
  color: string;
  skills: string[];
  percentages: number[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    color: '#00f0ff',
    skills: ['Python', 'Java', 'TypeScript', 'SQL','Dart'],
    percentages: [95, 65, 75, 80],
  },
  {
    title: 'AI / ML & GenAI',
    color: '#8b5cf6',
    skills: ['Machine Learning', 'Deep Learning', 'Generative AI', 'Agentic AI', 'NLP', 'RAG', 'LLMs', 'Prompt Engineering','Agent RAG','GraphRag'],
    percentages: [88, 82, 92, 90, 85, 95, 93, 88,70,60],
  },
  {
    title: 'Frameworks',
    color: '#f59e0b',
    skills: ['FastAPI', 'Hugging Face', 'PyTorch', 'Scikit-learn', 'Pandas','Seaborn', 'NumPy', 'LangChain', 'LangGraph', 'MCP', 'A2A', 'ChromaDB', 'CrewAI', 'Phidata'],
    percentages: [92, 88, 85, 82, 90, 88, 95, 88, 80,80, 78, 85, 82, 80],
  },
  {
    title: 'Databases & Tools',
    color: '#10b981',
    skills: ['MongoDB', 'Redis', 'Supabase', 'Docker', 'Git/GitHub', 'CI/CD'],
    percentages: [88, 75, 72, 80, 90, 78],
  },
  {
    title: 'Architecture & Protocols',
    color: '#f43f5e',
    skills: ['REST APIs', 'JWT Auth', 'OAuth 2.0', 'WebSockets', 'Socket.io', 'Kafka', 'RabbitMQ', 'Microservices', 'OpenAPI', 'Groq API'],
    percentages: [92, 85, 80, 78, 82, 72, 70, 80, 85, 90],
  },
];

// Top skills for radial progress indicators
const topSkills = [
  { name: 'Python', pct: 95, color: '#00f0ff' },
  { name: 'RAG', pct: 95, color: '#8b5cf6' },
  { name: 'LangChain', pct: 95, color: '#f59e0b' },
  { name: 'LLMs', pct: 93, color: '#10b981' },
  { name: 'REST APIs', pct: 92, color: '#f43f5e' },
];

function RadialProgress({ pct, color, name, delay }: { pct: number; color: string; name: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / 2000, 1);
      setCount(Math.floor(progress * pct));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, pct]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, type: 'spring' }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <motion.circle
            cx="40" cy="40" r={radius} fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 2, delay, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm sm:text-base font-bold text-white tabular-nums">{count}%</span>
        </div>
      </div>
      <span className="text-xs font-mono" style={{ color }}>{name}</span>
    </motion.div>
  );
}

function SkillPill({ name, color, index }: { name: string; color: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.15;
    const dy = (e.clientY - cy) * 0.15;
    setPos({ x: dx, y: dy });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.3, delay: index * 0.03, type: 'spring', stiffness: 200 }}
      whileHover={{
        scale: 1.1,
        boxShadow: `0 0 20px ${color}33`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block px-3 py-1.5 text-xs sm:text-sm font-mono rounded-lg border cursor-default transition-all duration-200"
      style={{
        borderColor: `${color}33`,
        backgroundColor: `${color}08`,
        color: color,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
    >
      {name}
    </motion.span>
  );
}

function SkillBar({ label, pct, color, delay }: { label: string; pct: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-3"
    >
      <span className="text-xs font-mono text-slate-400 w-28 sm:w-36 text-right truncate flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/[0.03] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 10px ${color}44`,
          }}
        />
      </div>
      <span className="text-xs font-mono tabular-nums w-10 text-slate-500">{pct}%</span>
    </motion.div>
  );
}

function CategoryCard({ category, index, searchQuery }: { category: SkillCategory; index: number; searchQuery: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [isExpanded, setIsExpanded] = useState(false);
  const filteredSkills = searchQuery
    ? category.skills.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : category.skills;
  const filteredPcts = searchQuery
    ? category.skills.map((s, i) => ({ s, p: category.percentages[i] })).filter(x => x.s.toLowerCase().includes(searchQuery.toLowerCase())).map(x => x.p)
    : category.percentages;
  const maxVisible = 8;
  const visibleSkills = isExpanded ? filteredSkills : filteredSkills.slice(0, maxVisible);
  const visiblePcts = isExpanded ? filteredPcts : filteredPcts.slice(0, maxVisible);
  const hasMore = filteredSkills.length > maxVisible;

  if (searchQuery && filteredSkills.length === 0) return null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card rounded-2xl p-5 sm:p-6 neon-border"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: category.color, boxShadow: `0 0 10px ${category.color}` }}
        />
        <h3 className="text-lg font-semibold text-white">{category.title}</h3>
        <span className="ml-auto text-xs font-mono text-slate-500">{filteredSkills.length}</span>
      </div>

      {/* Animated skill bars for top skills in category */}
      <div className="mb-4 space-y-2">
        {visibleSkills.slice(0, 3).map((skill, i) => (
          <SkillBar key={skill} label={skill} pct={visiblePcts[i]} color={category.color} delay={index * 0.1 + i * 0.05} />
        ))}
      </div>

      {/* Pills for all skills */}
      <div className="flex flex-wrap gap-2">
        {visibleSkills.map((skill, i) => (
          <SkillPill key={skill} name={skill} color={category.color} index={i} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-xs font-mono flex items-center gap-1 transition-colors"
          style={{ color: category.color }}
        >
          {isExpanded ? (
            <>Show less <ChevronUp size={12} /></>
          ) : (
            <>+{filteredSkills.length - maxVisible} more <ChevronDown size={12} /></>
          )}
        </button>
      )}
    </motion.div>
  );
}

function SkillParticles() {
  // Deterministic particle positions to avoid hydration mismatch
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: ((i * 37 + 13) % 97) + 1.5,
    y: ((i * 53 + 7) % 93) + 3.5,
    size: 1 + (i % 3) * 0.7,
    duration: 8 + (i % 5) * 2.4,
    delay: (i % 7) * 0.7,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll
    ? skillCategories
    : skillCategories.slice(0, 3);

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <SkillParticles />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[#8b5cf6] font-mono text-sm tracking-widest uppercase">Technical Arsenal</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Radial progress indicators for top skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-12"
        >
          {topSkills.map((s, i) => (
            <RadialProgress key={s.name} pct={s.pct} color={s.color} name={s.name} delay={0.3 + i * 0.15} />
          ))}
        </motion.div>

        {/* Search / filter input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-md mx-auto mb-8"
        >
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-1 focus:ring-[#8b5cf6]/20 transition-all"
            />
          </div>
        </motion.div>

        {/* Skill categories grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleCategories.map((cat, i) => (
              <CategoryCard key={cat.title} category={cat} index={i} searchQuery={searchQuery} />
            ))}
          </AnimatePresence>
        </div>

        {/* View All toggle */}
        <AnimatePresence>
          {!showAll && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center mt-8"
            >
              <button
                onClick={() => setShowAll(true)}
                className="px-6 py-2.5 rounded-xl text-sm font-mono text-[#8b5cf6] border border-[#8b5cf6]/30 hover:bg-[#8b5cf6]/10 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <ChevronDown size={16} />
                View All Categories
              </button>
            </motion.div>
          )}
          {showAll && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center mt-8"
            >
              <button
                onClick={() => setShowAll(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-mono text-slate-400 border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <ChevronUp size={16} />
                Show Less
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
