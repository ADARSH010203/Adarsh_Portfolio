'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface CodeTab {
  id: string;
  label: string;
  filename: string;
  language: string;
  code: string;
}

const codeTabs: CodeTab[] = [
  {
    id: 'rag',
    label: 'RAG Pipeline',
    filename: 'rag_engine.py',
    language: 'Python',
    code: `# RAG Pipeline with Semantic Chunking & FAISS
from sentence_transformers import SentenceTransformer
from faiss import IndexFlatIP
import numpy as np

class RAGEngine:
    """Production RAG pipeline with semantic retrieval."""

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.encoder = SentenceTransformer(model_name)
        self.dimension = self.encoder.get_sentence_embedding_dimension()
        self.index = IndexFlatIP(self.dimension)
        self.chunks: list[dict] = []
        self.metadata: list[dict] = []

    def ingest_documents(self, docs: list[dict]) -> None:
        """Ingest documents with semantic chunking."""
        all_chunks, all_meta = [], []
        for doc in docs:
            chunks = self._semantic_chunk(doc["text"], max_tokens=512)
            for i, chunk in enumerate(chunks):
                all_chunks.append(chunk)
                all_meta.append({"source": doc["name"], "chunk_id": i})

        embeddings = self.encoder.encode(all_chunks, normalize_embeddings=True)
        self.index.add(np.ascontiguousarray(embeddings, dtype=np.float32))
        self.chunks = all_chunks
        self.metadata = all_meta

    def retrieve(self, query: str, top_k: int = 5) -> list[dict]:
        """Retrieve most relevant chunks for a query."""
        q_vec = self.encoder.encode([query], normalize_embeddings=True)
        distances, indices = self.index.search(
            np.ascontiguousarray(q_vec, dtype=np.float32), top_k
        )
        return [
            {"chunk": self.chunks[i], "score": float(d), **self.metadata[i]}
            for i, d in zip(indices[0], distances[0]) if i >= 0
        ]

    def _semantic_chunk(self, text: str, max_tokens: int) -> list[str]:
        sentences = [s.strip() for s in text.split(".") if s.strip()]
        chunks, current = [], []
        token_count = 0
        for sent in sentences:
            tokens = len(sent.split())
            if token_count + tokens > max_tokens and current:
                chunks.append(". ".join(current) + ".")
                current, token_count = [], 0
            current.append(sent)
            token_count += tokens
        if current:
            chunks.append(". ".join(current) + ".")
        return chunks`,
  },
  {
    id: 'api',
    label: 'API Design',
    filename: 'agents/router.py',
    language: 'Python',
    code: `# FastAPI Agent Router with WebSocket support
from fastapi import APIRouter, HTTPException, WebSocket, Depends
from pydantic import BaseModel, Field
from typing import Optional
import json

router = APIRouter(prefix="/api/v1/agents", tags=["agents"])

class AgentRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=4096)
    agent_type: str = Field(default="researcher")
    session_id: Optional[str] = None
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)

@router.post("/invoke")
async def invoke_agent(payload: AgentRequest):
    """Route request to the appropriate specialized agent."""
    try:
        agent = AgentRegistry.get(payload.agent_type)
        if not agent:
            raise HTTPException(status_code=404, detail=f"Unknown agent: {payload.agent_type}")

        context = await agent.build_context(payload.query, payload.session_id)
        response = await agent.run(
            query=payload.query,
            context=context,
            temperature=payload.temperature,
        )
        return {
            "status": "success",
            "agent": payload.agent_type,
            "response": response,
            "tokens_used": response.usage.total_tokens,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/ws/stream")
async def stream_agent(ws: WebSocket):
    """Stream agent responses in real-time via WebSocket."""
    await ws.accept()
    while True:
        data = json.loads(await ws.receive_text())
        agent = AgentRegistry.get(data.get("agent_type", "researcher"))
        async for token in agent.stream(data["query"]):
            await ws.send_json({"type": "token", "content": token})
        await ws.send_json({"type": "done"})`,
  },
  {
    id: 'agent',
    label: 'Agent System',
    filename: 'multi_agent/orchestrator.py',
    language: 'Python',
    code: `# Multi-Agent Orchestrator with Collaborative Reasoning
from dataclasses import dataclass, field
from typing import Protocol, runtime_checkable
from enum import Enum
import asyncio

class Role(Enum):
    PLANNER = "planner"
    RESEARCHER = "researcher"
    CODER = "coder"
    REVIEWER = "reviewer"

@runtime_checkable
class Agent(Protocol):
    role: Role
    async def execute(self, task: str, context: dict) -> dict: ...

@dataclass
class TaskResult:
    agent_role: str
    output: dict
    confidence: float
    token_usage: int = 0

@dataclass
class Orchestrator:
    agents: list[Agent] = field(default_factory=list)
    max_rounds: int = 5

    def register(self, agent: Agent) -> None:
        self.agents.append(agent)

    async def run_pipeline(self, query: str) -> dict:
        """Execute multi-agent collaborative pipeline."""
        context = {"original_query": query, "history": []}

        # Phase 1: Plan the approach
        planner = self._get_agent(Role.PLANNER)
        plan = await planner.execute(query, context)
        context["plan"] = plan["steps"]

        # Phase 2: Execute each step with specialized agents
        results: list[TaskResult] = []
        for step in plan["steps"]:
            agent = self._get_agent(Role(step["assigned_to"]))
            result = await agent.execute(step["task"], context)
            results.append(TaskResult(
                agent_role=step["assigned_to"],
                output=result,
                confidence=step.get("confidence", 0.0),
            ))
            context["history"].append(result)

        # Phase 3: Review and refine
        reviewer = self._get_agent(Role.REVIEWER)
        review = await reviewer.execute(query, {"results": results})
        return {"plan": plan, "results": results, "review": review}

    def _get_agent(self, role: Role) -> Agent:
        return next(a for a in self.agents if a.role == role)`,
  },
];

