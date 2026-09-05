"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Smartphone, 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  Scissors,
  Check,
  RefreshCw,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export const LiveInteractiveDemo = () => {
  const [activeStep, setActiveStep] = useState<"owner" | "customer" | "dashboard">("owner");
  const [customerName, setCustomerName] = useState("Pooja Sharma");
  const [selectedSlot, setSelectedSlot] = useState("04:30 PM");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleCustomerBook = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setActiveStep("dashboard");
    }, 900);
  };

  const handleReset = () => {
    setBookingConfirmed(false);
    setActiveStep("owner");
  };

  return (
    <section id="demo" className="py-24 bg-[var(--bg-elevated)]/30 border-y border-[var(--border-subtle)] relative overflow-hidden">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--lime)] bg-[var(--lime-ghost)] px-3 py-1 rounded-full border border-[var(--lime)]/30 mb-3 inline-block">
            🎮 Interactive Simulator
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[var(--text-primary)] tracking-tight mb-4">
            See the Complete Live Workflow in Action
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">
            Experience how easy it is for you to publish services, how seamless it is for clients to book, and how appointments arrive instantly in your dashboard.
          </p>
        </div>

        {/* 3-Step Interactive Navigator */}
        <div className="max-w-3xl mx-auto mb-10 flex justify-center">
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl w-full">
            <button
              onClick={() => setActiveStep("owner")}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeStep === "owner"
                  ? "bg-[var(--lime)] text-black shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Building2 size={16} /> 1. Merchant Setup
            </button>
            <button
              onClick={() => setActiveStep("customer")}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeStep === "customer"
                  ? "bg-[var(--lime)] text-black shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Smartphone size={16} /> 2. Customer Booking
            </button>
            <button
              onClick={() => setActiveStep("dashboard")}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeStep === "dashboard"
                  ? "bg-[var(--lime)] text-black shadow-md"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <LayoutDashboard size={16} /> 3. Live Dashboard
            </button>
          </div>
        </div>

        {/* Interactive Simulation Screen */}
        <div className="max-w-4xl mx-auto bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 sm:p-10 shadow-2xl relative min-h-[480px]">
          <AnimatePresence mode="wait">
            {/* STEP 1: MERCHANT SETUP */}
            {activeStep === "owner" && (
              <motion.div
                key="owner"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <span className="text-xs font-mono text-[var(--lime)] uppercase font-bold">Step 1 • Merchant Configuration</span>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] font-display">
                      Create Your Business & Services
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 bg-[var(--lime-ghost)] text-[var(--lime)] rounded-full border border-[var(--lime)]/30 font-bold">
                    ⏱️ 15-Min Setup
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-1">
                    <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Business Profile</label>
                    <p className="font-bold text-sm text-[var(--text-primary)]">Bliss Hair & Spa Studio</p>
                    <p className="text-xs text-[var(--text-muted)]">Koregaon Park, Pune • Salon & Beauty</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-1">
                    <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Working Hours</label>
                    <p className="font-bold text-sm text-[var(--text-primary)]">10:00 AM – 08:00 PM (Daily)</p>
                    <p className="text-xs text-emerald-400 font-mono">● 10 open slots per stylist</p>
                  </div>
                </div>

                <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)] space-y-3">
                  <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Configured Services</label>
                  <div className="p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--lime)]/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[var(--lime-ghost)] text-[var(--lime)]">
                        <Scissors size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[var(--text-primary)]">Haircut & Keratin Spa</p>
                        <p className="text-xs text-[var(--text-muted)]">45 mins • Includes head massage</p>
                      </div>
                    </div>
                    <span className="font-mono font-black text-sm text-[var(--lime)]">₹500</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setActiveStep("customer")}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--lime)] text-black font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-sm)]"
                  >
                    Publish & Open Customer Link <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CUSTOMER BOOKING FLOW */}
            {activeStep === "customer" && (
              <motion.div
                key="customer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <span className="text-xs font-mono text-blue-400 uppercase font-bold">Step 2 • Customer View</span>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] font-display">
                      Customer Books in 30 Seconds
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[var(--text-muted)]">
                    docodo.in/book/bliss-studio
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Selected service summary */}
                  <div className="space-y-4">
                    <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)]">
                      <p className="text-xs text-[var(--text-muted)] font-bold mb-1">Selected Service</p>
                      <p className="font-bold text-sm text-[var(--text-primary)]">Haircut & Keratin Spa</p>
                      <div className="flex justify-between items-center mt-2 text-xs font-mono">
                        <span className="text-[var(--text-muted)]">45 mins</span>
                        <span className="font-bold text-[var(--lime)]">₹500</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Select Available Slot</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["02:00 PM", "03:30 PM", "04:30 PM", "05:30 PM", "06:30 PM", "07:00 PM"].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                              selectedSlot === slot
                                ? "bg-[var(--lime)] text-black border-[var(--lime)]"
                                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--lime)]/30"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-4">
                    <div className="space-y-3 p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)]">
                      <div>
                        <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Your Name</label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full mt-1 px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase">WhatsApp Phone</label>
                        <input
                          type="text"
                          defaultValue="+91 98230 12345"
                          className="w-full mt-1 px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] font-mono"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCustomerBook}
                      className="w-full py-3.5 bg-[var(--lime)] text-black font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-md)] flex items-center justify-center gap-2"
                    >
                      {bookingConfirmed ? (
                        <>
                          <Check size={18} /> Booking Confirmed! Forwarding...
                        </>
                      ) : (
                        <>
                          Confirm Appointment ({selectedSlot}) <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: LIVE MERCHANT DASHBOARD */}
            {activeStep === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase font-bold">Step 3 • Real-Time Execution</span>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] font-display">
                      Appointment Appears Live on Dashboard
                    </h3>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-[var(--lime)] hover:underline font-mono"
                  >
                    <RefreshCw size={12} /> Restart Simulator
                  </button>
                </div>

                {/* Dashboard Instant Alert Banner */}
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Bell size={20} className="animate-bounce" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[var(--text-primary)]">New Booking from {customerName}</p>
                      <p className="text-xs text-[var(--text-secondary)]">Haircut & Keratin Spa • {selectedSlot} • ₹500</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded-full font-mono">
                    CONFIRMED
                  </span>
                </div>

                {/* Live Dashboard Snapshot */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)]">
                    <span className="text-xs text-[var(--text-muted)] font-bold">Today's Bookings</span>
                    <p className="text-2xl font-black text-[var(--text-primary)] font-display mt-1">9 slots</p>
                    <p className="text-[11px] text-emerald-400 font-mono mt-0.5">+1 just added</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)]">
                    <span className="text-xs text-[var(--text-muted)] font-bold">Today's Revenue</span>
                    <p className="text-2xl font-black text-[var(--lime)] font-display mt-1">₹4,500</p>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">UPI & Cash</p>
                  </div>
                  <div className="p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)]">
                    <span className="text-xs text-[var(--text-muted)] font-bold">WhatsApp Reminder</span>
                    <p className="text-sm font-bold text-[var(--text-primary)] mt-1">Auto-Scheduled</p>
                    <p className="text-[11px] text-[var(--lime)] font-mono mt-0.5">Sends 24hr prior</p>
                  </div>
                </div>

                {/* Next CTA */}
                <div className="p-5 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--lime)]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-sm text-[var(--text-primary)]">Ready to set this up for your business?</p>
                    <p className="text-xs text-[var(--text-secondary)]">Takes only 15 minutes. ₹0 setup fee for pilot members.</p>
                  </div>
                  <Link href="/auth/signup">
                    <Button variant="primary" size="md" className="shadow-[var(--lime-glow-sm)] font-bold">
                      Get Started Now <ArrowRight size={16} className="ml-1" />
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
