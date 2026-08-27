"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Sparkles,
  Clock,
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Share2,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Loader2,
  MapPin,
  Phone,
  IndianRupee,
} from "lucide-react";
import { save15MinuteOnboardingAction } from "@/lib/actions/onboarding";
import { formatCurrency } from "@/lib/utils";

const CATEGORIES = [
  { id: "Salon", label: "Salon & Styling", icon: "💇", defaultServices: [
    { name: "Haircut", price: 500, duration: 45 },
    { name: "Hair Spa", price: 1200, duration: 60 },
    { name: "Facial", price: 1500, duration: 60 },
  ]},
  { id: "Clinic", label: "Clinic & Healthcare", icon: "🩺", defaultServices: [
    { name: "General Consultation", price: 600, duration: 30 },
    { name: "Specialist Review", price: 1200, duration: 45 },
    { name: "Follow-up Checkup", price: 400, duration: 20 },
  ]},
  { id: "Spa", label: "Spa & Wellness", icon: "💆", defaultServices: [
    { name: "Full Body Massage", price: 2000, duration: 60 },
    { name: "Aromatherapy Session", price: 2500, duration: 75 },
    { name: "Foot Reflexology", price: 900, duration: 45 },
  ]},
  { id: "Gym", label: "Gym & Fitness", icon: "🏋️", defaultServices: [
    { name: "Personal Training Session", price: 800, duration: 60 },
    { name: "Fitness Assessment", price: 500, duration: 45 },
    { name: "Trial Workout Class", price: 300, duration: 45 },
  ]},
  { id: "Yoga Studio", label: "Yoga & Meditation", icon: "🧘", defaultServices: [
    { name: "Private Yoga Class", price: 1000, duration: 60 },
    { name: "Meditation & Breathwork", price: 600, duration: 45 },
    { name: "Group Pass Consultation", price: 300, duration: 30 },
  ]},
  { id: "Other", label: "Other Services", icon: "✨", defaultServices: [
    { name: "Standard Consultation", price: 500, duration: 45 },
    { name: "Full Service Package", price: 1500, duration: 60 },
  ]},
];

