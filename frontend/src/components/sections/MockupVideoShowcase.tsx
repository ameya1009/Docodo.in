"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Lock,
  QrCode,
  Building2,
  Check,
  ChevronRight,
  Star
} from "lucide-react";

export interface MockupVideoShowcaseProps {
  videoSrc?: string;
  posterSrc?: string;
  autoPlay?: boolean;
}

export interface WorkflowStep {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  duration: number; // in seconds
  urlSlug: string;
  statsPill: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "onboarding",
    title: "1. 15-Min Onboarding",
    shortTitle: "15-Min Setup",
    tagline: "Doctor Profile, MCI Registration & Instant UPI Activation",
    duration: 8,
    urlSlug: "onboarding-wizard",
    statsPill: "⚡ Live in 14m 20s"
  },
  {
    id: "calendar",
    title: "2. Patient Calendar",
    shortTitle: "OPD Calendar",
    tagline: "Live Queue, Atomic Slot Locking & Zero Double-Bookings",
    duration: 8,
    urlSlug: "live-opd-schedule",
    statsPill: "🛡️ 0% Double Bookings"
  },
  {
    id: "whatsapp",
    title: "3. UPI & WhatsApp Confirmation",
    shortTitle: "UPI & WhatsApp",
    tagline: "Automated Token Dispatch, DPDP Encryption & Direct ICICI Credit",
    duration: 8,
    urlSlug: "whatsapp-dispatch",
    statsPill: "📲 0.8s WhatsApp Delivery"
  },
  {
    id: "revenue",
    title: "4. Clinic Revenue Analytics",
    shortTitle: "Revenue Analytics",
    tagline: "Zero Aggregator Commission & Real-Time OPD Financial Growth",
    duration: 8,
    urlSlug: "practice-analytics",
    statsPill: "💰 100% Direct Settlement"
  }
];

export const TOTAL_DURATION = WORKFLOW_STEPS.reduce((acc, step) => acc + step.duration, 0); // 32 seconds

