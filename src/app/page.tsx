'use client';

import { BentoCard } from '@/components/ui/BentoCard';
import { ArrowUpRight, Zap, MapPin, Globe, Users, TrendingUp, Sparkles, Brain, Code, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Starfield } from '@/components/ui/Starfield';
import { useCredits } from '@/hooks/useCredits';
import { motion } from 'framer-motion';

export default function Home() {
  const { credits } = useCredits();

  return (
    <main className="relative min-h-screen bg-[#000814] text-white">
      <Starfield />
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">

          {/* HERO BLOCK - 2x2 */}
          <BentoCard
            span="2x2"
            className="flex flex-col justify-end relative group"
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src="/brain/34775d6c-fa2c-43be-ba45-1cbf261c881d/pune_skyline_premium_hero_1772801908298.png"
                alt="Pune Skyline"
                className="w-full h-full object-cover filter brightness-[0.35] saturate-[1.2] group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 p-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-cyan-500/20 backdrop-blur-md">
                  Pune's Growth OS
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 leading-[0.9]">
                Redefining <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                  SMB Scale.
                </span>
              </h1>
              <p className="text-zinc-400 max-w-sm mb-8 text-sm md:text-base">
                Docodo is the Apple of digital growth for Pune businesses. Premium sites, apps, and AI agents that deliver ₹50k+ Monthly ROI.
              </p>
              <Link href="/tools">
                <Button className="bg-white text-black font-black uppercase text-xs tracking-widest px-8 rounded-full h-14 hover:bg-cyan-400 transition-all shadow-2xl shadow-white/10">
                  Explore Tools
                </Button>
              </Link>
            </div>
          </BentoCard>

          {/* AI TOOLS BLOCK - 1x2 */}
          <BentoCard span="1x2" glowColor="rgba(168, 85, 247, 0.2)">
            <Brain className="text-purple-400 mb-6" size={32} />
            <h3 className="text-2xl font-bold mb-4 tracking-tight">AI Marketplace</h3>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
              Deploy custom agents for WhatsApp, SEO, and Inventory in seconds.
            </p>
            <div className="space-y-3 mb-12">
              {['Lead Bot', 'SEO Agent', 'GTM Scaler'].map((tool) => (
                <div key={tool} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-purple-500/30 transition-all">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{tool}</span>
                  <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-purple-400" />
                </div>
              ))}
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full border-zinc-800 text-[10px] font-black uppercase tracking-widest h-12">
                Dashboard ({credits} Cr)
              </Button>
            </Link>
          </BentoCard>

          {/* PRICING BLOCK - 1x1 */}
          <BentoCard span="1x1" glowColor="rgba(34, 197, 94, 0.2)">
            <Zap className="text-green-400 mb-4" size={24} />
            <h3 className="text-lg font-bold mb-2">Pricing</h3>
            <p className="text-zinc-500 text-xs mb-6">
              Pune-first pricing. Pay for ROI, not just tech.
            </p>
            <Link href="/pricing" className="text-sm font-bold text-white flex items-center gap-2 group">
              View Plans <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </BentoCard>

          {/* SERVICES BLOCK - 1x1 */}
          <BentoCard span="1x1" glowColor="rgba(234, 179, 8, 0.2)">
            <Code className="text-amber-400 mb-4" size={24} />
            <h3 className="text-lg font-bold mb-2">Build OS</h3>
            <p className="text-zinc-500 text-xs mb-6">
              Premium sites & apps built on Next.js 16.
            </p>
            <Link href="/services" className="text-sm font-bold text-white flex items-center gap-2 group">
              Explore <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </BentoCard>

          {/* MISSION BLOCK - 2x1 */}
          <BentoCard span="2x1" glowColor="rgba(239, 68, 68, 0.2)">
            <div className="flex h-full gap-8 items-center">
              <div className="flex-1">
                <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.3em] mb-4 block">Our Roots</span>
                <h3 className="text-2xl font-bold mb-4 tracking-tighter">Pune-First Mission</h3>
                <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
                  Built by engineers from COEP/VJTI. We scale salons in Viman Nagar, clinics in Kothrud, and cafes in Baner.
                </p>
              </div>
              <div className="hidden lg:flex flex-col items-end gap-2 text-right">
                <div className="text-3xl font-black text-white">40+</div>
                <div className="text-[10px] font-bold text-zinc-600 uppercase">Businesses Scaled</div>
              </div>
            </div>
          </BentoCard>

          {/* CONTACT BLOCK - 2x1 */}
          <BentoCard span="2x1" glowColor="rgba(0, 212, 255, 0.2)">
            <div className="flex items-center justify-between h-full w-full">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4 tracking-tight underline decoration-cyan-500 decoration-4 underline-offset-8">Talk to us.</h3>
                <p className="text-zinc-500 text-sm mb-6 max-w-[200px]">
                  Direct access to the founders. No sales reps.
                </p>
                <Link href="/contact">
                  <Button className="bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest px-8 h-10 hover:bg-cyan-400 transition-all">
                    Message Ameya
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block w-32 h-full rounded-3xl bg-white/5 border border-white/10 p-4 relative overflow-hidden group/map">
                <MapPin className="text-cyan-500 mb-4" size={20} />
                <p className="text-[9px] font-black text-zinc-500 uppercase">Yerwada, Pune</p>
                <p className="text-[8px] text-zinc-700">Tech Center</p>
                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover/map:opacity-100 transition-opacity" />
              </div>
            </div>
          </BentoCard>

        </div>
      </div>

      <Footer />
    </main>
  );
}
