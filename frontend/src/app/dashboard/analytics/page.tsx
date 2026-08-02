"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Users, DollarSign, Calendar,
  ArrowUpRight, ShieldCheck, Clock, Award, ChevronDown
} from "lucide-react";

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState("30D");

  const metrics = [
    { title: "Gross Booked Revenue", val: "₹1,48,500", change: "+24.8%", icon: DollarSign, isPositive: true, sub: "vs previous 30 days" },
    { title: "Confirmed Bookings", val: "342 slots", change: "+18.2%", icon: Calendar, isPositive: true, sub: "94.2% completion rate" },
    { title: "Customer Retention LTV", val: "₹2,840", change: "+31.4%", icon: Users, isPositive: true, sub: "Avg lifetime spend" },
    { title: "WhatsApp Conversion", val: "68.4%", change: "+12.1%", icon: TrendingUp, isPositive: true, sub: "From automated followups" },
  ];

  const weeklyChartData = [
    { day: "Mon", revenue: 42, label: "₹18.4k" },
    { day: "Tue", revenue: 65, label: "₹24.1k" },
    { day: "Wed", revenue: 52, label: "₹21.0k" },
    { day: "Thu", revenue: 80, label: "₹31.5k" },
    { day: "Fri", revenue: 95, label: "₹36.8k" },
    { day: "Sat", revenue: 100, label: "₹42.2k" },
    { day: "Sun", revenue: 75, label: "₹28.9k" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-6">
      {/* Header with touch-friendly filter buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-default)] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[var(--lime-ghost)] text-[var(--lime)] rounded-xl border border-[var(--lime)]/30 shrink-0 shadow-inner">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-display">Growth Analytics</h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
              Real-time Indian commerce intelligence & conversion funnels.
            </p>
          </div>
        </div>

        {/* Mobile-first pills */}
        <div className="flex bg-[var(--bg-elevated)] p-1 rounded-xl border border-[var(--border-subtle)] w-full sm:w-auto">
          {(["7D", "30D", "90D", "ALL"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-black font-mono transition-all ${
                timeRange === range
                  ? "bg-[var(--lime)] text-black shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile-First Stackable KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-default)] flex flex-col justify-between hover:border-[var(--lime)]/30 transition-all shadow-md group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[var(--text-secondary)]">{m.title}</span>
                <div className="p-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--text-secondary)] group-hover:text-[var(--lime)] transition-colors">
                  <Icon size={16} />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[var(--text-primary)] font-display">{m.val}</span>
                  <span className="inline-flex items-center text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {m.change} <ArrowUpRight size={12} />
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">{m.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Responsive Visual Revenue Chart */}
      <div className="bg-[var(--bg-surface)] p-5 sm:p-6 rounded-2xl border border-[var(--border-default)] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h2 className="text-base font-extrabold text-[var(--text-primary)] font-display">7-Day Revenue Trajectory</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Automated UPI, Cards & Cash bookings</p>
          </div>
          <span className="text-xs font-bold font-mono text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/20 self-start sm:self-auto">
            ● Peak Traffic: Saturdays
          </span>
        </div>

        {/* Mobile-Friendly Bar Visualization */}
        <div className="h-48 sm:h-56 flex items-end justify-between gap-2 pt-8 px-2">
          {weeklyChartData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] sm:text-xs font-black font-mono text-[var(--lime)] bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded border border-[var(--lime)]/30 -mb-1">
                {d.label}
              </span>
              <div className="w-full max-w-[38px] bg-[var(--bg-elevated)] rounded-t-lg overflow-hidden h-36 flex items-end p-0.5">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${d.revenue}%` }}
                  transition={{ duration: 0.8, type: "spring" }}
                  className={`w-full rounded-t-md transition-all ${
                    d.revenue === 100
                      ? "bg-[var(--lime)] shadow-[var(--lime-glow-sm)]"
                      : "bg-gradient-to-t from-[var(--lime-dim)]/40 to-[var(--lime-dim)] group-hover:from-[var(--lime)]/80 group-hover:to-[var(--lime)]"
                  }`}
                />
              </div>
              <span className="text-xs font-bold text-[var(--text-secondary)] font-mono group-hover:text-[var(--text-primary)] transition-colors">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel & Conversion breakdown in simple mobile cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Booking Form Conversion", stat: "82.4%", desc: "Visitors who opened booking form completed reservation without dropping off.", badge: "Top Tier" },
          { title: "No-Show Prevention Rate", stat: "98.1%", desc: "Of all WhatsApp verified reminders showed up on time or successfully rescheduled.", badge: "AI Shield" },
          { title: "Repeat Customer Rate", stat: "41.8%", desc: "Clients returning for a 2nd or 3rd booking within the last 60 days.", badge: "High Loyalty" },
        ].map((card, idx) => (
          <div key={idx} className="bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-default)] space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[var(--text-primary)] font-display">{card.title}</span>
              <span className="text-[10px] font-mono font-bold uppercase text-[var(--lime)] bg-[var(--lime-ghost)] px-2 py-0.5 rounded border border-[var(--lime)]/20">
                {card.badge}
              </span>
            </div>
            <div className="text-3xl font-black text-[var(--lime)] font-display">{card.stat}</div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