export const MockupVideoShowcase: React.FC<MockupVideoShowcaseProps> = ({
  videoSrc,
  posterSrc,
  autoPlay = true
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize activeStepIndex based on currentTime
  useEffect(() => {
    let accumulated = 0;
    for (let i = 0; i < WORKFLOW_STEPS.length; i++) {
      accumulated += WORKFLOW_STEPS[i].duration;
      if (currentTime < accumulated || i === WORKFLOW_STEPS.length - 1) {
        setActiveStepIndex(i);
        break;
      }
    }
  }, [currentTime]);

  // Handle HTML5 video syncing if real video is passed
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {
        // Autoplay policy prevented playback
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Sync video audio mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Sync video playback speed rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Main simulation timer loop when running dynamic walkthrough (pauses on hover)
  useEffect(() => {
    // If a physical video file is playing, let HTML5 video drive the timeline
    if (videoSrc) return;

    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 100;
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + (intervalMs / 1000) * playbackSpeed;
        if (next >= TOTAL_DURATION) {
          return 0; // Loop walkthrough
        }
        return next;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, playbackSpeed, videoSrc]);

  const handleStepClick = (index: number) => {
    let targetTime = 0;
    for (let i = 0; i < index; i++) {
      targetTime += WORKFLOW_STEPS[i].duration;
    }
    setCurrentTime(targetTime);
    setActiveStepIndex(index);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * TOTAL_DURATION;
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setCurrentTime(0);
    setActiveStepIndex(0);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentStep = WORKFLOW_STEPS[activeStepIndex];

  return (
    <div className="relative w-full max-w-5xl mx-auto my-12 px-2 sm:px-4">
      {/* Background High-Conversion Glow Aura (Pure CSS Hardware-Accelerated) */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-zinc-400/5 to-white/10 blur-3xl -z-10 rounded-full" />

      {/* Top Interactive Workflow Selector Tabs */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            Interactive Clinic SaaS Walkthrough
          </span>
          <span className="text-xs text-zinc-400 hidden sm:inline">• Click any step to inspect</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full p-1.5 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
          {WORKFLOW_STEPS.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(idx)}
                className={`relative px-3 py-2.5 rounded-xl text-left transition-all duration-200 flex flex-col justify-between ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.7)] font-bold scale-[1.01]"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[11px] font-mono uppercase tracking-wider ${isActive ? "text-zinc-900 font-black" : "text-zinc-500"}`}>
                    Step 0{idx + 1}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                  )}
                </div>
                <span className="text-xs sm:text-sm font-bold truncate">{step.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clinic Laptop & Browser Mockup Frame */}
      <div
        className="relative rounded-3xl bg-[#09090B] border border-white/25 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Browser Top Navigation Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#121214] border-b border-white/10">
          {/* macOS Window Traffic Lights */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/50 shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/50 shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/50 shadow-sm" />
          </div>

          {/* Dynamic Address Bar Pill */}
          <div className="flex items-center gap-2 px-3 sm:px-5 py-1.5 rounded-xl bg-black/70 border border-white/15 text-xs font-mono text-zinc-300 max-w-[280px] sm:max-w-md w-full justify-between mx-2 shadow-inner">
            <div className="flex items-center gap-2 truncate">
              <Lock size={12} className="text-emerald-400 shrink-0" />
              <span className="text-zinc-500 hidden sm:inline">https://</span>
              <span className="text-white font-semibold truncate">docodo.in/clinic/dr-kulkarni/{currentStep.urlSlug}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider shrink-0 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
              DPDP 2023
            </span>
          </div>

          {/* Recording / Live Mockup Indicator */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-[10px] font-mono font-bold text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="hidden sm:inline">HD</span> REC
            </div>
          </div>
        </div>

        {/* Video / Walkthrough Stage Area */}
        <div className="relative min-h-[420px] sm:min-h-[490px] bg-gradient-to-b from-[#09090B] via-[#0D0D11] to-[#09090B] p-4 sm:p-8 flex flex-col justify-between overflow-hidden">
          {/* If videoSrc is provided, render HTML5 Video element */}
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              muted={isMuted}
              playsInline
              loop
              className="absolute inset-0 w-full h-full object-cover"
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
            />
          ) : (
            /* High-Frame-Rate Simulated Dynamic Clinic Walkthrough */
            <div className="relative z-10 w-full h-full flex flex-col justify-between">
              {/* Step Subheadline Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-white border border-white/20">
                      STEP {activeStepIndex + 1} OF 4
                    </span>
                    <span className="text-xs text-zinc-400">{currentStep.tagline}</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white mt-1 tracking-tight">
                    {currentStep.title}
                  </h3>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-black text-xs font-black shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                  <Sparkles size={13} /> {currentStep.statsPill}
                </div>
              </div>

              {/* Dynamic Screen Content for Each Chapter */}
              <div className="my-6">
                <AnimatePresence mode="wait">
                  {/* STEP 1: 15-MINUTE CLINIC ONBOARDING */}
                  {activeStepIndex === 0 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
                    >
                      <div className="md:col-span-7 space-y-4">
                        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/15 space-y-3 shadow-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-zinc-400">Doctor Profile Auto-Verification</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle2 size={12} /> NMC Registry Active
                            </span>
                          </div>

                          <div className="space-y-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                              <span className="text-zinc-400">Practitioner Name:</span>
                              <span className="font-bold text-white">Dr. Rajesh Kulkarni, MD</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                              <span className="text-zinc-400">Medical Council Reg:</span>
                              <span className="font-mono text-white">MCI-2011/04/0982 (Pune)</span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                              <span className="text-zinc-400">Direct ICICI UPI VPA:</span>
                              <span className="font-mono text-white">drkulkarni@icici</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/70 border border-white/15 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-white" />
                            <span className="text-zinc-300">Total Setup Stopwatch:</span>
                          </div>
                          <span className="font-mono font-bold text-white bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
                            14 mins 20 secs (Target: &lt; 15 mins)
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-5 space-y-3">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/20 space-y-3">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Building2 size={14} className="text-white" /> Instant Clinic Storefront Ready
                          </h4>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            No tech agency, zero IT delays. Your custom branded clinic booking link is instantly live.
                          </p>
                          <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] font-mono text-emerald-300">
                            <Check size={14} /> WhatsApp Business bot paired
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-300">
                            <Check size={14} /> Morning &amp; Evening slots configured
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-300">
                            <Check size={14} /> QR standee PDF generated
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: PATIENT CALENDAR & ZERO DOUBLE BOOKINGS */}
                  {activeStepIndex === 1 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
                    >
                      <div className="md:col-span-7 space-y-3">
                        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 shadow-xl">
                          <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div className="flex items-center gap-2">
                              <Calendar size={15} className="text-white" />
                              <span className="text-xs font-bold text-white">Today's Live OPD Queue</span>
                            </div>
                            <span className="text-[11px] font-mono text-zinc-400">Pune Clinic · Room 102</span>
                          </div>

                          <div className="mt-3 space-y-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-zinc-600" />
                                <span className="font-medium text-zinc-400">09:30 AM · Sneha Patil (38/F)</span>
                              </div>
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">Consulted ✓</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white/10 border border-white/30 flex items-center justify-between shadow-[0_0_10px_rgba(255,255,255,0.15)]">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="font-bold text-white">10:00 AM · Ramesh Shinde (52/M)</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                                In Room 🟢
                              </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-white" />
                                <span className="font-semibold text-white">10:30 AM · Suresh Deshmukh (54/M)</span>
                              </div>
                              <span className="text-[10px] font-mono text-white bg-white/20 px-2 py-0.5 rounded font-bold">
                                Token #14 (Next)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-black/70 border border-white/15 flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Atomic Database Slot Lock:</span>
                          <span className="font-mono text-emerald-400 font-bold">Zero Double-Booking Guarantee</span>
                        </div>
                      </div>

                      <div className="md:col-span-5 space-y-3">
                        <div className="p-4 rounded-2xl bg-black/80 border border-white/20 space-y-2.5">
                          <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Patient UHID Card</span>
                          <h4 className="text-sm font-bold text-white">Suresh Deshmukh (54/M)</h4>
                          <p className="text-xs text-zinc-300">UHID: PUN-98214 · Diabetology Review</p>
                          <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-[11px] text-zinc-300 flex items-center justify-between">
                            <span>Estimated Wait Time:</span>
                            <span className="text-white font-mono font-bold">~4 mins</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: INSTANT UPI & WHATSAPP CONFIRMATION */}
                  {activeStepIndex === 2 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
                    >
                      <div className="md:col-span-7 space-y-3">
                        {/* Simulated WhatsApp Notification Card */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B141A] border border-emerald-500/30 shadow-2xl relative">
                          <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                                DC
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white flex items-center gap-1">
                                  Docodo Clinic Assistant
                                  <span className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-black font-black">✓</span>
                                </p>
                                <p className="text-[10px] text-zinc-400">Dr. Kulkarni Clinic Official</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-400">Delivered · 0.8s</span>
                          </div>

                          <div className="mt-3 p-3.5 rounded-xl bg-[#1F2C34] text-xs text-zinc-200 space-y-2">
                            <p className="font-semibold text-white">
                              Namaste Suresh Deshmukh ji! 🙏
                            </p>
                            <p className="text-[11px] text-zinc-300">
                              Your appointment with <span className="text-white font-bold">Dr. Rajesh Kulkarni</span> is confirmed.
                            </p>
                            <div className="p-2 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono space-y-1">
                              <p className="text-emerald-300">🎫 OPD Token: <strong className="text-white">#14</strong></p>
                              <p>⏰ Slot Time: <strong className="text-white">Today at 10:30 AM</strong></p>
                              <p>💳 Fee: <strong className="text-white">₹800 Paid via UPI (ICICI)</strong></p>
                            </div>
                            <p className="text-[10px] text-zinc-400">
                              📍 Location: Room 102, Deccan Gymkhana, Pune (Google Maps Attached)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-5 space-y-3">
                        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">Touchless QR Check-in</span>
                            <QrCode size={18} className="text-white" />
                          </div>
                          <p className="text-xs text-zinc-300">
                            Patients scan at reception desk for instant check-in. Eliminates manual logbooks and receptionist chaos.
                          </p>
                          <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs">
                            <span className="text-zinc-400">Settlement Commission:</span>
                            <span className="text-white font-mono font-bold">0% (Keep 100%)</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: CLINIC REVENUE & PRACTICE ANALYTICS */}
                  {activeStepIndex === 3 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
                    >
                      <div className="md:col-span-7 space-y-3">
                        <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/15 shadow-xl space-y-3">
                          <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div>
                              <p className="text-xs font-semibold text-zinc-400">Monthly OPD Collections</p>
                              <h4 className="text-2xl font-black text-white mt-1">
                                ₹2,84,500 <span className="text-xs font-normal text-emerald-400">↑ 28% this month</span>
                              </h4>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                              <TrendingUp size={20} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                              <p className="text-zinc-400 text-[11px]">Aggregator Fee Saved</p>
                              <p className="text-base font-bold text-white mt-0.5">₹56,900</p>
                              <p className="text-[10px] text-zinc-500">0% take-rate vs Practo 20%</p>
                            </div>
                            <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                              <p className="text-zinc-400 text-[11px]">No-Show Rate</p>
                              <p className="text-base font-bold text-emerald-400 mt-0.5">1.4%</p>
                              <p className="text-[10px] text-zinc-500">Dropped from 26% earlier</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-black/70 border border-white/15 flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Direct Bank Settlement:</span>
                          <span className="font-mono text-white font-bold">ICICI A/C •••• 9012 (Instant)</span>
                        </div>
                      </div>

                      <div className="md:col-span-5 space-y-3">
                        <div className="p-4 rounded-2xl bg-black/80 border border-white/20 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">Patient Retention Score</span>
                            <div className="flex items-center text-amber-400 text-xs font-bold">
                              <Star size={13} className="fill-amber-400 mr-1" /> 4.96 / 5.0
                            </div>
                          </div>
                          <p className="text-xs text-zinc-300">
                            Over 540+ verified patients completed consultations with zero queuing friction.
                          </p>
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                            <span>DPDP Act Audit:</span>
                            <span className="text-emerald-400">100% Compliant</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Testimonial Pill */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                  <span className="text-zinc-300 italic">
                    "Docodo replaced our messy paper queue in 15 mins. Patients love instant WhatsApp slips!"
                  </span>
                </div>
                <span className="text-zinc-500 font-mono shrink-0">
                  — Dr. Rajesh Kulkarni, MD (Pune)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="bg-[#121214] border-t border-white/10 px-4 sm:px-6 py-3.5 space-y-2.5">
          {/* Interactive Progress Scrubber Bar */}
          <div
            onClick={handleScrubberClick}
            className="group relative h-2 bg-white/10 hover:h-2.5 rounded-full cursor-pointer transition-all overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 bottom-0 bg-white shadow-[0_0_10px_#ffffff] transition-all duration-100 rounded-full"
              style={{ width: `${(currentTime / TOTAL_DURATION) * 100}%` }}
            />
            {/* Step markers on scrubber */}
            {WORKFLOW_STEPS.map((step, idx) => {
              const posPercent = (idx / WORKFLOW_STEPS.length) * 100;
              return (
                <div
                  key={step.id}
                  className="absolute top-0 bottom-0 w-0.5 bg-white/30 pointer-events-none"
                  style={{ left: `${posPercent}%` }}
                />
              );
            })}
          </div>

          {/* Controls Bottom Row */}
          <div className="flex items-center justify-between text-xs text-zinc-400">
            {/* Left: Play/Pause, Reset & Time Display */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-[0_0_12px_rgba(255,255,255,0.6)] hover:brightness-110 active:scale-95 transition-all"
                title={isPlaying ? "Pause walkthrough" : "Play walkthrough"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                title="Restart from beginning"
              >
                <RotateCcw size={14} />
              </button>

              <span className="font-mono text-zinc-300">
                {formatTime(currentTime)} <span className="text-zinc-600">/</span> {formatTime(TOTAL_DURATION)}
              </span>
            </div>

            {/* Middle: Active Workflow indicator */}
            <div className="hidden md:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-semibold text-[11px] truncate max-w-xs">
                {currentStep.title}
              </span>
            </div>

            {/* Right: Audio, Speed & Chapter Stepper */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : 1))}
                className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-white/30 text-[10px] font-mono font-bold text-zinc-300 hover:text-white transition-all"
                title="Toggle playback speed"
              >
                {playbackSpeed}x
              </button>

              <button
                onClick={() => setIsMuted((m) => !m)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-all"
                title={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              <button
                onClick={() => {
                  const nextIndex = (activeStepIndex + 1) % WORKFLOW_STEPS.length;
                  handleStepClick(nextIndex);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all text-[11px]"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockupVideoShowcase;
