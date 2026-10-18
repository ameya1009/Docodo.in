"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  FileText, 
  Stethoscope, 
  Activity, 
  Lock, 
  QrCode,
  UserCheck
} from "lucide-react";

export const HeroInteractiveShowcase = () => {
  const [activeTab, setActiveTab] = useState<"opd" | "dental" | "derma">("opd");
  const [slotStatus, setSlotStatus] = useState<"available" | "booked">("available");

  const clinicalData = {
    opd: {
      title: "Dr. Rajesh Kulkarni, MD",
      specialty: "Consultant Physician & Diabetology",
      regNo: "MCI Reg: 2011/04/0982",
      rating: "4.96 ★ (540+ Verified Patients)",
      service: "OPD Consultation & Chronic Disease Review",
      duration: "20 mins",
      fee: "₹800",
      tokenNumber: "OPD #14",
      slotTime: "Today at 11:20 AM",
      patient: "Suresh Deshmukh (54/M)",
      uhid: "UHID-PUN-98214",
      metric: "0% Double Bookings",
      metricSub: "Zero empty slots · WhatsApp token slips",
      artifactName: "Digital OPD Token Slip",
      artifactDetail: "Token #14 · Est. Wait 6 mins · Room 102",
      clinicLocation: "FC Road, Deccan Gymkhana, Pune",
      badge: "Physician & General OPD",
    },
    dental: {
      title: "Apex Dental & Maxillofacial Care",
      specialty: "Dr. Ananya Sen, MDS (Endodontics)",
      regNo: "DCI Reg: D-14890",
      rating: "4.94 ★ (380+ Verified Patients)",
      service: "Digital 3D CBCT Scan & Root Canal Consult",
      duration: "35 mins",
      fee: "₹1,200",
      tokenNumber: "CHAIR #02",
      slotTime: "Tomorrow at 02:45 PM",
      patient: "Pooja Kulkarni (29/F)",
      uhid: "UHID-DNT-34102",
      metric: "98% Slot Fill Rate",
      metricSub: "No-shows dropped from 28% to <2%",
      artifactName: "CBCT Digital Diagnostic Slot",
      artifactDetail: "Chair 2 · Pre-op Fasting Guide Sent",
      clinicLocation: "Koregaon Park Main Road, Pune",
      badge: "Dental & Implantology",
    },
    derma: {
      title: "SkinCraft Dermatology & Laser Center",
      specialty: "Dr. Priya Mehta, MD (Dermatology)",
      regNo: "MMC Reg: 2016/08/2104",
      rating: "4.98 ★ (620+ Verified Patients)",
      service: "Clinical Cosmetology & Q-Switch Laser Consult",
      duration: "30 mins",
      fee: "₹1,500",
      tokenNumber: "SUITE #01",
      slotTime: "Today at 04:30 PM",
      patient: "Neha Joshi (32/F)",
      uhid: "UHID-SKN-77190",
      metric: "100% Upfront UPI Advance",
      metricSub: "Direct ICICI settlement · 0% commission",
      artifactName: "Photo-Consent & Patch Test Slip",
      artifactDetail: "Suite 1 · Automated Post-Care WhatsApp",
      clinicLocation: "Bandra West, Mumbai",
      badge: "Dermatology & Aesthetics",
    },
  };

  const current = clinicalData[activeTab];

  return (
    <div className="relative w-full max-w-5xl mx-auto my-10">
      {/* Background Luminous White Aura */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-zinc-400/5 to-white/10 blur-3xl -z-10 rounded-full" />

      {/* Doctor Specialty Switcher */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1.5 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
          {(["opd", "dental", "derma"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSlotStatus("available");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab
                  ? "bg-white text-black font-black shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab === "opd" && <><Stethoscope size={14} /> Physician OPD</>}
              {tab === "dental" && <><Activity size={14} /> Dental & Surgery</>}
              {tab === "derma" && <><Sparkles size={14} /> Dermatology</>}
            </button>
          ))}
        </div>
      </div>

      {/* Main Clinical Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Doctor's Live Patient Booking & OPD Queue Console (7 cols) */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7 bg-[#09090B]/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden"
        >
          {/* Top Medical Portal Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_#ffffff]" />
              <span className="text-xs font-mono font-bold text-white tracking-wide">
                docodo.in/clinic/{activeTab}-live
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/30 text-[11px] font-bold text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              <Lock size={11} className="text-white" /> DPDP Act 2023 Encrypted
            </div>
          </div>

          {/* Doctor Profile Banner */}
          <div className="mt-5 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                {current.title}
              </h3>
              <span className="text-xs font-mono font-semibold text-zinc-400">{current.rating}</span>
            </div>
            <p className="text-xs text-zinc-300 font-medium">{current.specialty}</p>
            <p className="text-[11px] font-mono text-zinc-500">{current.regNo} · {current.clinicLocation}</p>
          </div>

          {/* Clinical Artifact 1: Doctor Consultation Slot & Atomic Lock */}
          <div className="mt-5 p-4 rounded-2xl bg-white/[0.04] border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white border border-white/20">
                  {current.badge}
                </span>
                <span className="text-[11px] text-zinc-400">⏱ {current.duration}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1.5">{current.service}</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Consultation Fee: <span className="text-white font-mono font-bold">{current.fee}</span>
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-lg bg-white text-black text-xs font-black font-mono shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                {slotStatus === "booked" ? "LOCKED · " + current.tokenNumber : "SLOT: " + current.slotTime}
              </span>
            </div>
          </div>

          {/* Clinical Artifact 2: OPD Digital Token & Patient UHID */}
          <div className="mt-3.5 p-3.5 rounded-xl bg-black/60 border border-white/10 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-[10px] font-mono uppercase text-zinc-500">Patient Registration</p>
              <p className="font-bold text-white mt-0.5 truncate">{current.patient}</p>
              <p className="text-[10px] font-mono text-zinc-400">{current.uhid}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-zinc-500">{current.artifactName}</p>
              <p className="font-bold text-white mt-0.5">{current.tokenNumber}</p>
              <p className="text-[10px] text-zinc-400">{current.artifactDetail}</p>
            </div>
          </div>

          {/* Interactive Consultation Lock Button */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <Smartphone size={16} className="text-white shrink-0" />
              <span>Instant WhatsApp prescription slip &amp; UPI QR receipt</span>
            </div>
            <button
              onClick={() => setSlotStatus(slotStatus === "available" ? "booked" : "available")}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                slotStatus === "booked"
                  ? "bg-white text-black shadow-[0_0_20px_#ffffff]"
                  : "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.7)] hover:brightness-110 active:scale-95"
              }`}
            >
              {slotStatus === "booked" ? (
                <>
                  <CheckCircle2 size={15} /> Consultation Slot Confirmed!
                </>
              ) : (
                <>
                  <Sparkles size={15} /> Test Live Patient Booking (Click)
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Right: Connected Medical Infrastructure Micro-Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: WhatsApp Patient Consultation & Token Dispatch */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-4 rounded-2xl bg-[#09090B]/95 backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-ping" />
                <span className="text-xs font-bold text-white">Automated WhatsApp Consultation Slip</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">0s Latency</span>
            </div>
            <div className="p-3 bg-black/80 rounded-xl border border-white/10 space-y-1.5 font-sans">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white">📋 {current.tokenNumber} · Confirmed</p>
                <QrCode size={16} className="text-white" />
              </div>
              <p className="text-[11px] text-zinc-300">
                Patient: <span className="text-white font-semibold">{current.patient}</span>
              </p>
              <p className="text-[10px] text-zinc-400">
                Doctor: {current.title} · {current.slotTime}
              </p>
              <div className="pt-1.5 border-t border-white/10 text-[10px] text-zinc-400 flex items-center justify-between">
                <span>📍 Directions: Google Maps Link</span>
                <span className="text-white font-mono font-bold">UPI Paid {current.fee}</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Practice Revenue & Empty Consultation Chair Elimination */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-4 rounded-2xl bg-[#09090B]/95 backdrop-blur-xl border border-white/20 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-400">Measured Clinical Impact</p>
                <h4 className="text-xl font-black text-white mt-1 flex items-center gap-2">
                  <TrendingUp size={20} className="text-white" /> {current.metric}
                </h4>
                <p className="text-[11px] text-zinc-300 mt-0.5">{current.metricSub}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <UserCheck size={24} />
              </div>
            </div>
          </motion.div>

          {/* Card 3: 0% Platform Take-Rate & Direct ICICI/HDFC Settlement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/15 flex items-center gap-3 text-xs text-zinc-300"
          >
            <ShieldCheck size={22} className="text-white shrink-0 drop-shadow-[0_0_8px_#ffffff]" />
            <div>
              <span className="font-bold text-white">0% Aggregator Commission</span> · All UPI consultation tokens settle directly to your clinic's Indian bank account with zero intermediary cuts.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
