"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  TrendingUp,
  Target,
  Sparkles,
  Video,
  Layers,
  Send,
  MessageCircle,
  MapPin,
  Users,
  Building2,
  Calendar,
  DollarSign,
  Copy,
  Check,
  Loader2,
  LogOut,
  Bell,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Activity,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface FounderDashboardProps {
  initialData: {
    totalBusinesses: number;
    totalCustomers: number;
    totalBookings: number;
    totalRevenue: number;
    recentBusinesses: any[];
    recentBookings: any[];
  };
}

const CAMPAIGN_TABS = [
  { id: "INSTA_REEL_FOUNDER", label: "Instagram Reel", icon: Video, color: "text-amber-400", bg: "bg-amber-400/10" },
  { id: "INSTA_CAROUSEL_FOUNDER", label: "Instagram Carousel", icon: Layers, color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "COLD_WHATSAPP_PITCH", label: "WhatsApp Cold Pitch", icon: Send, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "INSTA_COLD_DM", label: "Instagram DM Script", icon: MessageCircle, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { id: "GOOGLE_MAPS_OUTREACH", label: "Google Maps Script", icon: MapPin, color: "text-pink-400", bg: "bg-pink-400/10" },
];

const TARGET_PRESETS = [50000, 100000, 250000, 500000, 1000000];

export default function FounderDashboardClient({ initialData }: FounderDashboardProps) {
  const router = useRouter();
  const [targetRevenue, setTargetRevenue] = useState<number>(100000);
  const [customTarget, setCustomTarget] = useState<string>("100000");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("Salons & Spas");
  const [selectedTab, setSelectedTab] = useState(CAMPAIGN_TABS[0]);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    await fetch("/api/founder/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/founder/login");
    router.refresh();
  };

  const handleGenerateCampaign = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/founder/generate-campaign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignType: selectedTab.id,
            targetIndustry: selectedIndustry,
          }),
        });
        const data = await res.json();
        if (data.success && data.content) {
          setGeneratedContent(data.content);
        } else {
          setGeneratedContent("Generation failed. Please retry.");
        }
      } catch (err: any) {
        setGeneratedContent(`Failed to generate campaign: ${err?.message || "Unknown error"}`);
      }
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestAlert = async () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 3000);
  };

  // Calculations for Founder Revenue Targets
  const starterCountNeeded = Math.ceil(targetRevenue / 999);
  const growthCountNeeded = Math.ceil(targetRevenue / 2499);
  const proCountNeeded = Math.ceil(targetRevenue / 4999);

  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)] pb-20 selection:bg-[var(--lime)] selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-void)]/80 backdrop-blur-md border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--lime-ghost)] border border-[var(--lime)]/30 flex items-center justify-center text-[var(--lime)] shadow-[var(--lime-glow-sm)]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base tracking-tight font-display text-[var(--lime)]">Docodo</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--lime)]/15 text-[var(--lime)] border border-[var(--lime)]/30 font-mono font-bold uppercase">
                  Founder Suite
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Ameya Kshirsagar &middot; ameyakshirsagar@docodo.in</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestAlert}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
            >
              <Bell size={13} />
              {alertSent ? "Alert Dispatched!" : "+91 9284310604 Active"}
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] transition-colors"
            >
              <LogOut size={13} /> Exit
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[var(--bg-surface)] via-[var(--bg-surface)] to-[var(--bg-elevated)] border border-[var(--lime)]/30 relative overflow-hidden shadow-2xl">
          <div className="absolute -right-10 -top-10 w-96 h-96 bg-[var(--lime)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] text-xs font-mono font-bold uppercase border border-[var(--lime)]/30">
              <Sparkles size={13} /> Private Monetization & Growth Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] font-display tracking-tight">
              Docodo.in Founder Command Center
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              This master control portal is strictly private to your founder account. Track personal monthly revenue milestones, run automated social media client acquisition campaigns for Docodo.in, and scale to ₹1,00,000+ monthly income.
            </p>
          </div>
        </div>

        {/* Global Platform KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium mb-3">
              <span>Total Businesses</span>
              <Building2 size={16} className="text-[var(--lime)]" />
            </div>
            <div className="text-2xl font-black text-[var(--text-primary)]">{initialData.totalBusinesses}</div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">Registered Stores on Platform</p>
          </div>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium mb-3">
              <span>Total Customers</span>
              <Users size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl font-black text-[var(--text-primary)]">{initialData.totalCustomers}</div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">Across all merchant CRM databases</p>
          </div>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium mb-3">
              <span>Total Platform Bookings</span>
              <Calendar size={16} className="text-purple-400" />
            </div>
            <div className="text-2xl font-black text-[var(--text-primary)]">{initialData.totalBookings}</div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">Appointments booked via Docodo</p>
          </div>

          <div className="p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-sm">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium mb-3">
              <span>Gross Platform Volume</span>
              <DollarSign size={16} className="text-[var(--success)]" />
            </div>
            <div className="text-2xl font-black text-[var(--text-primary)]">
              {formatCurrency(initialData.totalRevenue)}
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1">Processed appointment GMV</p>
          </div>
        </div>

        {/* SECTION 1: Personal Monthly Revenue & Target Planner */}
        <section className="p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--lime)] uppercase mb-1">
                <Target size={14} /> Revenue Target Calculator
              </div>
              <h2 className="text-xl font-black text-[var(--text-primary)] font-display">
                Monthly Income & Client Acquisition Math
              </h2>
            </div>

            {/* Target Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              {TARGET_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setTargetRevenue(preset);
                    setCustomTarget(String(preset));
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    targetRevenue === preset
                      ? "bg-[var(--lime)] text-black border-[var(--lime)] shadow-[var(--lime-glow-sm)]"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-white"
                  }`}
                >
                  ₹{(preset / 1000).toLocaleString("en-IN")}k/mo
                </button>
              ))}
            </div>
          </div>

          {/* Goal velocity cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Starter SaaS Tier</span>
                <span className="text-xs font-mono font-bold text-[var(--lime)]">₹999 / month</span>
              </div>
              <div className="text-3xl font-black text-[var(--text-primary)]">
                {starterCountNeeded} <span className="text-xs font-medium text-[var(--text-muted)]">merchants</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Requires onboarding ~{Math.ceil(starterCountNeeded / 4)} local salons/clinics per week.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--lime)]/40 relative space-y-3 shadow-md">
              <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-[var(--lime)] text-black font-bold text-[10px] rounded-full uppercase">
                Most Popular
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Growth SaaS Tier</span>
                <span className="text-xs font-mono font-bold text-[var(--lime)]">₹2,499 / month</span>
              </div>
              <div className="text-3xl font-black text-[var(--lime)]">
                {growthCountNeeded} <span className="text-xs font-medium text-[var(--text-muted)]">merchants</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Just {growthCountNeeded} active stores to achieve steady <strong className="text-white">₹{targetRevenue.toLocaleString("en-IN")}/month</strong> recurring revenue.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Pro / Custom Setup</span>
                <span className="text-xs font-mono font-bold text-purple-400">₹4,999 / month</span>
              </div>
              <div className="text-3xl font-black text-[var(--text-primary)]">
                {proCountNeeded} <span className="text-xs font-medium text-[var(--text-muted)]">merchants</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Includes custom WhatsApp branding, dedicated domain setup, and ongoing marketing care.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: Docodo Self-Marketing & Social Acquisition Suite */}
        <section className="p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-lg space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--lime)] uppercase mb-1">
              <Sparkles size={14} /> Automated Client Acquisition
            </div>
            <h2 className="text-xl font-black text-[var(--text-primary)] font-display">
              Docodo.in Self-Marketing Generator
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Generate viral Instagram reels, educational carousels, cold WhatsApp outreach, and Google Maps pitch scripts to attract business clients to Docodo.in.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Controls */}
            <div className="lg:col-span-5 space-y-4">
              {/* Target Industry Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Target Business Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Salons & Spas", "Dental & Clinics", "Gyms & Trainers", "Car Detailing", "Beauty Parlours", "Coaching Institutes"].map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setSelectedIndustry(ind)}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all ${
                        selectedIndustry === ind
                          ? "bg-[var(--lime-ghost)] text-[var(--lime)] border-[var(--lime)]/40"
                          : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-white"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Marketing Channel & Format
                </label>
                <div className="space-y-2">
                  {CAMPAIGN_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = selectedTab.id === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setSelectedTab(tab);
                          setGeneratedContent("");
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left border transition-all ${
                          isSelected
                            ? "bg-[var(--lime-ghost)] border-[var(--lime)]/30 text-[var(--lime)]"
                            : "bg-[var(--bg-elevated)] border-transparent text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-surface)]"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tab.bg}`}>
                          <Icon size={16} className={tab.color} />
                        </div>
                        <span className="text-xs font-bold flex-1">{tab.label}</span>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[var(--lime)]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleGenerateCampaign}
                disabled={isPending}
                className="w-full py-3.5 bg-[var(--lime)] text-black font-black text-xs rounded-xl hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-md)] flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-wider"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Generating {selectedTab.label}...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Generate {selectedTab.label}
                  </>
                )}
              </button>
            </div>

            {/* Right Output */}
            <div className="lg:col-span-7 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden flex flex-col min-h-[420px]">
              <div className="px-5 py-3.5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-surface)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {selectedTab.label} for {selectedIndustry}
                  </span>
                </div>
                {generatedContent && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleGenerateCampaign}
                      disabled={isPending}
                      className="p-1.5 text-[var(--text-muted)] hover:text-white transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw size={14} className={isPending ? "animate-spin" : ""} />
                    </button>
                    <button
                      onClick={() => handleCopy(generatedContent)}
                      className="flex items-center gap-1 px-3 py-1 bg-[var(--lime-ghost)] text-[var(--lime)] rounded-lg text-xs font-bold hover:bg-[var(--lime)]/20 transition-colors"
                    >
                      {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                    </button>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {isPending ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 gap-3 text-center"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[var(--lime-ghost)] flex items-center justify-center">
                        <Sparkles size={24} className="text-[var(--lime)] animate-pulse" />
                      </div>
                      <p className="text-xs text-[var(--text-muted)] font-medium">
                        Crafting viral client acquisition copy for Docodo.in...
                      </p>
                    </motion.div>
                  ) : generatedContent ? (
                    <motion.div key="content" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                      <pre className="whitespace-pre-wrap text-xs font-sans leading-relaxed text-[var(--text-primary)]">
                        {generatedContent}
                      </pre>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 space-y-2">
                      <Sparkles size={28} className="mx-auto text-[var(--text-muted)] mb-2" />
                      <p className="text-xs font-bold text-[var(--text-secondary)]">
                        Ready to generate high-converting outreach copy
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] max-w-sm mx-auto">
                        Select your target category and click &quot;Generate&quot; to create ready-to-post Instagram Reels or WhatsApp pitches.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Step-by-Step Monetization Blueprint */}
        <section className="p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-lg space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--lime)] uppercase">
            <Activity size={14} /> Founder Action Roadmap
          </div>
          <h2 className="text-xl font-black text-[var(--text-primary)] font-display">
            Weekly 4-Step Acquisition Playbook (Target: ₹1,00,000/mo)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--lime-ghost)] text-[var(--lime)] font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Google Maps Prospecting</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Find 20 top-rated salons/clinics in Pune/Mumbai that have no online booking link on their Google Profile.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--lime-ghost)] text-[var(--lime)] font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">14-Day Free Demo Pitch</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Send the generated WhatsApp pitch or Instagram DM offering a pre-built demo store (`docodo.in/demo`).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--lime-ghost)] text-[var(--lime)] font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">15-Minute Instant Setup</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Onboard them via `/onboarding` and add their WhatsApp number for automated 24/7 AI booking auto-replies.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--lime)]/30 space-y-2 bg-[var(--lime-ghost)]/20">
              <div className="w-7 h-7 rounded-lg bg-[var(--lime)] text-black font-bold text-xs flex items-center justify-center">
                4
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Convert to ₹2,499/Mo</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                After their first 10 automated bookings, activate the Growth subscription via Razorpay autopay.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