const DAYS = [
  { key: "MON", label: "Monday" },
  { key: "TUE", label: "Tuesday" },
  { key: "WED", label: "Wednesday" },
  { key: "THU", label: "Thursday" },
  { key: "FRI", label: "Friday" },
  { key: "SAT", label: "Saturday" },
  { key: "SUN", label: "Sunday" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState("");
  const [setupMinutes, setSetupMinutes] = useState<number>(1);

  // Started timestamp telemetry
  const [startedAt, setStartedAt] = useState<string>("");

  useEffect(() => {
    setStartedAt(new Date().toISOString());
  }, []);

  // Form State
  const [info, setInfo] = useState({
    name: "",
    category: "Salon",
    phone: "",
    whatsapp: "",
    city: "Pune",
    address: "",
    instagram: "",
  });

  const [services, setServices] = useState<Array<{ name: string; price: number; duration: number }>>([
    { name: "Haircut", price: 500, duration: 45 },
    { name: "Hair Spa", price: 1200, duration: 60 },
    { name: "Facial", price: 1500, duration: 60 },
  ]);

  const [workingHours, setWorkingHours] = useState<Array<{ day: string; isOpen: boolean; openTime: string; closeTime: string }>>([
    { day: "MON", isOpen: true, openTime: "10:00", closeTime: "20:00" },
    { day: "TUE", isOpen: true, openTime: "10:00", closeTime: "20:00" },
    { day: "WED", isOpen: true, openTime: "10:00", closeTime: "20:00" },
    { day: "THU", isOpen: true, openTime: "10:00", closeTime: "20:00" },
    { day: "FRI", isOpen: true, openTime: "10:00", closeTime: "20:00" },
    { day: "SAT", isOpen: true, openTime: "10:00", closeTime: "20:00" },
    { day: "SUN", isOpen: false, openTime: "10:00", closeTime: "20:00" },
  ]);

  const handleCategorySelect = (catId: string) => {
    const found = CATEGORIES.find((c) => c.id === catId);
    setInfo((prev) => ({ ...prev, category: catId }));
    if (found?.defaultServices) {
      setServices(found.defaultServices);
    }
  };

  const handleAddService = () => {
    setServices((prev) => [...prev, { name: "New Service", price: 500, duration: 45 }]);
  };

  const handleUpdateService = (index: number, field: string, value: any) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleRemoveService = (index: number) => {
    if (services.length <= 1) {
      alert("You must have at least one service.");
      return;
    }
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleDay = (dayKey: string) => {
    setWorkingHours((prev) =>
      prev.map((h) => (h.day === dayKey ? { ...h, isOpen: !h.isOpen } : h))
    );
  };

  const handleTimeChange = (dayKey: string, field: "openTime" | "closeTime", val: string) => {
    setWorkingHours((prev) =>
      prev.map((h) => (h.day === dayKey ? { ...h, [field]: val } : h))
    );
  };

  const handleFinishOnboarding = () => {
    setError("");
    startTransition(async () => {
      try {
        const res = await save15MinuteOnboardingAction({
          name: info.name.trim() || "My Business",
          category: info.category,
          phone: info.phone.trim() || "+91 9000000000",
          whatsapp: info.whatsapp.trim() || info.phone.trim() || "+91 9000000000",
          city: info.city.trim() || "India",
          address: info.address.trim() || undefined,
          instagram: info.instagram.trim() || undefined,
          services: services.map((s) => ({
            name: s.name.trim() || "Service",
            price: Number(s.price) || 0,
            duration: Number(s.duration) || 60,
          })),
          workingHours,
          startedAt,
        });

        if (res.success && res.slug) {
          setPublishedSlug(res.slug);
          setSetupMinutes(res.setupTimeMinutes || 1);
          setStep(5);
        } else {
          setError("Could not complete setup. Please try again.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to finalize business setup.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-[#161b22] border border-gray-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        
        {/* Progress Bar & Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-lime text-black font-black flex items-center justify-center text-sm">
              D
            </div>
            <span className="font-bold text-lg tracking-tight">Docodo</span>
          </div>
          <div className="text-xs font-mono text-gray-400">
            Step {step} of 5 · <span className="text-lime font-bold">15-Min Setup</span>
          </div>
        </div>

        {/* Progress Track */}
        <div className="flex gap-1.5 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-lime" : "bg-gray-800"
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* SCREEN 1: Welcome to Docodo */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-black text-white">Welcome to Docodo 👋</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Tell us the essentials about your business to get your online booking link ready.
                </p>
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                  Business Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        info.category === cat.id
                          ? "border-lime bg-lime/10 text-white"
                          : "border-gray-800 bg-[#0d1117] text-gray-300 hover:border-gray-700"
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-xs font-bold leading-snug">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={info.name}
                  onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  placeholder="e.g. Test Salon Pune"
                  className="w-full px-4 py-3 bg-[#0d1117] border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-lime"
                  required
                />
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-[#0d1117] border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-lime"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={info.whatsapp}
                    onChange={(e) => setInfo({ ...info, whatsapp: e.target.value })}
                    placeholder="Same as phone"
                    className="w-full px-4 py-3 bg-[#0d1117] border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-lime"
                  />
                </div>
              </div>

              {/* City & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    value={info.city}
                    onChange={(e) => setInfo({ ...info, city: e.target.value })}
                    placeholder="e.g. Pune"
                    className="w-full px-4 py-3 bg-[#0d1117] border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-lime"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Address / Area
                  </label>
                  <input
                    type="text"
                    value={info.address}
                    onChange={(e) => setInfo({ ...info, address: e.target.value })}
                    placeholder="e.g. Koregaon Park"
                    className="w-full px-4 py-3 bg-[#0d1117] border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-lime"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!info.name.trim()) {
                      setError("Please enter your business name.");
                      return;
                    }
                    setError("");
                    setStep(2);
                  }}
                  className="px-6 py-3.5 bg-lime text-black font-bold text-sm rounded-xl hover:bg-[#bbf04b] transition-colors flex items-center gap-2"
                >
                  Next: Add Services <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 2: Add your services */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-black text-white">Add Your Services 📋</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Customers will choose from these services when booking appointments online.
                </p>
              </div>

              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {services.map((svc, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 bg-[#0d1117] border border-gray-800 rounded-2xl"
                  >
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Service Name
                      </label>
                      <input
                        type="text"
                        value={svc.name}
                        onChange={(e) => handleUpdateService(i, "name", e.target.value)}
                        placeholder="e.g. Haircut"
                        className="w-full px-3 py-2 bg-[#161b22] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-lime"
                      />
                    </div>
                    <div className="w-full sm:w-28">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={svc.price}
                        onChange={(e) => handleUpdateService(i, "price", Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#161b22] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-lime"
                      />
                    </div>
                    <div className="w-full sm:w-28">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Duration (Mins)
                      </label>
                      <input
                        type="number"
                        min="15"
                        step="15"
                        value={svc.duration}
                        onChange={(e) => handleUpdateService(i, "duration", Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#161b22] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-lime"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(i)}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors self-end sm:self-center mt-2 sm:mt-4"
                      title="Remove Service"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddService}
                className="w-full py-3 border border-dashed border-gray-700 hover:border-lime text-gray-300 hover:text-lime rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={14} /> Add Another Service
              </button>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 text-gray-400 hover:text-white font-bold text-sm flex items-center gap-1.5"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3.5 bg-lime text-black font-bold text-sm rounded-xl hover:bg-[#bbf04b] transition-colors flex items-center gap-2"
                >
                  Next: Operating Hours <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 3: When are you available? */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-black text-white">When Are You Available? ⏰</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Set your standard weekly operating schedule. You can adjust this anytime.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {DAYS.map(({ key, label }) => {
                  const wh = workingHours.find((h) => h.day === key) || {
                    isOpen: true,
                    openTime: "10:00",
                    closeTime: "20:00",
                  };
                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        wh.isOpen
                          ? "bg-[#0d1117] border-gray-800"
                          : "bg-gray-900/30 border-gray-900 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleDay(key)}
                          className={`w-10 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                            wh.isOpen ? "bg-lime" : "bg-gray-700"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-black transition-transform ${
                              wh.isOpen ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-sm font-bold">{label}</span>
                      </div>

                      {wh.isOpen ? (
                        <div className="flex items-center gap-2 text-xs">
                          <input
                            type="time"
                            value={wh.openTime}
                            onChange={(e) => handleTimeChange(key, "openTime", e.target.value)}
                            className="px-2 py-1.5 bg-[#161b22] border border-gray-700 rounded-lg text-white font-mono [color-scheme:dark]"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={wh.closeTime}
                            onChange={(e) => handleTimeChange(key, "closeTime", e.target.value)}
                            className="px-2 py-1.5 bg-[#161b22] border border-gray-700 rounded-lg text-white font-mono [color-scheme:dark]"
                          />
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Closed
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 text-gray-400 hover:text-white font-bold text-sm flex items-center gap-1.5"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3.5 bg-lime text-black font-bold text-sm rounded-xl hover:bg-[#bbf04b] transition-colors flex items-center gap-2"
                >
                  Preview Booking Page <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 4: Your booking page Preview */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-black text-white">Your Booking Page Preview ✨</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Here is how customers will experience booking an appointment with you.
                </p>
              </div>

              {/* Mockup Card */}
              <div className="p-5 bg-white text-gray-900 rounded-3xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h2 className="text-xl font-black">{info.name || "Test Salon Pune"}</h2>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {info.city || "Pune"} · {info.category}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase rounded-full">
                    Online Bookings Active
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Services Menu
                  </p>
                  <div className="space-y-2">
                    {services.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 border rounded-xl bg-gray-50"
                      >
                        <div>
                          <p className="font-bold text-sm text-gray-900">{s.name}</p>
                          <p className="text-xs text-gray-500">{s.duration} minutes</p>
                        </div>
                        <span className="font-black text-sm text-blue-600">
                          {formatCurrency(s.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs flex items-center gap-2">
                  <Clock size={14} className="text-blue-600 shrink-0" />
                  <span>
                    Open Monday–Saturday (10 AM–8 PM) · Instant confirmation on WhatsApp
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-3 text-gray-400 hover:text-white font-bold text-sm flex items-center gap-1.5"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  disabled={isPending}
                  className="px-8 py-3.5 bg-lime text-black font-extrabold text-sm rounded-xl hover:bg-[#bbf04b] transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Publishing...
                    </>
                  ) : (
                    <>
                      Publish My Booking System <Sparkles size={16} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 5: You're Live! */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-lime/20 text-lime flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h1 className="text-3xl font-black text-white">You&apos;re Live! 🎉</h1>
                <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
                  {info.name} is ready to receive online bookings. Setup was completed in ~{setupMinutes} minute{setupMinutes > 1 ? "s" : ""}!
                </p>
              </div>

              {/* Link Card */}
              <div className="p-4 bg-[#0d1117] border border-lime/30 rounded-2xl flex items-center justify-between gap-3 text-left">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-lime">
                    Your Public Booking Page
                  </p>
                  <p className="text-sm font-mono text-white truncate">
                    https://docodo.in/book/{publishedSlug}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://docodo.in/book/${publishedSlug}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3 py-2 bg-lime text-black font-bold text-xs rounded-xl hover:bg-[#bbf04b] transition-colors shrink-0 flex items-center gap-1"
                >
                  {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Share CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi! You can now book appointments with ${info.name} online here: https://docodo.in/book/${publishedSlug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare size={16} /> Share on WhatsApp
                </a>
                <a
                  href={`/book/${publishedSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-700"
                >
                  <ExternalLink size={16} /> Open Booking Page
                </a>
              </div>

              {/* Google Business Tips */}
              <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-2xl text-left text-xs text-gray-400 space-y-1.5">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Store size={14} className="text-lime" /> Add link to Google Business & Instagram
                </p>
                <p>
                  Paste your booking link in your Instagram Bio and Google Business Profile &ldquo;Appointment Link&rdquo; field so local searchers can book you immediately.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full py-4 bg-lime text-black font-black text-sm rounded-2xl hover:bg-[#bbf04b] transition-colors shadow-xl flex items-center justify-center gap-2"
              >
                Go to Business Dashboard <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
