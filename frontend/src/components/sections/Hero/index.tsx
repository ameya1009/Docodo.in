'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap, Play } from 'lucide-react';

// ─── Particle Canvas Background ────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;

    const COLORS = ['#10B981', '#3B82F6', '#22D3EE', '#6366F1'];
    
    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      size: number; alpha: number;
      color: string; pulse: number;
      pSpeed: number;
    }

    let particles: Particle[] = [];

    function init() {
      if (!canvas) return;
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const count = Math.min(80, Math.floor((W * H) / 14000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.6 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        pulse: Math.random() * Math.PI * 2,
        pSpeed: Math.random() * 0.02 + 0.01,
      }));
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16,185,129,${(1 - dist / 120) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        p.pulse += p.pSpeed;
        const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(a * 255).toString(16).padStart(2,'0');
        ctx.fill();

        // Glow
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grad.addColorStop(0, p.color + '40');
        grad.addColorStop(1, 'transparent');
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      });

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    const ro = new ResizeObserver(init);
    ro.observe(document.body);

    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.8 }}
    />
  );
}

// ─── Floating 3D Dashboard Card ────────────────────────────────────────────
function DashboardCard3D() {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-10deg', '10deg']);
  const xSpring = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const ySpring = useSpring(rotateY, { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: xSpring, rotateY: ySpring, transformStyle: 'preserve-3d', perspective: '800px' }}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[420px] mx-auto"
    >
      {/* Outer glow ring */}
      <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/20 via-transparent to-sapphire-500/20 blur-2xl" />

      {/* Card body */}
      <div className="relative rounded-[2rem] border border-white/10 bg-zinc-950/90 backdrop-blur-3xl overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">

        {/* Browser chrome bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
          </div>
          <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-black">DOCODO · GROWTH OS</span>
          <div className="w-4 h-4 rounded bg-white/5" />
        </div>

        {/* Dashboard inner UI */}
        <div className="p-5 space-y-4">
          {/* Revenue metric */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="p-4 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl border border-emerald-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-black">Monthly Revenue Added</span>
              <span className="text-[9px] text-emerald-400 font-black bg-emerald-500/10 px-2 py-0.5 rounded-full">↑ 28.4%</span>
            </div>
            <div className="text-2xl font-black text-white">₹68,400</div>
            {/* Mini bar chart */}
            <div className="flex items-end gap-1 mt-3 h-10">
              {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.7 + i * 0.08, duration: 0.5, ease: 'backOut' }}
                  style={{ height: `${h}%`, transformOrigin: 'bottom' }}
                  className={`flex-1 rounded-sm ${i === 5 ? 'bg-emerald-400' : 'bg-emerald-500/30'}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Live agent logs */}
          <div className="space-y-2">
            {[
              { text: 'WhatsApp bot booked Priya S. (Baner Salon)', color: 'emerald', time: 'Now' },
              { text: 'SEO schema crawled by Googlebot ✓', color: 'sapphire', time: '3m' },
              { text: 'Lead qualified: Amit R. — Koregaon Spa', color: 'emerald', time: '12m' },
            ].map((log, i) => (
              <motion.div
                key={i}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.15 }}
                className="flex items-center justify-between p-2.5 bg-white/3 rounded-xl border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${log.color === 'emerald' ? 'bg-emerald-400 shadow-[0_0_6px_#10B981]' : 'bg-blue-400 shadow-[0_0_6px_#3B82F6]'} animate-pulse`} />
                  <span className="text-[10px] text-zinc-300 font-medium truncate max-w-[180px]">{log.text}</span>
                </div>
                <span className="text-[9px] text-zinc-600 font-bold shrink-0 ml-2">{log.time}</span>
              </motion.div>
            ))}
          </div>

          {/* Conversion metric */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div>
              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Conv. Rate</p>
              <p className="text-lg font-black text-white">78.5%</p>
            </div>
            <div>
              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Qualified Leads</p>
              <p className="text-lg font-black text-white">312</p>
            </div>
            <div>
              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">AI Agents</p>
              <p className="text-lg font-black text-emerald-400">4 Live</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -top-4 -right-4 px-3 py-2 bg-emerald-500 rounded-xl shadow-[0_8px_24px_rgba(16,185,129,0.5)] flex items-center gap-2"
      >
        <Zap size={12} className="text-black" />
        <span className="text-black text-[10px] font-black uppercase tracking-widest">AI Active</span>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Hero ──────────────────────────────────────────────────────────────
export function Hero() {
  const router = useRouter();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0F0F0F]"
      style={{ paddingTop: 'var(--header-height)' }}
    >
      {/* ── Particle Background ── */}
      <ParticleCanvas />

      {/* ── Ambient gradients ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/4 rounded-full blur-[80px]" />
      </div>

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Content ── */}
      <div className="container relative" style={{ zIndex: 10 }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[calc(100vh-var(--header-height))] py-16">

          {/* ── LEFT: Copy ── */}
          <motion.div
            className="lg:col-span-7 flex flex-col text-center lg:text-left items-center lg:items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Tag */}
            <motion.div variants={itemVariants} className="mb-6">
              <span className="tag">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
                <span className="text-emerald-400">Pune Built · Scaling Globally</span>
                <span className="w-px h-3 bg-zinc-700" />
                <span className="text-zinc-400">75+ Businesses Trust Us</span>
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={itemVariants}
              className="mb-6 font-black tracking-tight leading-[1.02] text-white"
              style={{ fontSize: 'var(--fs-hero)' }}
            >
              Pune&apos;s #1<br />
              <span className="text-gradient">AI Growth OS</span><br />
              <span className="text-zinc-300">for Ambitious</span> Brands
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={itemVariants}
              className="text-zinc-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              style={{ fontSize: 'var(--fs-lg)' }}
            >
              AI Websites · Smart WhatsApp Bots · Local to Global Scaling.<br />
              Unlock{' '}
              <span className="text-white font-black underline decoration-emerald-500 decoration-2">
                ₹50,000+ Extra Revenue Monthly
              </span>{' '}
              with Zero Tech Headache.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10"
            >
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider text-[11px] h-14 px-8 rounded-xl shadow-[0_4px_30px_rgba(16,185,129,0.45)] flex items-center justify-center gap-2 group transition-all w-full sm:w-auto"
                onClick={() => router.push('/growth-grader')}
              >
                Get Free 50-Point Growth Audit
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/10 hover:border-emerald-500/30 bg-white/5 hover:bg-emerald-500/5 text-white font-black uppercase tracking-wider text-[11px] h-14 px-8 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2 transition-all"
                onClick={() => router.push('/dashboard')}
              >
                <Play size={12} className="fill-emerald-400 text-emerald-400" />
                Start Free — 50 Credits
              </Button>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start items-center gap-6 pt-6 border-t border-white/5 w-full"
            >
              {[
                { icon: <ShieldCheck size={14} className="text-emerald-400" />, label: 'Pune Built' },
                { icon: <TrendingUp size={14} className="text-blue-400" />, label: '4.9 / 5 Rating' },
                { icon: <Sparkles size={14} className="text-emerald-300" />, label: 'AI-Native Stack' },
                { icon: <Zap size={14} className="text-yellow-400" />, label: '7-Day Delivery' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 text-zinc-500 text-xs font-bold">
                  {t.icon}
                  <span>{t.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: 3D Dashboard ── */}
          <div className="lg:col-span-5 w-full flex items-center justify-center">
            <DashboardCard3D />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0F0F] to-transparent" style={{ zIndex: 5 }} />
    </section>
  );
}
