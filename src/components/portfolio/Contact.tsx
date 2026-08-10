'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Send, Mail, Phone, Linkedin, Github, CheckCircle, Loader2, MapPin, Rocket } from 'lucide-react';
import MagneticButton from './MagneticButton';

function SuccessParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i / 12) * 360,
    color: ['#00f0ff', '#8b5cf6', '#f59e0b', '#10b981'][i % 4],
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * 60,
            y: Math.sin((p.angle * Math.PI) / 180) * 60,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function EnvelopeRocket({ status }: { status: string }) {
  return (
    <AnimatePresence>
      {status === 'sent' && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: -30, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.3 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ rotate: -45 }}
            transition={{ duration: 0.5 }}
          >
            <Rocket size={24} className="text-[#f59e0b]" />
          </motion.div>
          {/* Rocket trail */}
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-6 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #f59e0b, transparent)' }}
            animate={{ scaleY: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 0.3, repeat: 3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const socials = [
    { icon: Mail, label: 'Email', value: 'adarshkumarsbrhs@gmail.com', href: 'mailto:adarshkumarsbrhs@gmail.com', color: '#00f0ff' },
    { icon: Phone, label: 'Phone', value: '+91 9801742363', href: 'tel:+919801742363', color: '#8b5cf6' },
    { icon: Linkedin, label: 'LinkedIn', value: 'LinkedIn Profile', href: '#', color: '#0a66c2' },
    { icon: Github, label: 'GitHub', value: 'GitHub Profile', href: '#', color: '#ffffff' },
  ];

  const inputClasses = (fieldName: string) =>
    `w-full bg-white/[0.03] border rounded-lg px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-all duration-300 ${
      focusedField === fieldName
        ? 'border-[#00f0ff]/60 shadow-[0_0_20px_rgba(0,240,255,0.15),0_0_40px_rgba(0,240,255,0.05)] ring-1 ring-[#00f0ff]/20'
        : 'border-white/10 focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/20'
    }`;

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      {/* Noise texture background */}
      <div className="absolute inset-0 contact-noise pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#00f0ff] font-mono text-sm tracking-widest uppercase">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3">
            Let&apos;s <span className="gradient-text">Connect</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent mx-auto mt-4" />
          <p className="text-slate-400 mt-4 max-w-lg mx-auto">
            Have a project in mind, want to collaborate, or just want to say hi? Feel free to reach out — I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info with enhanced hover effects */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  borderColor: s.color + '66',
                  boxShadow: `0 0 25px ${s.color}15`,
                }}
                className="glass-card rounded-xl p-4 flex items-center gap-4 group block"
              >
                <motion.div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                  style={{ backgroundColor: `${s.color}15` }}
                  whileHover={{
                    scale: 1.2,
                    boxShadow: `0 0 15px ${s.color}44`,
                  }}
                >
                  <s.icon size={18} style={{ color: s.color }} />
                </motion.div>
                <div>
                  <p className="text-xs text-slate-500 font-mono">{s.label}</p>
                  <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{s.value}</p>
                </div>
              </motion.a>
            ))}

            {/* Animated location pin */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="glass-card rounded-xl p-4 flex items-center gap-4"
            >
              <motion.div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#10b98115' }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <MapPin size={18} className="text-[#10b981]" />
              </motion.div>
              <div>
                <p className="text-xs text-slate-500 font-mono">Location</p>
                <p className="text-sm text-slate-300">Rajkot, Gujarat, India</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Form with glowing inputs and success state */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 neon-border relative overflow-visible">
              <EnvelopeRocket status={status} />

              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="py-12 flex flex-col items-center justify-center relative"
                  >
                    <SuccessParticles />
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    >
                      <CheckCircle size={48} className="text-[#10b981]" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl font-bold text-white mt-4"
                    >
                      Message Sent!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-sm text-slate-400 mt-2"
                    >
                      Thanks for reaching out. I&apos;ll get back to you soon!
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1.5">Name *</label>
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className={inputClasses('name')}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-500 mb-1.5">Email *</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          className={inputClasses('email')}
                          placeholder="you@email.com"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-mono text-slate-500 mb-1.5">Subject</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClasses('subject')}
                        placeholder="What's this about?"
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-xs font-mono text-slate-500 mb-1.5">Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        className={`${inputClasses('message')} resize-none`}
                        placeholder="Tell me about your project..."
                      />
                    </div>
                    <MagneticButton strength={0.2} className="w-full">
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full py-3.5 rounded-xl font-semibold text-[#030014] bg-gradient-to-r from-[#00f0ff] to-[#06b6d4] hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {status === 'sending' ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Sending...
                          </>
                        ) : status === 'error' ? (
                          'Failed. Try Again'
                        ) : (
                          <>
                            <Send size={18} />
                            Send Message
                          </>
                        )}
                      </button>
                    </MagneticButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .contact-noise::after {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.02;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          z-index: 0;
        }
      ` }} />
    </section>
  );
}
