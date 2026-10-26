"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Stethoscope, 
  Phone, 
  Clock, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  MessageSquare,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { requestClinicDemoWalkthrough } from "@/lib/actions/enquiry";
import { WHATSAPP_LINK } from "@/lib/constants";

export function ClinicWalkthroughForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    doctorName: "",
    clinicName: "",
    specialty: "Dental Clinic",
    phone: "",
    preferredTime: "Within 15 Minutes",
    consultationRooms: "1 Doctor / 1 Chair",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.doctorName.trim()) {
      setErrorMsg("Please enter your name or Doctor title.");
      return;
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setErrorMsg("Please provide a valid 10-digit WhatsApp/mobile number.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await requestClinicDemoWalkthrough(formData);
        if (res.success) {
          setSubmitted(true);
          setSuccessMsg(res.message);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to submit demo request. Please try again.");
      }
    });
  };

  return (
    <section className="py-20 bg-[var(--bg-elevated)]/40 border-y border-[var(--border-subtle)] relative overflow-hidden">
      <div className="container max-w-4xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 text-xs font-mono font-bold mb-4">
            <Sparkles size={13} />
            <span>Dedicated Doctor Onboarding</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight mb-3">
            Request a Live Clinic Walkthrough
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            See how Docodo replaces paper registers, automates WhatsApp token reminders, and secures consultation slots for your practice.
          </p>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-10 text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(200,241,53,0.3)]">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold text-white">
                    Demo Request Received!
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
                    {successMsg}
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={WHATSAPP_LINK(`Hello! I just requested a live clinic walkthrough for ${formData.clinicName || formData.doctorName}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-sm transition-all shadow-lg"
                  >
                    <MessageSquare size={16} /> Open Immediate WhatsApp Chat
                  </a>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        doctorName: "",
                        clinicName: "",
                        specialty: "Dental Clinic",
                        phone: "",
                        preferredTime: "Within 15 Minutes",
                        consultationRooms: "1 Doctor / 1 Chair",
                      });
                    }}
                    className="text-xs font-mono text-[var(--text-muted)] hover:text-white underline transition-colors"
                  >
                    Submit another request
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl font-medium">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Doctor Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Stethoscope size={14} className="text-[var(--lime)]" /> Doctor / Practice Lead Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Kulkarni"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] outline-none transition-colors"
                    />
                  </div>

                  {/* Clinic Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Building2 size={14} className="text-[var(--lime)]" /> Clinic or Hospital Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Multi-Specialty Dental Care"
                      value={formData.clinicName}
                      onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] outline-none transition-colors"
                    />
                  </div>

                  {/* Specialty */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)]">
                      Medical Specialty *
                    </label>
                    <select
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-white outline-none transition-colors"
                    >
                      <option value="Dental Clinic">Dental Clinic & Implantology</option>
                      <option value="Dermatology & Cosmetology">Dermatology & Skin Clinic</option>
                      <option value="General Physician & OPD">General Physician & Family Practice</option>
                      <option value="Pediatrics & Child Care">Pediatrics & Child Care</option>
                      <option value="Orthopedics & Joint Care">Orthopedics & Joint Care</option>
                      <option value="Physiotherapy & Rehabilitation">Physiotherapy & Rehabilitation</option>
                      <option value="Ayurveda & Holistic Medicine">Ayurveda & Holistic Health</option>
                      <option value="Multi-Specialty Polyclinic">Multi-Specialty Polyclinic</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Phone size={14} className="text-[var(--lime)]" /> WhatsApp / Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)]">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-2.5 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Preferred Callback Time */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Clock size={14} className="text-[var(--lime)]" /> Preferred Walkthrough Window
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-white outline-none transition-colors"
                    >
                      <option value="Within 15 Minutes">Immediately (Within 15 Minutes)</option>
                      <option value="Today Afternoon (1:00 PM – 4:00 PM)">Today Afternoon (1:00 PM – 4:00 PM OPD Break)</option>
                      <option value="Today Evening (8:00 PM – 9:30 PM)">Today Evening (8:00 PM – 9:30 PM Post OPD)</option>
                      <option value="Tomorrow Morning (9:30 AM – 11:30 AM)">Tomorrow Morning (9:30 AM – 11:30 AM)</option>
                    </select>
                  </div>

                  {/* Practice Scale */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)]">
                      Active Consultation Rooms / Chairs
                    </label>
                    <select
                      value={formData.consultationRooms}
                      onChange={(e) => setFormData({ ...formData, consultationRooms: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-white outline-none transition-colors"
                    >
                      <option value="1 Doctor / 1 Chair">Solo Practitioner (1 Doctor / 1 Chair)</option>
                      <option value="2-3 Doctors / Chairs">2–3 Doctors / Multi-Chair OPD</option>
                      <option value="4+ Doctors / Multi-Branch">4+ Doctors / Multi-Branch Polyclinic</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <ShieldCheck size={16} className="text-[var(--lime)] shrink-0" />
                    <span>DPDP Act 2023 Compliant · Zero Spam · Instant Callback</span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isPending}
                    className="w-full sm:w-auto font-bold px-8 shadow-[var(--lime-glow-md)]"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" /> Booking Callback...
                      </>
                    ) : (
                      <>
                        Request Live Walkthrough Callback <ArrowRight size={16} className="ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
