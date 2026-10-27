"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar, Users, TrendingUp, Globe, ArrowRight, Clock,
  CheckCircle2, AlertCircle, Sparkles, Copy, ExternalLink, Activity, Award, MessageSquare, Phone,
  Crown, Gift, Flame, PartyPopper, Heart, Send, Check, ShieldCheck, UserX
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ActionCenter } from "./ActionCenter";
import { getHinduCalendarStatus } from "@/lib/engines/hindu-calendar-greetings";
import { updateEnquiryStatus } from "@/lib/actions/enquiry";

interface DashboardHomeProps {
  data: any;
}

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30",
  PENDING: "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30",
  COMPLETED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  CANCELLED: "bg-[var(--danger)]/15 text-[var(--danger)] border-[var(--danger)]/30",
  NO_SHOW: "bg-[var(--text-muted)]/15 text-[var(--text-muted)] border-[var(--text-muted)]/30",
};

export default function DashboardHome({ data }: DashboardHomeProps) {
  const { business = {}, stats = {}, upcomingBookings = [], recentEnquiries = [] } = data || {};
  const [enquiries, setEnquiries] = React.useState<any[]>(recentEnquiries);

  React.useEffect(() => {
    setEnquiries(recentEnquiries);
  }, [recentEnquiries]);

  const [copied, setCopied] = React.useState(false);
  const businessSlug = business?.slug || "my-business";
  const businessName = business?.name || "My Business";
  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://docodo.in"}/book/${businessSlug}`;

  const handleEnquiryStatusChange = (enquiryId: string, newStatus: "NEW" | "CONTACTED" | "BOOKED" | "LOST") => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
    );
    updateEnquiryStatus(enquiryId, newStatus).catch((err) => {
      console.error("Failed to update enquiry status:", err);
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const STAT_CARDS = [
    {
      label: "Today's Bookings",
      value: stats?.todayBookings ?? 0,
      icon: Calendar,
      color: "text-[var(--lime)]",
      bg: "bg-[var(--lime)]/10",
      href: "/dashboard/bookings",
    },
    {
      label: "Revenue This Month",
      value: formatCurrency(stats?.monthlyRevenue ?? 0),
      icon: TrendingUp,
      color: "text-[var(--success)]",
      bg: "bg-[var(--success)]/10",
      href: "/dashboard/bookings",
    },
    {
      label: "Total Customers",
      value: stats?.customers ?? 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      href: "/dashboard/customers",
    },
    {
      label: "Active Services",
      value: business?.services?.length ?? stats?.activeServices ?? 0,
      icon: Globe,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      href: "/dashboard/settings",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            Good {getGreeting()}, {businessName} 👋
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Here&apos;s your real-time business performance across appointments, CRM, and revenue.
          </p>
        </div>
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--lime)] text-[var(--bg-void)] font-bold text-sm rounded-xl hover:bg-[var(--lime-hover)] transition-colors shrink-0 shadow-sm"
        >
          <Calendar size={15} /> New Appointment
        </Link>
      </div>

      {/* Tiered Plan Clinical Status Banner */}
      {(() => {
        const rawPlan = String(data?.subscription?.planId || "PILOT").toUpperCase();
        const isPilot = rawPlan === "PILOT";
        const isStarter = rawPlan === "STARTER";
        const isGrowth = rawPlan === "GROWTH" || rawPlan === "PRO";
        const isConcierge = rawPlan === "CONCIERGE" || rawPlan.includes("SETUP");

        return (
          <div className="p-6 bg-[#09090B] border border-white/20 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {isPilot && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-mono font-bold">
                      <Sparkles size={13} className="text-white" /> PILOT PRACTICE (FREE COMMUNITY TIER)
                    </span>
                  )}
                  {isStarter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black text-xs font-mono font-black shadow-[0_0_15px_rgba(255,255,255,0.7)]">
                      <ShieldCheck size={13} /> STARTER PRACTICE OS (PAID · UNLIMITED)
                    </span>
                  )}
                  {isGrowth && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black text-xs font-mono font-black shadow-[0_0_20px_#ffffff]">
                      <Crown size={14} /> GROWTH CLINICAL ENTERPRISE (PAID · ALL ENGINES UNLOCKED)
                    </span>
                  )}
                  {isConcierge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black text-xs font-mono font-black shadow-[0_0_20px_#ffffff]">
                      <Award size={14} /> CONCIERGE CERTIFIED PRACTICE (MANAGED &amp; CUSTOM DOMAIN)
                    </span>
                  )}
                  <span className="text-xs font-mono text-zinc-400">
                    ● Direct UPI Settlement Active · 0% Aggregator Commission
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-display">
                  {isPilot && "Doctor Pilot Sandbox Active · 50 Monthly Consultations Included"}
                  {isStarter && "Single-Doctor Clinical Workspace · Unlimited Bookings & Instant UPI Tokens"}
                  {isGrowth && "Multi-Doctor Specialty Enterprise · Automated 24h Reminders & AI Marketing Suite"}
                  {isConcierge && "VIP Managed Practice Setup · Custom Domain & Dedicated Specialist Assigned"}
                </h3>

                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  {isPilot && "You are operating on the complimentary Pilot tier with a 50 monthly appointment cap. Upgrade to Starter or Growth to unlock unlimited patient volume, custom branding, and automated follow-ups."}
                  {isStarter && "Includes unlimited patient appointments, direct Razorpay UPI settlement to your clinic's bank account, digital OPD tokens, and Google Maps routing."}
                  {isGrowth && "Includes multi-doctor calendars (Physician, Dental, Derma), automated 24h WhatsApp reminders, pre-op fasting guides, post-visit review marketing, and AI content engines."}
                  {isConcierge && "Includes 30-day Growth Suite access, personalized domain mapping, and ongoing practice onboarding management from Ameya Kshirsagar."}
                </p>
              </div>

              {/* Action according to tier */}
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {isPilot && (
                  <Link
                    href="/checkout?plan=starter"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-black font-black text-xs hover:brightness-110 shadow-[0_0_20px_rgba(255,255,255,0.7)] transition-all flex items-center justify-center gap-2"
                  >
                    Upgrade to Starter (₹999/mo) <ArrowRight size={15} />
                  </Link>
                )}
                <Link
                  href="/pricing"
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-1.5"
                >
                  View Plan Capabilities
                </Link>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Monthly Slot Capacity</span>
                <span className="font-bold text-white mt-0.5 block">{isPilot ? "50 Appointments" : "Unlimited Bookings"}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Aggregator Commission</span>
                <span className="font-bold text-white mt-0.5 block">0% Take-Rate (Direct Bank)</span>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">WhatsApp Automation</span>
                <span className="font-bold text-white mt-0.5 block">{isPilot ? "Standard Receipts" : "24h Reminders & Reviews"}</span>
              </div>
              <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Compliance Standard</span>
                <span className="font-bold text-white mt-0.5 block">DPDP Act 2023 Encrypted</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Indian Hindu Calendar Festivals & Patient Birthday Automation Panel */}
      {(() => {
        const festStatus = getHinduCalendarStatus(new Date(), businessName);
        return (
          <div className="p-6 bg-[#09090B] border border-white/20 rounded-3xl shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_0_15px_#ffffff]">
                  <Flame size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    Indian Hindu Calendar Festivals &amp; Patient Birthday Automation
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Automated, respectful festive blessings and birthday wishes sent from {businessName}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-zinc-400 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Festival Engine */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-zinc-400 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-white" /> Hindu Festival Status
                  </span>
                  {festStatus.festivalToday ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-black font-mono font-black text-[10px]">
                      FESTIVAL TODAY
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono text-[10px]">
                      REGULAR OPD SCHEDULE
                    </span>
                  )}
                </div>

                {festStatus.festivalToday ? (
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white">
                      {festStatus.festivalToday.name} ({festStatus.festivalToday.hindiName})
                    </h4>
                    <p className="text-xs text-zinc-300 bg-white/5 p-3 rounded-xl border border-white/10 font-sans leading-relaxed">
                      &ldquo;{festStatus.festivalGreetingText}&rdquo;
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      💡 <strong>Clinical Health Tip:</strong> {festStatus.festivalToday.healthTip}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-300">
                      No Hindu festival matches today&apos;s date. Routine OPD schedules and follow-up reminders are running uninterrupted.
                    </p>
                    {festStatus.upcomingFestivals.length > 0 && (
                      <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10 space-y-1 text-xs">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase block">Next Auspicious Festival</span>
                        <p className="font-bold text-white">{festStatus.upcomingFestivals[0].name} ({festStatus.upcomingFestivals[0].startDate})</p>
                        <p className="text-[11px] text-zinc-400">{festStatus.upcomingFestivals[0].healthTip}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Birthday Automation Engine */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-zinc-400 flex items-center gap-1.5">
                    <Gift size={13} className="text-white" /> Patient Birthday Greetings
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px] border border-white/20">
                    AUTO SCAN 09:00 AM
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-zinc-300">
                    Patients with birthdays recorded in your CRM automatically receive personalized clinical wishes and an annual preventive check-up link.
                  </p>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-xs">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Clinical Birthday Template Preview</span>
                    <p className="text-zinc-200 italic leading-relaxed">
                      &ldquo;Dear Patient, Happy Birthday! 🎂 {businessName} wishes you vibrant health, vitality, and longevity on your special day. Thank you for entrusting us with your healthcare!&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-400">
                      Channel: WhatsApp &amp; Email
                    </span>
                    <Link
                      href="/api/cron/greetings"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-black text-xs rounded-xl hover:brightness-110 transition-all shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                    >
                      <Send size={12} /> Test Greetings Dispatch
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={card.href}
                className="block p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl hover:border-[var(--lime)]/30 transition-all group shadow-sm hover:shadow"
              >
                <div className={`inline-flex p-2.5 rounded-xl ${card.bg} mb-4`}>
                  <Icon size={18} className={card.color} />
                </div>
                <div className="text-2xl font-black text-[var(--text-primary)] mb-1">{card.value}</div>
                <div className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1">
                  {card.label}
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--lime)]" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Dedicated Patient No-Show Report Card */}
      {(() => {
        const noShowCount = stats?.noShowCount ?? (business?.bookings?.filter((b: any) => b.status === "NO_SHOW").length || 0);
        const totalSlots = stats?.totalBookings ?? (business?.bookings?.length || 0);
        const noShowRate = stats?.noShowRate ?? (totalSlots > 0 ? Math.round((noShowCount / totalSlots) * 100) : 0);
        const lostRevenue = stats?.lostRevenue ?? (business?.bookings?.filter((b: any) => b.status === "NO_SHOW").reduce((acc: number, b: any) => acc + (Number(b.price) || 0), 0) || 0);

        return (
          <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <UserX size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-display">Patient No-Show &amp; Lost Revenue Report</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Tracking missed consultation appointments and estimated lost revenue</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 self-start sm:self-auto">
                OPD Slot Protection
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <p className="text-xs font-mono text-[var(--text-muted)]">No-Show Appointments</p>
                <p className="text-2xl font-black text-amber-400 font-display mt-1">{noShowCount} patients</p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Unattended booked slots</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <p className="text-xs font-mono text-[var(--text-muted)]">No-Show Rate</p>
                <p className="text-2xl font-black text-white font-display mt-1">{noShowRate}%</p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Of all recorded patient bookings</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <p className="text-xs font-mono text-[var(--text-muted)]">Estimated Lost Revenue</p>
                <p className="text-2xl font-black text-red-400 font-display mt-1">₹{lostRevenue.toLocaleString("en-IN")}</p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Protected with UPI Advance tokens</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Action Center - Urgent triage for today */}
      <ActionCenter
        business={business}
        bookings={data.upcomingBookings || []}
        enquiries={enquiries}
      />

      {/* Autonomous Growth & Revenue Progress Engine */}
      <div className="p-6 bg-[var(--bg-surface)] border border-[var(--lime)]/30 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--lime)]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] text-xs font-mono font-bold uppercase mb-2 border border-[var(--lime)]/30">
              <Sparkles size={13} /> Target ₹1,00,000/Mo Run-Rate Milestone
            </div>
            <h2 className="text-xl font-black text-[var(--text-primary)] font-display">
              Client Acquisition &amp; Revenue Milestone Trackers
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/tools/whatsapp-nurturer"
              className="px-3.5 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare size={14} /> Auto WhatsApp Funnel
            </Link>
            <Link
              href="/dashboard/ai-content"
              className="px-3.5 py-2 rounded-xl bg-[var(--lime)] text-black hover:bg-[var(--lime-hover)] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-[var(--lime-glow-sm)]"
            >
              <Sparkles size={14} /> AI Marketing Suite
            </Link>
          </div>
        </div>

        {/* 4 Interactive Growth Progress Trackers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Marketing & Lead Capture */}
          <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] mb-1">
                <span>Marketing &amp; Leads</span>
                <span className="text-[var(--lime)] font-mono">85% Ready</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">Instagram Bio + Google Maps booking link active</p>
              <div className="w-full h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden mt-3 border border-[var(--border-subtle)]">
                <div className="h-full bg-[var(--lime)] rounded-full transition-all duration-1000" style={{ width: "85%" }} />
              </div>
            </div>
            <Link href="/dashboard/website" className="text-[11px] font-bold text-[var(--lime)] hover:underline flex items-center gap-1 pt-1">
              Customize Storefront <ArrowRight size={12} />
            </Link>
          </div>

          {/* 2. Monthly Revenue Milestone (Target: ₹1,00,000) */}
          <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] mb-1">
                <span>Monthly ₹1L Milestone</span>
                <span className="text-emerald-400 font-mono">
                  {Math.min(100, Math.round(((stats.monthlyRevenue || 0) / 100000) * 100))}%
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {formatCurrency(stats.monthlyRevenue || 0)} / ₹1,00,000 monthly run-rate
              </p>
              <div className="w-full h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden mt-3 border border-[var(--border-subtle)]">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-[var(--lime)] rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(8, Math.round(((stats.monthlyRevenue || 0) / 100000) * 100)))}%` }}
                />
              </div>
            </div>
            <Link href="/dashboard/analytics" className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 pt-1">
              View Revenue Funnel <ArrowRight size={12} />
            </Link>
          </div>

          {/* 3. Client Retention & Fulfillment */}
          <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] mb-1">
                <span>Client Fulfillment</span>
                <span className="text-blue-400 font-mono">{stats.completionRate ?? 95}%</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                {stats.customers || 0} Clients · 0 Double-Booking Shield
              </p>
              <div className="w-full h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden mt-3 border border-[var(--border-subtle)]">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${stats.completionRate ?? 95}%` }} />
              </div>
            </div>
            <Link href="/dashboard/customers" className="text-[11px] font-bold text-blue-400 hover:underline flex items-center gap-1 pt-1">
              Manage Client LTV <ArrowRight size={12} />
            </Link>
          </div>

          {/* 4. WhatsApp & Social Automation */}
          <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] mb-1">
                <span>Social Automation</span>
                <span className="text-purple-400 font-mono">92% Live</span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">24h Reminders + AI Auto-Replies Active</p>
              <div className="w-full h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden mt-3 border border-[var(--border-subtle)]">
                <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: "92%" }} />
              </div>
            </div>
            <Link href="/dashboard/whatsapp" className="text-[11px] font-bold text-purple-400 hover:underline flex items-center gap-1 pt-1">
              WhatsApp Inbox &amp; AI <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}

        <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
            <h2 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Calendar size={16} className="text-[var(--lime)]" />
              Upcoming Verified Bookings
            </h2>
            <Link href="/dashboard/bookings" className="text-xs text-[var(--lime)] hover:underline font-bold">
              View all appointments →
            </Link>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            {upcomingBookings.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Calendar size={32} className="mx-auto mb-3 text-[var(--text-disabled)]" />
                <p className="text-sm text-[var(--text-muted)] mb-4">No upcoming bookings recorded today</p>
                <Link href={`/book/${business.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-xs text-[var(--lime)] font-bold hover:underline">
                  Share your booking page <ExternalLink size={12} />
                </Link>
              </div>
            ) : (
              upcomingBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--bg-elevated)] transition-colors">
                  <div className="text-center min-w-[44px] p-1.5 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
                    <div className="text-[10px] font-black text-[var(--lime)] uppercase">
                      {new Date(booking.date).toLocaleDateString("en-IN", { month: "short" })}
                    </div>
                    <div className="text-xl font-extrabold text-[var(--text-primary)] leading-none mt-0.5">
                      {new Date(booking.date).getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[var(--text-primary)] truncate">{booking.customerName}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {booking.service?.name ?? "Service Consultation"} · <span className="text-[var(--text-secondary)] font-semibold">{booking.startTime}</span>
                    </p>
                  </div>
                  <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-md border ${STATUS_STYLES[booking.status] ?? ""}`}>
                    {booking.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Recent Customer Enquiries */}
          <div className="border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30">
              <h2 className="font-bold text-[var(--text-primary)] flex items-center gap-2 text-sm">
                <MessageSquare size={15} className="text-[var(--lime)]" />
                Recent Customer Enquiries ({enquiries.length})
              </h2>
            </div>

            <div className="divide-y divide-[var(--border-subtle)]">
              {enquiries.length === 0 ? (
                <div className="px-6 py-6 text-center text-xs text-[var(--text-muted)]">
                  No direct customer enquiries received yet.
                </div>
              ) : (
                enquiries.map((enq: any) => (
                  <div key={enq.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 px-6 hover:bg-[var(--bg-elevated)] transition-colors gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-[var(--text-primary)]">{enq.name}</span>
                        {enq.serviceName && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--lime)]/10 text-[var(--lime)] font-bold">
                            {enq.serviceName}
                          </span>
                        )}
                        <select
                          value={enq.status}
                          onChange={(e) => handleEnquiryStatusChange(enq.id, e.target.value as any)}
                          className="text-[10px] font-bold uppercase rounded-lg px-2 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer focus:outline-none focus:border-[var(--lime)] hover:border-[var(--lime)]/50 transition-colors"
                          title="Click to advance enquiry status"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="BOOKED">BOOKED</option>
                          <option value="LOST">LOST</option>
                        </select>
                      </div>
                      {enq.message && (
                        <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1 italic">
                          &ldquo;{enq.message}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${enq.name}, thank you for reaching out to ${business.name}!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare size={13} /> WhatsApp
                      </a>
                      <a
                        href={`tel:${enq.phone}`}
                        className="p-1.5 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-subtle)] transition-colors"
                        title="Call Customer"
                      >
                        <Phone size={13} />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Real-time Statistical Engine Analytics */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Activity size={16} className="text-[var(--lime)]" /> Business Intelligence Engine
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-0.5">Avg Order Value</span>
                <span className="text-lg font-black text-[var(--text-primary)]">{formatCurrency(stats.averageOrderValue || 0)}</span>
              </div>
              <div className="p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-subtle)]">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-0.5">Fulfillment Rate</span>
                <span className="text-lg font-black text-[var(--lime)]">{stats.completionRate ?? 100}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-[var(--lime)]/10 to-transparent border border-[var(--lime)]/20 rounded-xl">
              <Award size={18} className="text-[var(--lime)] shrink-0" />
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Lifetime Realized Revenue: <strong className="text-[var(--lime)] font-black">{formatCurrency(stats.totalRevenue || 0)}</strong>
              </p>
            </div>
          </div>

          {/* Booking Link */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1 flex items-center gap-2">
              <Globe size={15} className="text-[var(--lime)]" /> Your Booking Link
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">Share on WhatsApp & Social Media to receive instant bookings</p>
            <div className="flex items-center gap-2 p-2.5 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)]">
              <span className="text-xs text-[var(--text-secondary)] truncate flex-1 font-mono">
                {bookingUrl.replace("https://", "")}
              </span>
              <button
                onClick={handleCopy}
                className="shrink-0 p-1.5 text-[var(--text-muted)] hover:text-[var(--lime)] transition-colors flex items-center gap-1"
                title="Copy Link"
              >
                {copied ? <CheckCircle2 size={15} className="text-[var(--lime)]" /> : <Copy size={15} />}
                {copied && <span className="text-[10px] text-[var(--lime)] font-bold">Copied!</span>}
              </button>
            </div>
            <Link href={`/book/${business.slug}`} target="_blank" className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-[var(--lime)] border border-[var(--lime)]/30 rounded-xl hover:bg-[var(--lime)]/10 transition-colors">
              <ExternalLink size={13} /> Open Live Page
            </Link>
          </div>

          {/* AI Suggestions */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Sparkles size={15} className="text-[var(--lime)]" /> Automated Insights
            </h3>
            <div className="space-y-3">
              {[
                { text: "Post on Instagram — it's been 7 days", href: "/dashboard/ai-content" },
                { text: `Review CRM notes for ${stats.customers} registered clients`, href: "/dashboard/customers" },
                { text: "Update website layout section toggles", href: "/dashboard/website" },
              ].map((s, i) => (
                <Link key={i} href={s.href} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] hover:text-[var(--lime)] transition-colors group">
                  <AlertCircle size={14} className="text-[var(--warning)] mt-0.5 shrink-0" />
                  <span className="group-hover:underline font-medium">{s.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
