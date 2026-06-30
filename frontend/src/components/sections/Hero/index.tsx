'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap, Play, Coffee } from 'lucide-react';

// ─── 3D Aurora Wave Mesh Canvas ────────────────────────────────────────────
function AuroraWaveCanvas3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;
    let time = 0;

    // Grid details
    const gridCols = 32;
    const gridRows = 32;
    const spacing = 45; // space between grid units
    const fov = 350;    // camera projection field of view

    // Camera angles
    let angleX = 0.85; // Tilt camera down
    let angleY = 0.55; // Slightly rotate camera side-to-side

    function init() {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    // Tracks mouse position relative to center of screen
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Slightly tilt camera based on mouse position
      angleY = 0.55 + ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 0.25;
      angleX = 0.85 + ((e.clientY - window.innerHeight / 2) / window.innerHeight) * 0.15;
    };

    const handleMouseLeave = () => {
      mouseRef.current = null;
      angleY = 0.55;
      angleX = 0.85;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, W, H);
      time += 0.45;

      const cx = W / 2;
      const cy = H / 2 - 80;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Pre-calculate heights and projection points
      const points: { sx: number; sy: number; depth: number; py: number }[][] = [];

      for (let r = 0; r < gridRows; r++) {
        points[r] = [];
        for (let c = 0; c < gridCols; c++) {
          // Centered grid coordinates
          const px = (c - gridCols / 2) * spacing;
          const pz = (r - gridRows / 2) * spacing;

          // Multi-frequency 3D height wave
          const dist = Math.sqrt(px * px + pz * pz) * 0.008;
          let py = Math.sin(dist * 6 - time * 0.04) * 22;
          py += Math.cos(px * 0.015 + time * 0.02) * 12;

          // Interactive mouse ripple
          if (mouseRef.current) {
            const mx = (mouseRef.current.x - W / 2) * 1.5;
            const mz = (mouseRef.current.y - H / 2) * 1.5;
            const dx = px - mx;
            const dz = pz - mz;
            const dMouse = Math.sqrt(dx * dx + dz * dz);
            if (dMouse < 180) {
              const strength = (1 - dMouse / 180);
              py += strength * 35 * Math.sin(time * 0.12);
            }
          }

          // 3D rotation formulas
          const x1 = px * cosY - pz * sinY;
          const z1 = px * sinY + pz * cosY;

          const y1 = py * cosX - z1 * sinX;
          const z2 = py * sinX + z1 * cosX;

          // Perspective screen projection
          const scale = fov / (fov + z2 + 250);
          const sx = cx + x1 * scale;
          const sy = cy + y1 * scale;

          points[r][c] = { sx, sy, depth: z2, py };
        }
      }

      // Draw mesh wireframe
      for (let r = 0; r < gridRows - 1; r++) {
        for (let c = 0; c < gridCols - 1; c++) {
          const p1 = points[r][c];
          const p2 = points[r][c + 1];
          const p3 = points[r + 1][c];

          // Fade grid out towards background based on depth
          const opacity = Math.max(0, Math.min(0.38, 1 - (p1.depth + 180) / 450));

          if (opacity > 0) {
            // Draw horizontal connection
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            // Blend violet-to-mint gradient based on wave height
            const isPeak = p1.py > 5;
            ctx.strokeStyle = isPeak 
              ? `rgba(16,185,129,${opacity * 0.6})` 
              : `rgba(139,92,246,${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();

            // Draw vertical connection
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p3.sx, p3.sy);
            ctx.strokeStyle = isPeak
              ? `rgba(16,185,129,${opacity * 0.6})` 
              : `rgba(99,102,241,${opacity})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    const ro = new ResizeObserver(init);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.65 }}
    />
  );
}

// ─── Floating 3D Dashboard Mockup ──────────────────────────────────────────
interface DashboardProps {
  puneriMode: boolean;
}

