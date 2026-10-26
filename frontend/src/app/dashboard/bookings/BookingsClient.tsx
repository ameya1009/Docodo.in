"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, X, Loader2, CheckCircle2, Clock, Phone, ChevronLeft, ChevronRight, User, Filter, Zap } from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { createBooking, updateBookingStatus } from "@/lib/actions/dashboard";

export default function BookingsClient({ business, bookings: initialBookings, today }: { business: any; bookings: any[]; today: string }) {
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInCustomerName, setWalkInCustomerName] = useState("");
  const [walkInCustomerPhone, setWalkInCustomerPhone] = useState("");
  const [isReturningPatient, setIsReturningPatient] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [bookings, setBookings] = useState(initialBookings);
  const [isPending, startTransition] = useTransition();

  // Fast phone-to-patient lookup across existing bookings to auto-fill returning patients
  const customerPhoneMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const b of bookings) {
      const name = b.customer?.name || b.customerName;
      const rawPhone = b.customer?.phone || b.customerPhone || "";
      const digits = rawPhone.replace(/\D/g, "");
      if (digits && name) {
        const last10 = digits.slice(-10);
        if (!map.has(last10)) map.set(last10, name);
        if (!map.has(digits)) map.set(digits, name);
      }
    }
    return map;
  }, [bookings]);

  // Global hotkey: 'w' or 'W' opens 10-second Walk-in OPD Entry immediately (Escape closes it)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowWalkInModal(false);
        setShowCreateModal(false);
        return;
      }
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      // Never hijack browser shortcuts like Ctrl+W (close tab) or Cmd+W
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      if (e.key === "w" || e.key === "W") {
        e.preventDefault();
        setWalkInCustomerName("");
        setWalkInCustomerPhone("");
        setIsReturningPatient(false);
        setShowWalkInModal(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getCurrentTimeSlot = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = Math.ceil(now.getMinutes() / 15) * 15;
    if (minutes === 60) {
      hours = (hours + 1) % 24;
      minutes = 0;
    }
    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchDate = b.date === selectedDate;
      const matchStatus = selectedStatus === "ALL" || b.status === selectedStatus;
      return matchDate && matchStatus;
    });
  }, [bookings, selectedDate, selectedStatus]);

  const dates = useMemo(() => {
    const arr = [];
    const base = new Date(selectedDate);
    for (let i = -3; i <= 3; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      arr.push(d.toISOString().split("T")[0]);
    }
    return arr;
  }, [selectedDate]);

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      businessId: business.id,
      serviceId: (formData.get("serviceId") as string) || undefined,
      staffId: (formData.get("staffId") as string) || undefined,
      customerName: (formData.get("customerName") as string) || "",
      customerPhone: (formData.get("customerPhone") as string) || "",
      customerEmail: (formData.get("customerEmail") as string) || undefined,
      date: (formData.get("date") as string) || selectedDate,
      startTime: (formData.get("startTime") as string) || "09:00",
      notes: (formData.get("notes") as string) || undefined,
    };
    startTransition(async () => {
      try {
        const res = await createBooking(payload);
        if (res && res.id) {
          setBookings((prev) => [res, ...prev]);
          setShowCreateModal(false);
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleWalkInPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWalkInCustomerPhone(val);
    const digits = val.replace(/\D/g, "");
    const last10 = digits.length >= 10 ? digits.slice(-10) : digits;
    const match = customerPhoneMap.get(last10) || customerPhoneMap.get(digits);
    if (match) {
      setWalkInCustomerName(match);
      setIsReturningPatient(true);
    } else {
      if (isReturningPatient) {
        setIsReturningPatient(false);
      }
    }
  };

  const handleWalkInSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const customerName = (formData.get("customerName") as string)?.trim() || walkInCustomerName.trim() || "";
    const customerPhone = (formData.get("customerPhone") as string)?.trim() || walkInCustomerPhone.trim() || "";
    if (!customerName || !customerPhone) return;

    const serviceId = (formData.get("serviceId") as string) || business.services?.[0]?.id || undefined;
    const timeSlot = (formData.get("startTime") as string) || getCurrentTimeSlot();

    const payload = {
      businessId: business.id,
      serviceId,
      customerName,
      customerPhone,
      date: today,
      startTime: timeSlot,
      notes: "10-Second Walk-in OPD Entry",
    };

    startTransition(async () => {
      try {
        const res = await createBooking(payload);
        if (res && res.id) {
          setBookings((prev) => [res, ...prev]);
          setShowWalkInModal(false);
          setWalkInCustomerName("");
          setWalkInCustomerPhone("");
          setIsReturningPatient(false);
          setSelectedDate(today);
        }
      } catch (err) {
        console.error("[WalkInOPD] Submission error:", err);
      }
    });
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    startTransition(async () => {
      await updateBookingStatus(id, status as Parameters<typeof updateBookingStatus>[1]);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "text-lime-500 bg-lime-500/10 border-lime-500/20";
      case "PENDING":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "COMPLETED":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "CANCELLED":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "NO_SHOW":
        return "text-neutral-500 bg-neutral-500/10 border-neutral-500/20";
      default:
        return "text-neutral-400 bg-neutral-800 border-neutral-700";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-display">OPD Bookings &amp; Appointments</h1>
          <p className="text-xs text-text-secondary mt-0.5">Real-time doctor appointment calendar and front-desk walk-in queue</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 bg-bg-surface border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-lime transition-colors"
            >
              <option value="ALL">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No-Show</option>
            </select>
            <Filter className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            onClick={() => {
              setWalkInCustomerName("");
              setWalkInCustomerPhone("");
              setIsReturningPatient(false);
              setShowWalkInModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#C8F135] hover:bg-[#b5dc2d] text-black rounded-xl font-black text-sm shadow-[0_0_15px_rgba(200,241,53,0.35)] transition-all"
            title="Press 'W' anytime to open"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>⚡ 10s Walk-in OPD</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-black/20 text-black font-mono rounded font-bold">W</kbd>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-bg-surface border border-border-subtle text-text-primary rounded-xl font-medium hover:border-lime/40 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            New Booking
          </button>
        </div>
      </div>

      {/* Calendar Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {dates.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDate(d)}
            className={cn(
              "flex flex-col items-center min-w-[80px] p-3 rounded-2xl border transition-all",
              d === selectedDate
                ? "bg-lime text-black border-lime"
                : "bg-bg-surface border-border-subtle text-text-secondary hover:border-lime/50"
            )}
          >
            <span className="text-xs font-medium uppercase mb-1">
              {new Date(d).toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            <span className={cn("text-lg font-bold", d === selectedDate ? "text-black" : "text-text-primary")}>
              {new Date(d).getDate()}
            </span>
            <div className="w-1 h-1 rounded-full bg-current mt-1 opacity-50" />
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="flex flex-col gap-4">
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-bg-surface border border-border-subtle rounded-2xl border-dashed">
            <Calendar className="w-12 h-12 text-text-secondary/50 mb-4" />
            <h3 className="text-lg font-medium text-text-primary">No bookings</h3>
            <p className="text-sm text-text-secondary mt-1 max-w-sm">
              There are no bookings for {formatDate(selectedDate)}.
            </p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="group flex flex-col md:flex-row md:items-center justify-between p-5 bg-bg-surface border border-border-subtle rounded-2xl hover:border-lime/30 transition-all gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-bg-elevated border border-border-subtle shrink-0">
                  <span className="text-sm font-semibold text-text-primary">{b.startTime}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-base font-semibold text-text-primary">{b.customer?.name}</h4>
                    <span className={cn("px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full border", getStatusColor(b.status))}>
                      {b.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {b.customer?.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {b.service?.duration}m
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-sm text-text-secondary">{b.service?.name}</span>
                  <span className="text-base font-semibold text-text-primary">
                    {formatCurrency(b.service?.price || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  {b.status !== "COMPLETED" && b.status !== "CANCELLED" && (
                    <button
                      onClick={() => handleUpdateStatus(b.id, "COMPLETED")}
                      className="p-2 text-text-secondary hover:text-lime hover:bg-lime/10 rounded-lg transition-colors"
                      title="Mark Completed"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                  {b.status !== "CANCELLED" && (
                    <button
                      onClick={() => handleUpdateStatus(b.id, "CANCELLED")}
                      className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Cancel Booking"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-bg-surface border border-border-subtle rounded-3xl p-6 z-50 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">New Booking</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-text-secondary hover:text-text-primary bg-bg-elevated rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-secondary">Customer Name</label>
                    <input
                      name="customerName"
                      required
                      className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-lime transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-secondary">Phone Number</label>
                    <input
                      name="customerPhone"
                      required
                      className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-lime transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-secondary">Date</label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={selectedDate}
                      required
                      className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-lime transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-secondary">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      required
                      className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-lime transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">Service</label>
                  <select
                    name="serviceId"
                    required
                    className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-lime transition-colors appearance-none"
                  >
                    <option value="">Select a service...</option>
                    {business.services?.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.name} - {formatCurrency(s.price)} ({s.duration}m)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-lime transition-colors resize-none"
                    placeholder="Any special requests..."
                  />
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2.5 px-4 bg-bg-elevated text-text-primary rounded-xl font-medium hover:bg-border-subtle transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-lime text-black rounded-xl font-medium hover:bg-[#bbf04b] transition-colors disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Booking"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {/* 10-Second Front-Desk Walk-in OPD Entry Modal */}
        {showWalkInModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWalkInModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[var(--bg-surface)] border border-[var(--lime)]/40 p-6 sm:p-8 rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 flex items-center justify-center font-bold">
                    <Zap size={18} className="fill-[var(--lime)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-display">10-Second Walk-in OPD Entry</h2>
                    <p className="text-xs text-[var(--text-secondary)]">Prefilled for today ({formatDate(today)})</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowWalkInModal(false);
                    setWalkInCustomerName("");
                    setWalkInCustomerPhone("");
                    setIsReturningPatient(false);
                  }}
                  className="p-2 text-[var(--text-muted)] hover:text-white rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleWalkInSubmit} className="mt-5 space-y-4">
                {/* Returning Patient Auto-fill Indicator */}
                {isReturningPatient && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-2 bg-[#C8F135]/15 border border-[#C8F135]/40 rounded-xl text-xs text-[#C8F135] font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C8F135]" />
                    <span>Returning patient identified! Name auto-filled from clinic records.</span>
                  </motion.div>
                )}

                {/* 2 Quick Inputs */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-[var(--lime)]" /> 1. Patient Full Name *
                    </span>
                    {isReturningPatient && (
                      <span className="text-[10px] text-[var(--lime)] font-mono font-bold tracking-wider uppercase">Auto-Filled</span>
                    )}
                  </label>
                  <input
                    name="customerName"
                    value={walkInCustomerName}
                    onChange={(e) => {
                      setWalkInCustomerName(e.target.value);
                      setIsReturningPatient(false);
                    }}
                    autoFocus
                    required
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-4 py-3 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-base font-medium text-white placeholder-[var(--text-muted)] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                    <Phone size={14} className="text-[var(--lime)]" /> 2. Patient WhatsApp / Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)]">
                      +91
                    </span>
                    <input
                      name="customerPhone"
                      type="tel"
                      value={walkInCustomerPhone}
                      onChange={handleWalkInPhoneChange}
                      required
                      maxLength={14}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-3 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-base font-medium text-white placeholder-[var(--text-muted)] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[var(--text-muted)]">Slot Time</label>
                    <input
                      name="startTime"
                      type="time"
                      defaultValue={getCurrentTimeSlot()}
                      className="w-full px-3 py-2 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-xs font-mono text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[var(--text-muted)]">Consultation</label>
                    <select
                      name="serviceId"
                      className="w-full px-3 py-2 bg-[var(--bg-void)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-xs text-white outline-none"
                    >
                      {business.services?.map((s: any) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({formatCurrency(s.price)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowWalkInModal(false);
                      setWalkInCustomerName("");
                      setWalkInCustomerPhone("");
                      setIsReturningPatient(false);
                    }}
                    className="flex-1 py-3 px-4 bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-xl text-xs font-bold hover:bg-[var(--border-subtle)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-2 flex items-center justify-center gap-2 py-3 px-5 bg-[#C8F135] hover:bg-[#b5dc2d] text-black rounded-xl font-black text-sm shadow-[0_0_20px_rgba(200,241,53,0.4)] transition-all disabled:opacity-50"
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Zap size={15} className="fill-black" /> Confirm Walk-In &amp; Send Token
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