/* ---------- Token-based syntax highlighting ---------- */

// Tokenize a line into segments: [{ type, text }]
function tokenizeLine(line: string): { type: string; text: string }[] {
  const tokens: { type: string; text: string }[] = [];
  let i = 0;

  while (i < line.length) {
    // Whitespace
    if (line[i] === ' ' || line[i] === '\t') {
      let start = i;
      while (i < line.length && (line[i] === ' ' || line[i] === '\t')) i++;
      tokens.push({ type: 'plain', text: line.slice(start, i) });
      continue;
    }

    // Comment (# to end of line) — only at start or after whitespace
    if (line[i] === '#' && (tokens.length === 0 || tokens[tokens.length - 1].type === 'plain')) {
      tokens.push({ type: 'comment', text: line.slice(i) });
      break;
    }

    // Triple-quoted string
    if (line.slice(i, i + 3) === '"""') {
      let end = line.indexOf('"""', i + 3);
      if (end === -1) end = line.length - 3;
      tokens.push({ type: 'string', text: line.slice(i, end + 3) });
      i = end + 3;
      continue;
    }

    // f-string or regular string (double-quoted)
    if (line[i] === '"' || line.slice(i, i + 2) === 'f"') {
      const isF = line[i] === 'f';
      const startQuote = i + (isF ? 1 : 0);
      let j = startQuote + 1;
      while (j < line.length && line[j] !== '"') {
        if (line[j] === '\\') j++; // skip escaped char
        j++;
      }
      tokens.push({ type: 'string', text: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // Single-quoted string
    if (line[i] === "'" || line.slice(i, i + 2) === "f'") {
      const isF = line[i] === 'f';
      const startQuote = i + (isF ? 1 : 0);
      let j = startQuote + 1;
      while (j < line.length && line[j] !== "'") {
        if (line[j] === '\\') j++;
        j++;
      }
      tokens.push({ type: 'string', text: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // Decorator
    if (line[i] === '@' && (i === 0 || line[i - 1] === ' ' || line[i - 1] === '\t')) {
      let j = i + 1;
      while (j < line.length && /[\w.]/.test(line[j])) j++;
      tokens.push({ type: 'decorator', text: line.slice(i, j) });
      i = j;
      continue;
    }

    // Number
    if (/[\d]/.test(line[i]) && (i === 0 || !/[\w]/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[\d.]/.test(line[j])) j++;
      tokens.push({ type: 'number', text: line.slice(i, j) });
      i = j;
      continue;
    }

    // Word (identifier / keyword / builtin)
    if (/[\w]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[\w]/.test(line[j])) j++;
      const word = line.slice(i, j);

      const keywords = new Set([
        'from', 'import', 'class', 'def', 'async', 'await', 'return',
        'if', 'else', 'elif', 'for', 'while', 'in', 'not', 'and', 'or',
        'with', 'as', 'try', 'except', 'raise', 'yield', 'lambda',
        'True', 'False', 'None', 'self', 'pass', 'break', 'continue',
        'is', 'del', 'global', 'nonlocal', 'assert',
      ]);

      const builtins = new Set([
        'print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict',
        'set', 'tuple', 'type', 'isinstance', 'hasattr', 'getattr',
        'next', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'super',
      ]);

      if (word === 'def' || word === 'class') {
        // Consume the name after def/class
        tokens.push({ type: 'keyword', text: word });
        let k = j;
        while (k < line.length && line[k] === ' ') k++;
        let nameStart = k;
        while (k < line.length && /[\w]/.test(line[k])) k++;
        if (k > nameStart) {
          tokens.push({ type: 'plain', text: line.slice(j, nameStart) });
          tokens.push({ type: 'function', text: line.slice(nameStart, k) });
        } else {
          tokens.push({ type: 'plain', text: line.slice(j, k) });
        }
        i = k;
      } else if (keywords.has(word)) {
        tokens.push({ type: 'keyword', text: word });
        i = j;
      } else if (builtins.has(word)) {
        tokens.push({ type: 'builtin', text: word });
        i = j;
      } else if (/^[A-Z]/.test(word) && word.length > 1) {
        // Type-like identifiers (e.g. AgentRequest, BaseModel)
        tokens.push({ type: 'type', text: word });
        i = j;
      } else {
        tokens.push({ type: 'plain', text: word });
        i = j;
      }
      continue;
    }

    // Punctuation / operators
    tokens.push({ type: 'plain', text: line[i] });
    i++;
  }

  return tokens;
}

const TOKEN_COLORS: Record<string, string> = {
  comment: 'text-slate-500 italic',
  string: 'text-emerald-400',
  keyword: 'text-purple-400',
  builtin: 'text-cyan-300',
  number: 'text-amber-300',
  decorator: 'text-amber-400',
  function: 'text-cyan-400 font-semibold',
  type: 'text-emerald-300',
  plain: '',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function highlightPython(code: string): string {
  return code
    .split('\n')
    .map((line) => {
      const tokens = tokenizeLine(line);
      return tokens
        .map((token) => {
          const escaped = escapeHtml(token.text);
          const colorClass = TOKEN_COLORS[token.type];
          if (!colorClass) return escaped;
          return `<span class="${colorClass}">${escaped}</span>`;
        })
        .join('');
    })
    .join('\n');
}

/* ---------- Component ---------- */

export default function CodeShowcase() {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeTab, setActiveTab] = useState(codeTabs[0].id);
  const [copied, setCopied] = useState(false);

  const currentTab = codeTabs.find((t) => t.id === activeTab) ?? codeTabs[0];

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(currentTab.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [currentTab.code]);

  const highlighted = highlightPython(currentTab.code);
  const lineCount = currentTab.code.split('\n').length;

  return (
    <section id="code" className="relative py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={sectionRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#f59e0b] font-mono text-sm tracking-widest uppercase">Craft</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
            <span className="gradient-text">Code</span>
          </h2>
          <p className="text-slate-500 mt-3 text-sm sm:text-base">A glimpse into how I build</p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#f59e0b] to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-8"
        >
          <div className="relative flex gap-1 p-1 glass-card rounded-xl">
            {codeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 sm:px-6 py-2.5 text-sm font-mono rounded-lg transition-colors duration-200 z-10 ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="code-tab-indicator"
                    className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Code block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="glass-card rounded-2xl overflow-hidden neon-border"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#f43f5e]/60" />
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]/60" />
                <span className="w-3 h-3 rounded-full bg-[#10b981]/60" />
              </div>
              <span className="text-xs font-mono text-slate-400 sm:inline hidden">{currentTab.filename}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-500 border border-white/5">{currentTab.language}</span>
            </div>
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
            >
              {copied ? <Check size={14} className="text-[#10b981]" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Code area */}
          <div className="overflow-x-auto max-h-[520px] overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {/* Line numbers */}
                <div className="py-4 pl-4 sm:pl-6 pr-2 text-right select-none shrink-0">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div
                      key={i}
                      className="text-[11px] font-mono leading-6 text-slate-600"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>

                {/* Code content */}
                <pre className="py-4 pr-4 sm:pr-6 text-[13px] leading-6 font-mono text-slate-300 whitespace-pre flex-1">
                  <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                </pre>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}