function DashboardCard3D({ puneriMode }: DashboardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(x, [-0.5, 0.5], ['-8deg', '8deg']);
  const xSpring = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const ySpring = useSpring(rotateY, { stiffness: 220, damping: 22 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  }

  // Puneri mode logs vs global logs
  const puneriLogs = [
    { text: 'WhatsApp Bot replied in Marathi: "Vada Pav ready, client booked"', color: 'mint', time: 'Now' },
    { text: 'Afternoon nap override: auto-captured lead from FC Road', color: 'violet', time: '2m' },
    { text: 'SEO graph injection: "Best misal Pune" keyword indexed ✓', color: 'mint', time: '11m' },
  ];

  const globalLogs = [
    { text: 'Lead secured: Pune Gym (koregaon Park) booked call', color: 'mint', time: 'Now' },
    { text: 'AI Agent outbound outreach active: 31 cold emails dispatched', color: 'violet', time: '3m' },
    { text: 'SEO landing page optimized for Google Core Web Vitals ✓', color: 'mint', time: '9m' },
  ];

  const activeLogs = puneriMode ? puneriLogs : globalLogs;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: xSpring, rotateY: ySpring, transformStyle: 'preserve-3d', perspective: '800px' }}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[430px] mx-auto"
    >
      {/* Visual neon backglow rings */}
      <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-violet-500/20 via-transparent to-mint-500/20 blur-2xl pointer-events-none" />

      {/* Card Wrapper */}
      <div className="relative rounded-[2rem] border border-violet-500/10 bg-zinc-950/90 backdrop-blur-3xl overflow-hidden shadow-[0_35px_80px_-15px_rgba(0,0,0,0.85)]">
        {/* Browser Chrome Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-black/40">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/50" />
          </div>
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-black">
            {puneriMode ? 'DOCODO · PUNE EDITION' : 'DOCODO · GROWTH ENGINE'}
          </span>
          <div className="w-3.5 h-3.5 rounded bg-white/5" />
        </div>

        {/* Inner layout */}
        <div className="p-6 space-y-4">
          {/* Main metric chart box */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="p-4 bg-gradient-to-br from-violet-500/10 to-transparent rounded-2xl border border-violet-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Extra Revenue Generated</span>
              <span className="text-[9px] text-mint font-black bg-mint/10 px-2 py-0.5 rounded-full">↑ 34.2%</span>
            </div>
            <div className="text-2xl font-black text-white">₹78,920</div>
            {/* Visual SVG mini bar charts */}
            <div className="flex items-end gap-1.5 mt-3 h-10">
              {[35, 55, 45, 90, 65, 80, 100].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.5, ease: 'backOut' }}
                  style={{ height: `${h}%`, transformOrigin: 'bottom' }}
                  className={`flex-1 rounded-sm ${i === 6 ? 'bg-mint' : 'bg-violet/30'}`}
                />
              ))}
            </div>
          </motion.div>

          {/* AI Activity feeds */}
          <div className="space-y-2">
            {activeLogs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.12 }}
                className="flex items-center justify-between p-2.5 bg-white/3 rounded-xl border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${log.color === 'mint' ? 'bg-mint shadow-[0_0_6px_#10B981]' : 'bg-violet shadow-[0_0_6px_#8B5CF6]'} animate-pulse`} />
                  <span className="text-[10px] text-zinc-300 font-semibold truncate max-w-[200px]">{log.text}</span>
                </div>
                <span className="text-[9px] text-zinc-500 font-bold shrink-0 ml-2">{log.time}</span>
              </motion.div>
            ))}
          </div>

          {/* Quick specs grid */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center">
            <div>
              <p className="text-[8px] text-zinc-500 font-black uppercase tracking-wider">Conversion</p>
              <p className="text-sm font-bold text-white">82.1%</p>
            </div>
            <div>
              <p className="text-[8px] text-zinc-500 font-black uppercase tracking-wider">Total Leads</p>
              <p className="text-sm font-bold text-white">492</p>
            </div>
            <div>
              <p className="text-[8px] text-zinc-500 font-black uppercase tracking-wider">AI Workers</p>
              <p className="text-sm font-bold text-mint">6 Live</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Spark badge */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        className="absolute -top-3 -right-3 px-3 py-1.5 bg-violet rounded-lg shadow-[0_5px_20px_rgba(139,92,246,0.4)] flex items-center gap-1.5 pointer-events-none"
      >
        <Sparkles size={11} className="text-white" />
        <span className="text-white text-[9px] font-black uppercase tracking-wider">Engine Active</span>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Hero Section ──────────────────────────────────────────────────────
export function Hero() {
  const router = useRouter();
  const [puneriMode, setPuneriMode] = useState(false);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[#07060A]"
      style={{ paddingTop: 'var(--header-height)' }}
    >
      {/* 3D Wave Mesh Backdrop */}
      <AuroraWaveCanvas3D />

      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-mint-500/4 rounded-full blur-[130px]" />
      </div>

      {/* Grid line overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '55px 55px',
        }}
      />

      <div className="container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center min-h-[calc(100vh-var(--header-height))] py-12">
          
          {/* Left Text Block */}
          <div className="lg:col-span-7 flex flex-col text-center lg:text-left items-center lg:items-start">
            
            {/* Tag badge with click trigger */}
            <motion.div 
              className="mb-6 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => setPuneriMode(!puneriMode)}
              title="Click to toggle Pune Edition mode"
            >
              <span className={`tag ${puneriMode ? 'tag-mint' : ''} transition-all duration-300`}>
                <span className={`w-2 h-2 rounded-full ${puneriMode ? 'bg-mint shadow-[0_0_8px_#10B981]' : 'bg-violet shadow-[0_0_8px_#8B5CF6]'} animate-pulse`} />
                <span className="text-zinc-300 font-bold tracking-widest text-[10px]">
                  {puneriMode ? 'Puneri Nap-Proof Edition Active' : 'Pune Built · Scale Globally'}
                </span>
                <span className="w-px h-3 bg-zinc-800" />
                <span className={`${puneriMode ? 'text-mint' : 'text-violet'} font-extrabold text-[10px]`}>
                  {puneriMode ? 'Nap Guard Active ✓' : 'Toggle Local Mode'}
                </span>
              </span>
            </motion.div>

            {/* Main Header */}
            <h1
              className="mb-5 font-black tracking-tight leading-[1.05] text-white"
              style={{ fontSize: 'var(--fs-hero)' }}
            >
              Scaling Pune&apos;s<br />
              <span className="text-gradient">AI Growth OS</span><br />
              with <span className="text-gradient-growth">Zero Excuses</span>
            </h1>

            {/* Sub description */}
            <p
              className="text-zinc-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
              style={{ fontSize: 'var(--fs-lg)' }}
            >
              We engineer ultra-premium websites, fast conversational WhatsApp bots, and ROI engines for local leaders.{' '}
              {puneriMode ? (
                <span className="text-mint font-black">
                  Yes, our AI agents handle lead booking 24/7—even during Pune&apos;s sacred afternoon nap hours (1:00 to 4:00 PM)!
                </span>
              ) : (
                <span>
                  Unlock{' '}
                  <span className="text-white font-extrabold underline decoration-violet decoration-2">
                    ₹50,000+ extra monthly revenue
                  </span>{' '}
                  with zero technical friction.
                </span>
              )}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
              <Button
                size="lg"
                className="bg-violet hover:bg-violet-dark text-white font-black uppercase tracking-wider text-[11px] h-14 px-8 rounded-xl shadow-[0_4px_30px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 group transition-all w-full sm:w-auto"
                onClick={() => router.push('/growth-grader')}
              >
                Get Free Growth Audit
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/10 hover:border-violet/30 bg-white/5 hover:bg-violet/5 text-white font-black uppercase tracking-wider text-[11px] h-14 px-8 rounded-xl w-full sm:w-auto flex items-center justify-center gap-2 transition-all"
                onClick={() => setPuneriMode(!puneriMode)}
              >
                <Coffee size={12} className="text-mint fill-mint" />
                {puneriMode ? "Back to Global" : "Try Puneri Edition"}
              </Button>
            </div>

            {/* Trust strips */}
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-5 pt-6 border-t border-white/5 w-full">
              {[
                { icon: <ShieldCheck size={14} className="text-mint" />, label: '7-Day Deployment' },
                { icon: <TrendingUp size={14} className="text-violet" />, label: '4.9/5 Client Rating' },
                { icon: <Zap size={14} className="text-amber-400" />, label: '100% Managed Stack' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 text-zinc-500 text-xs font-bold">
                  {t.icon}
                  <span>{t.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Right 3D Mockup Block */}
          <div className="lg:col-span-5 w-full flex items-center justify-center">
            <DashboardCard3D puneriMode={puneriMode} />
          </div>

        </div>
      </div>

      {/* Fade overlay on bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#07060A] to-transparent z-5" />
    </section>
  );
}
