"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  Bell, 
  ArrowRight,
  ShieldCheck,
  User,
  Smartphone,
  CreditCard
} from "lucide-react";

export const HeroInteractiveShowcase = () => {
  const [activeTab, setActiveTab] = useState<"salon" | "clinic" | "fitness">("salon");
  const [slotStatus, setSlotStatus] = useState<"available" | "booked">("available");

  const businessData = {
    salon: {
      title: "Koregaon Luxury Salon & Spa",
      category: "Hair, Nails & Wellness",
      rating: "4.9 ★ (240+ Bookings)",
      service: "Signature Hair Spa & Styling",
      duration: "45 mins",
      price: "₹1,200",
      time: "Today at 04:30 PM",
      client: "Pooja Sharma",
      phone: "+91 98230 ••••",
      metric: "+38% Repeat Visits",
      metricSub: "Zero missed enquiries",
      tag: "Salon & Spa OS",
    },
    clinic: {
      title: "Dr. Kulkarni Dental Care",
      category: "Dentistry & Orthodontics",
      rating: "4.95 ★ (410+ Patients)",
      service: "Consultation & Digital Scan",
      duration: "30 mins",
      price: "₹800",
      time: "Tomorrow at 11:00 AM",
      client: "Amit Deshmukh",
      phone: "+91 97640 ••••",
      metric: "98% Slot Fill Rate",
      metricSub: "No-shows dropped to <2%",
      tag: "Clinic & Healthcare OS",
    },
    fitness: {
      title: "CoreStrength Fitness Studio",
      category: "Personal Training & Yoga",
      rating: "4.8 ★ (180+ Members)",
      service: "1-on-1 Personal Training Session",
      duration: "60 mins",
      price: "₹1,500",
      time: "Today at 06:00 PM",
      client: "Rohan Patil",
      phone: "+91 99220 ••••",
      metric: "100% Upfront Online Pay",
      metricSub: "Automated WhatsApp reminders",
      tag: "Fitness & Studios OS",
    },
  };

  const current = businessData[activeTab];

  return (
    <div className="relative w-full max-w-5xl mx-auto my-8">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-lime-400/10 via-emerald-500/5 to-cyan-500/10 blur-3xl -z-10 rounded-full" />

      {/* Business Category Pill Selector */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1.5 bg-[#121820]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
          {(["salon", "clinic", "fitness"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSlotStatus("available");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-[var(--lime)] text-black shadow-lg shadow-[var(--lime)]/20 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab === "salon" && "💇 Salon & Spa"}
              {tab === "clinic" && "🩺 Clinic & Healthcare"}
              {tab === "fitness" && "🏋️ Fitness & Studio"}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Composition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Central Floating Storefront & CRM Window (7 cols) */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 bg-[#10141D]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80 relative overflow-hidden"
        >
          {/* Top Browser Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline">
                docodo.in/book/{activeTab}-live
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live &amp; Accepting Bookings
            </div>
          </div>

          {/* Business Banner */}
          <div className="mt-5 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {current.title}
              </h3>
              <span className="text-xs font-bold text-slate-400">{current.rating}</span>
            </div>
            <p className="text-xs text-slate-400">{current.category} • Pune, Maharashtra</p>
          </div>

          {/* Selected Service Card */}
          <div className="mt-5 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400">Selected Service</p>
              <h4 className="text-sm font-bold text-white mt-0.5">{current.service}</h4>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                <span>⏱ {current.duration}</span>
                <span>•</span>
                <span className="text-[var(--lime)] font-mono font-bold">{current.price}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-lg bg-[var(--lime)]/10 text-[var(--lime)] text-xs font-bold font-mono">
                Slot: {current.time}
              </span>
            </div>
          </div>

          {/* Real-time Interaction Bar */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Smartphone size={16} className="text-emerald-400" />
              <span>Instant WhatsApp confirmation &amp; UPI payment</span>
            </div>
            <button
              onClick={() => setSlotStatus(slotStatus === "available" ? "booked" : "available")}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                slotStatus === "booked"
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                  : "bg-[var(--lime)] text-black shadow-lg shadow-[var(--lime)]/25 hover:brightness-110"
              }`}
            >
              {slotStatus === "booked" ? (
                <>
                  <CheckCircle2 size={15} /> Appointment Confirmed!
                </>
              ) : (
                <>
                  <Sparkles size={15} /> Test Live Booking (Click)
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Right: Floating Connected Micro-Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Immediate WhatsApp Notification Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="p-4 rounded-2xl bg-[#121926]/90 backdrop-blur-md border border-emerald-500/30 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-emerald-400">Automated WhatsApp Dispatch</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">0s latency</span>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
              <p className="text-xs font-bold text-white">✅ Booking Confirmed for {current.client}</p>
              <p className="text-[11px] text-slate-300">
                "{current.service}" on {current.time}
              </p>
              <p className="text-[10px] text-slate-400">
                Receipt and 24h reminder scheduled automatically.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Revenue & Retention Metric */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="p-4 rounded-2xl bg-[#121926]/90 backdrop-blur-md border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">Verified Merchant Impact</p>
                <h4 className="text-xl font-black text-white mt-1 flex items-center gap-1.5">
                  <TrendingUp size={20} className="text-[var(--lime)]" /> {current.metric}
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">{current.metricSub}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--lime)]/10 border border-[var(--lime)]/30 flex items-center justify-center text-xl">
                📈
              </div>
            </div>
          </motion.div>

          {/* Card 3: Indian Compliance & Zero-Commission Guarantee */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3 text-xs text-slate-300"
          >
            <ShieldCheck size={22} className="text-[var(--lime)] flex-shrink-0" />
            <div>
              <span className="font-bold text-white">0% Booking Commission</span> • All UPI payments settle directly to your Indian bank account via Razorpay.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
