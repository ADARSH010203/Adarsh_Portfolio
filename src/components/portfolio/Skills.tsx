'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface SkillCategory {
  title: string;
  color: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    color: '#00f0ff',
    skills: ['Python', 'Java', 'TypeScript', 'SQL'],
  },
  {
    title: 'AI / ML & GenAI',
    color: '#8b5cf6',
    skills: ['Machine Learning', 'Deep Learning', 'Generative AI', 'Agentic AI', 'NLP', 'RAG', 'LLMs', 'Prompt Engineering'],
  },
  {
    title: 'Frameworks',
    color: '#f59e0b',
    skills: ['FastAPI', 'Hugging Face', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'LangChain', 'LangGraph', 'MCP', 'A2A', 'ChromaDB', 'CrewAI', 'Phidata'],
  },
  {
    title: 'Databases & Tools',
    color: '#10b981',
    skills: ['MongoDB', 'Redis', 'Supabase', 'Docker', 'Git/GitHub', 'CI/CD'],
  },
  {
    title: 'Architecture & Protocols',
    color: '#f43f5e',
    skills: ['REST APIs', 'JWT Auth', 'OAuth 2.0', 'WebSockets', 'Socket.io', 'Kafka', 'RabbitMQ', 'Microservices', 'OpenAPI', 'Groq API'],
  },
];

function SkillPill({ name, color, index }: { name: string; color: string; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

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
      className="inline-block px-3 py-1.5 text-xs sm:text-sm font-mono rounded-lg border cursor-default transition-all duration-300"
      style={{
        borderColor: `${color}33`,
        backgroundColor: `${color}08`,
        color: color,
      }}
    >
      {name}
    </motion.span>
  );
}

function CategoryCard({ category, index }: { category: SkillCategory; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [isExpanded, setIsExpanded] = useState(false);
  const maxVisible = 8;
  const visibleSkills = isExpanded ? category.skills : category.skills.slice(0, maxVisible);
  const hasMore = category.skills.length > maxVisible;

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
        <span className="ml-auto text-xs font-mono text-slate-500">{category.skills.length}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {visibleSkills.map((skill, i) => (
          <SkillPill key={skill} name={skill} color={category.color} index={i} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-xs font-mono transition-colors"
          style={{ color: category.color }}
        >
          {isExpanded ? 'Show less' : `+${category.skills.length - maxVisible} more`}
        </button>
      )}
    </motion.div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#8b5cf6] font-mono text-sm tracking-widest uppercase">Technical Arsenal</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, i) => (
            <CategoryCard key={cat.title} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
