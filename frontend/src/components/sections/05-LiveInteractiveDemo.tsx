"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Stethoscope, 
  Smartphone, 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  Check,
  RefreshCw,
  Bell,
  ShieldCheck,
  Lock,
  QrCode,
  Activity,
  FileText,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export const LiveInteractiveDemo = () => {
  const [activeStep, setActiveStep] = useState<"practice" | "patient" | "dashboard">("practice");
  const [specialty, setSpecialty] = useState<"opd" | "dental" | "derma">("opd");
  const [selectedSlot, setSelectedSlot] = useState("11:20 AM");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const practiceData = {
    opd: {
      name: "Dr. Rajesh Kulkarni Clinic",
      doctor: "Dr. Rajesh Kulkarni, MD",
      specialty: "Consultant Physician & Diabetology",
      regNo: "MCI Reg: 2011/04/0982",
      location: "FC Road, Deccan Gymkhana, Pune",
      hours: "10:00 AM – 01:30 PM | 05:00 PM – 08:30 PM",
      service: "General OPD Consultation & Chronic Disease Review",
      duration: "20 mins",
      fee: "₹800",
      tokenNumber: "OPD #14",
      patient: "Suresh Deshmukh (54/M)",
      uhid: "UHID-DEMO-98214",
      slots: ["10:15 AM", "11:20 AM", "12:00 PM", "05:30 PM", "06:15 PM", "07:30 PM"],
    },
    dental: {
      name: "Apex Dental & Maxillofacial Care",
      doctor: "Dr. Ananya Sen, MDS (Endodontics)",
      specialty: "Digital Dentistry & Root Canal Care",
      regNo: "DCI Reg: D-14890",
      location: "Koregaon Park Main Road, Pune",
      hours: "10:30 AM – 08:00 PM (Mon–Sat)",
      service: "Digital 3D CBCT Scan & Root Canal Consult",
      duration: "35 mins",
      fee: "₹1,200",
      tokenNumber: "CHAIR #02",
      patient: "Pooja Kulkarni (29/F)",
      uhid: "UHID-DEMO-34102",
      slots: ["11:00 AM", "01:30 PM", "02:45 PM", "04:15 PM", "05:45 PM", "07:00 PM"],
    },
    derma: {
      name: "SkinCraft Dermatology & Laser Center",
      doctor: "Dr. Priya Mehta, MD (Dermatology)",
      specialty: "Clinical Cosmetology & Laser Therapy",
      regNo: "MMC Reg: 2016/08/2104",
      location: "Bandra West, Mumbai",
      hours: "11:00 AM – 07:30 PM (Tue–Sun)",
      service: "Clinical Cosmetology & Q-Switch Laser Consult",
      duration: "30 mins",
      fee: "₹1,500",
      tokenNumber: "SUITE #01",
      patient: "Neha Joshi (32/F)",
      uhid: "UHID-DEMO-77190",
      slots: ["11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM", "06:00 PM", "07:00 PM"],
    },
  };

  const current = practiceData[specialty];

  const handlePatientBook = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setActiveStep("dashboard");
    }, 850);
  };

  const handleReset = () => {
    setBookingConfirmed(false);
    setActiveStep("practice");
  };

  return (
    <section id="demo" className="py-24 bg-black border-y border-white/10 relative overflow-hidden">
      {/* Background Luminous Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-white/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-white bg-white/10 px-3.5 py-1 rounded-full border border-white/20 mb-3.5 inline-block shadow-[0_0_15px_rgba(255,255,255,0.15)]">
            ⚡ Clinical Workflow Simulator
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-4">
            See the Complete Clinical Journey in Action
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            From practice profile setup to patient self-scheduling and real-time OPD dashboard arrival with zero aggregator commissions.
          </p>
        </div>

        {/* 3-Step Clinical Navigator */}
        <div className="max-w-3xl mx-auto mb-10 flex justify-center">
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#09090B] border border-white/20 rounded-2xl w-full shadow-2xl">
            <button
              onClick={() => setActiveStep("practice")}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeStep === "practice"
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.7)] font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Stethoscope size={16} /> 1. Practice Setup
            </button>
            <button
              onClick={() => setActiveStep("patient")}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeStep === "patient"
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.7)] font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Smartphone size={16} /> 2. Patient Booking
            </button>
            <button
              onClick={() => setActiveStep("dashboard")}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeStep === "dashboard"
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.7)] font-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <LayoutDashboard size={16} /> 3. Doctor Dashboard
            </button>
          </div>
        </div>

        {/* Interactive Simulation Screen */}
        <div className="max-w-4xl mx-auto bg-[#09090B] border border-white/20 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative min-h-[490px]">
          {/* Synthetic Demo Banner Notice */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2 text-zinc-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_#ffffff]" />
              <span>Synthetic Demonstration Sandbox · DPDP Act 2023 Compliant</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[10px] border border-white/20">
              <Lock size={10} /> Zero Real PII
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: CLINIC & PRACTICE CONFIGURATION */}
            {activeStep === "practice" && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Specialty Switcher */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-xs font-mono text-zinc-400 uppercase font-bold">Step 1 • Practice Configuration</span>
                    <h3 className="text-xl font-bold text-white font-display mt-0.5">
                      Configure Your Clinical Consultation Schedule
                    </h3>
                  </div>

                  {/* Specialty Tabs */}
                  <div className="inline-flex p-1 bg-black rounded-xl border border-white/15">
                    {(["opd", "dental", "derma"] as const).map((spec) => (
                      <button
                        key={spec}
                        onClick={() => {
                          setSpecialty(spec);
                          setSelectedSlot(practiceData[spec].slots[1]);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          specialty === spec
                            ? "bg-white text-black shadow-md font-black"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        {spec === "opd" ? "Physician OPD" : spec === "dental" ? "Dental" : "Derma"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Practice Profile Card */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-black/60 rounded-2xl border border-white/10 space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Clinical Practice Profile</label>
                    <p className="font-bold text-sm text-white">{current.name}</p>
                    <p className="text-xs text-zinc-300">{current.doctor} ({current.specialty})</p>
                    <p className="text-[11px] font-mono text-zinc-500 pt-1">{current.regNo} · {current.location}</p>
                  </div>
                  <div className="p-4 bg-black/60 rounded-2xl border border-white/10 space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase font-mono">OPD Hours &amp; Queue Buffers</label>
                    <p className="font-bold text-sm text-white">{current.hours}</p>
                    <p className="text-xs text-white/90 font-mono pt-1">
                      ● Dynamic 15-min consultation buffer · 0% double bookings
                    </p>
                    <p className="text-[11px] text-zinc-400">Direct ICICI/HDFC UPI Settlement · 0% Aggregator Commission</p>
                  </div>
                </div>

                {/* Configured Clinical Service */}
                <div className="p-4 bg-black/60 rounded-2xl border border-white/10 space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Published Clinical Consultation</label>
                  <div className="p-3.5 bg-[#09090B] rounded-xl border border-white/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20">
                        <Stethoscope size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">{current.service}</p>
                        <p className="text-xs text-zinc-400">⏱ {current.duration} · WhatsApp Digital Prescription Slip &amp; Directions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-sm text-white">{current.fee}</span>
                      <span className="block text-[10px] font-mono text-zinc-500">0% take-rate</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveStep("patient")}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-black text-xs sm:text-sm rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(255,255,255,0.7)]"
                  >
                    Publish Practice &amp; Test Patient Flow <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: PATIENT BOOKING EXPERIENCE */}
            {activeStep === "patient" && (
              <motion.div
                key="patient"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-zinc-400 uppercase font-bold">Step 2 • Patient Self-Service View</span>
                    <h3 className="text-xl font-bold text-white font-display">
                      Patient Books Consultation in 30 Seconds
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                    docodo.in/clinic/{specialty}-live
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Selected service summary */}
                  <div className="space-y-4">
                    <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                      <p className="text-xs text-zinc-500 font-bold mb-1 uppercase font-mono">Selected Consultation</p>
                      <p className="font-bold text-sm text-white">{current.service}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{current.doctor}</p>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/10 text-xs font-mono">
                        <span className="text-zinc-400">Duration: {current.duration}</span>
                        <span className="font-bold text-white">{current.fee}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase font-mono">Select Available OPD Slot</label>
                      <div className="grid grid-cols-3 gap-2">
                        {current.slots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                              selectedSlot === slot
                                ? "bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                                : "bg-black/60 text-zinc-300 border-white/10 hover:border-white/30"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Synthetic Patient Details */}
                  <div className="space-y-4">
                    <div className="space-y-3 p-4 bg-black/60 rounded-2xl border border-white/10">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Patient Name (Synthetic Record)</label>
                        <input
                          type="text"
                          readOnly
                          value={current.patient}
                          className="w-full mt-1 px-3 py-2 bg-black border border-white/20 rounded-xl text-sm text-white font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Assigned UHID</label>
                          <input
                            type="text"
                            readOnly
                            value={current.uhid}
                            className="w-full mt-1 px-3 py-2 bg-black border border-white/20 rounded-xl text-xs text-zinc-300 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-zinc-500 uppercase font-mono">WhatsApp Number</label>
                          <input
                            type="text"
                            readOnly
                            value="+91 98230 12345"
                            className="w-full mt-1 px-3 py-2 bg-black border border-white/20 rounded-xl text-xs text-zinc-300 font-mono"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 pt-1">
                        <ShieldCheck size={12} className="text-white shrink-0" />
                        Explicit consent given for digital appointment slips &amp; Google Maps clinic routing.
                      </p>
                    </div>

                    <button
                      onClick={handlePatientBook}
                      className="w-full py-3.5 bg-white text-black font-black text-xs sm:text-sm rounded-xl hover:brightness-110 transition-all shadow-[0_0_20px_rgba(255,255,255,0.7)] flex items-center justify-center gap-2"
                    >
                      {bookingConfirmed ? (
                        <>
                          <Check size={18} /> Slot Reserved! Routing to Doctor Console...
                        </>
                      ) : (
                        <>
                          Lock Consultation Slot ({selectedSlot}) <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: LIVE DOCTOR OPD DASHBOARD */}
            {activeStep === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs font-mono text-zinc-400 uppercase font-bold">Step 3 • Doctor Real-Time Console</span>
                    <h3 className="text-xl font-bold text-white font-display">
                      Consultation Arrives Instantly in Practice Queue
                    </h3>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white font-mono transition-colors"
                  >
                    <RefreshCw size={12} /> Restart Simulator
                  </button>
                </div>

                {/* Dashboard Instant Alert Banner */}
                <div className="p-4 bg-white/5 border border-white/25 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white text-black shadow-[0_0_15px_#ffffff]">
                      <Bell size={18} className="animate-bounce" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">
                        New Patient Checked In: {current.patient}
                      </p>
                      <p className="text-xs text-zinc-300">
                        {current.tokenNumber} · {current.service} · {selectedSlot} · {current.fee} Paid (Direct UPI)
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white text-black text-xs font-black rounded-full font-mono shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                    CONFIRMED
                  </span>
                </div>

                {/* Live Clinical Dashboard Snapshot */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                    <span className="text-xs text-zinc-500 font-bold uppercase font-mono">Today's OPD Queue</span>
                    <p className="text-2xl font-black text-white font-display mt-1">14 patients</p>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">● +1 added just now ({current.tokenNumber})</p>
                  </div>
                  <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                    <span className="text-xs text-zinc-500 font-bold uppercase font-mono">Today's Practice Revenue</span>
                    <p className="text-2xl font-black text-white font-display mt-1">₹11,200</p>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">100% Direct Bank Settlement (0% Commission)</p>
                  </div>
                  <div className="p-4 bg-black/60 rounded-2xl border border-white/10">
                    <span className="text-xs text-zinc-500 font-bold uppercase font-mono">WhatsApp Token Slip</span>
                    <p className="text-sm font-bold text-white mt-1">Dispatched to Patient</p>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Includes QR Code &amp; Clinic Maps Link</p>
                  </div>
                </div>

                {/* Doctor CTA */}
                <div className="p-5 bg-black/60 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-sm text-white">Ready to deploy Docodo for your clinic?</p>
                    <p className="text-xs text-zinc-400">Launch in 15 minutes. ₹0 setup fee for Pilot Program members.</p>
                  </div>
                  <Link href="/auth/signup">
                    <Button variant="primary" size="md" className="shadow-[0_0_15px_rgba(255,255,255,0.7)] font-black text-xs sm:text-sm">
                      Start Doctor Onboarding <ArrowRight size={16} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
