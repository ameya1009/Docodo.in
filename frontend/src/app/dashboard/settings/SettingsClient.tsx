"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Plus, Trash2, Loader2, Check, Clock, DollarSign, Power, AlertCircle, Bell, MessageSquare, Star, CreditCard, QrCode } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { createServiceAction, updateServiceAction, deleteServiceAction } from "@/lib/actions/website";
import { createStaffAction, deleteStaffAction, updateWorkingHoursAction } from "@/lib/actions/dashboard";

interface SettingsClientProps {
  business: any;
}

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DAY_LABELS: Record<string, string> = {
  MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday",
  FRI: "Friday", SAT: "Saturday", SUN: "Sunday",
};

export default function SettingsClient({ business }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"services" | "hours" | "staff" | "automations" | "payments">("services");
  const [services, setServices] = useState(business.services ?? []);
  const [workingHours, setWorkingHours] = useState<any[]>(business.workingHours ?? []);
  const [staff, setStaff] = useState<any[]>(business.staff ?? []);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", role: "", phone: "", email: "" });
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Payment & Direct Settlement State
  const initialPaymentSettings = (() => {
    try {
      const parsed = typeof business.websiteConfig === "string" ? JSON.parse(business.websiteConfig) : (business.websiteConfig || {});
      return parsed.paymentSettings || {};
    } catch {
      return {};
    }
  })();

  const [paymentSettings, setPaymentSettings] = useState({
    upiId: initialPaymentSettings.upiId || "",
    beneficiaryName: initialPaymentSettings.beneficiaryName || business.name || "",
    acceptVenue: initialPaymentSettings.acceptVenue ?? true,
    acceptUpi: initialPaymentSettings.acceptUpi ?? true,
  });

  // Automation Toggles State (Section 14)
  const [automations, setAutomations] = useState({
    bookingConfirmation: true,
    reminder24h: true,
    reviewRequest: true,
  });

  // New service form
  const [newService, setNewService] = useState({ name: "", description: "", duration: 60, price: 500 });
  const [showAddService, setShowAddService] = useState(false);

  const handleAddService = () => {
    if (!newService.name.trim()) return;
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      try {
        const created = await createServiceAction({
          businessId: business.id,
          name: newService.name,
          description: newService.description,
          duration: Number(newService.duration),
          price: Number(newService.price),
        });
        setServices([...services, created]);
        setNewService({ name: "", description: "", duration: 60, price: 500 });
        setShowAddService(false);
        setSuccessMessage("Service added successfully!");
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to add service");
      }
    });
  };

  const handleToggleActive = (serviceId: string, currentStatus: boolean) => {
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      try {
        const updated = await updateServiceAction({
          serviceId,
          isActive: !currentStatus,
        });
        setServices(services.map((s: any) => (s.id === serviceId ? { ...s, isActive: updated.isActive } : s)));
        setSuccessMessage(`Service ${updated.isActive ? "activated" : "deactivated"}`);
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update service status");
      }
    });
  };

  const handleDeleteService = (serviceId: string, serviceName: string) => {
    if (typeof window !== "undefined" && !window.confirm(`Are you sure you want to delete "${serviceName}"?`)) return;
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      try {
        await deleteServiceAction(serviceId);
        setServices(services.filter((s: any) => s.id !== serviceId));
        setSuccessMessage("Service removed");
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to delete service");
      }
    });
  };

  const handleAddStaff = () => {
    if (!newStaff.name.trim()) return;
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      try {
        const created = await createStaffAction({
          businessId: business.id,
          name: newStaff.name,
          role: newStaff.role,
          phone: newStaff.phone,
          email: newStaff.email,
        });
        setStaff([...staff, created]);
        setNewStaff({ name: "", role: "", phone: "", email: "" });
        setShowAddStaff(false);
        setSuccessMessage("Staff member added successfully!");
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to add staff member");
      }
    });
  };

  const handleDeleteStaff = (staffId: string, staffName: string) => {
    if (typeof window !== "undefined" && !window.confirm(`Are you sure you want to remove "${staffName}"?`)) return;
    setErrorMessage("");
    setSuccessMessage("");

    startTransition(async () => {
      try {
        await deleteStaffAction(staffId, business.id);
        setStaff(staff.filter((s: any) => s.id !== staffId));
        setSuccessMessage("Staff member removed successfully");
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to delete staff member");
      }
    });
  };

  const DAY_INDEX_MAP: Record<string, number> = {
    SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6
  };

  const handleToggleDayOpen = (day: string) => {
    setWorkingHours((prev: any[]) => {
      const existing = prev.find((h: any) => h.day === day);
      if (existing) {
        return prev.map((h: any) => h.day === day ? { ...h, isOpen: !h.isOpen } : h);
      }
      return [...prev, { day, isOpen: false, openTime: "10:00", closeTime: "20:00" }];
    });
  };

  const handleTimeChange = (day: string, field: "openTime" | "closeTime", value: string) => {
    setWorkingHours((prev: any[]) => {
      const existing = prev.find((h: any) => h.day === day);
      if (existing) {
        return prev.map((h: any) => h.day === day ? { ...h, [field]: value } : h);
      }
      return [...prev, { day, isOpen: true, openTime: field === "openTime" ? value : "10:00", closeTime: field === "closeTime" ? value : "20:00" }];
    });
  };

  const handleSaveWorkingHours = () => {
    setErrorMessage("");
    setSuccessMessage("");
    startTransition(async () => {
      try {
        const payload = DAYS.map((day) => {
          const wh = workingHours.find((h: any) => h.day === day) ?? { day, isOpen: day !== "SUN", openTime: "10:00", closeTime: "20:00" };
          return {
            dayOfWeek: DAY_INDEX_MAP[day] ?? 1,
            day,
            openTime: wh.openTime,
            closeTime: wh.closeTime,
            isOpen: wh.isOpen,
          };
        });

        await updateWorkingHoursAction(payload, business.id);
        setSuccessMessage("Working hours saved successfully!");
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to update working hours");
      }
    });
  };

  const inputCls = "w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--lime)]/50 transition-all";
  const labelCls = "block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-2 font-display">
          <Settings size={22} className="text-[var(--lime)]" /> Settings
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your catalog, availability, and business profile</p>
      </div>

      {/* Status Feedback */}
      {successMessage && (
        <div className="p-3 bg-[var(--success)]/15 border border-[var(--success)]/30 rounded-xl text-[var(--success)] text-xs flex items-center gap-2">
          <Check size={16} /> {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-3 bg-[var(--danger)]/15 border border-[var(--danger)]/30 rounded-xl text-[var(--danger)] text-xs flex items-center gap-2">
          <AlertCircle size={16} /> {errorMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--bg-elevated)] rounded-xl w-fit flex-wrap">
        {(["services", "hours", "staff", "automations", "payments"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize",
              activeTab === tab
                ? "bg-[var(--bg-surface)] text-[var(--lime)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            {tab === "hours" ? "Working Hours" : tab === "automations" ? "Automations" : tab === "payments" ? "Payments & Payouts" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Services Tab */}
      {activeTab === "services" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[var(--text-primary)]">Services ({services.length})</h2>
            <button
              onClick={() => setShowAddService(!showAddService)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[var(--lime)] text-[var(--bg-void)] font-bold text-sm rounded-xl hover:bg-[var(--lime-hover)] transition-colors active:scale-95"
            >
              <Plus size={15} /> Add Service
            </button>
          </div>

          {/* Add Service Form */}
          <AnimatePresence>
            {showAddService && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-[var(--bg-surface)] border border-[var(--lime)]/30 rounded-2xl p-5 space-y-4 shadow-xl">
                <h3 className="font-bold text-sm text-[var(--lime)]">New Service</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Service Name *</label>
                    <input value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} placeholder="e.g. Luxury Hair Spa" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Duration (minutes)</label>
                    <input type="number" min={10} step={5} value={newService.duration} onChange={e => setNewService({...newService, duration: Number(e.target.value)})} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Price (₹)</label>
                    <input type="number" min={0} value={newService.price} onChange={e => setNewService({...newService, price: Number(e.target.value)})} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Description (optional)</label>
                    <input value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} placeholder="e.g. Deep conditioning treatment with steam" className={inputCls} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleAddService} disabled={isPending || !newService.name.trim()} className="flex items-center gap-1.5 px-4 py-2 bg-[var(--lime)] text-[var(--bg-void)] font-bold text-sm rounded-xl disabled:opacity-60 shadow-[var(--lime-glow-sm)]">
                    {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save Service
                  </button>
                  <button onClick={() => setShowAddService(false)} className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Cancel</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Service List */}
          <div className="space-y-3">
            {services.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl">
                <DollarSign size={32} className="mx-auto mb-3 opacity-40 text-[var(--lime)]" />
                <p className="text-sm font-medium">No services configured yet.</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Click "Add Service" above to list your offerings.</p>
              </div>
            ) : services.map((service: any) => (
              <div key={service.id} className={cn("flex items-center gap-4 p-4 bg-[var(--bg-surface)] border rounded-2xl transition-all", service.isActive ? "border-[var(--border-subtle)]" : "border-dashed border-red-500/30 opacity-70")}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[var(--text-primary)] truncate">{service.name}</p>
                    {!service.isActive && (
                      <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full font-bold border border-red-500/20">Inactive</span>
                    )}
                  </div>
                  {service.description && <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{service.description}</p>}
                  <div className="flex gap-4 mt-1.5">
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Clock size={12} /> {service.duration} min</span>
                    <span className="text-xs font-bold text-[var(--lime)]">{service.price > 0 ? formatCurrency(service.price) : "Free"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(service.id, service.isActive)}
                    disabled={isPending}
                    title={service.isActive ? "Deactivate Service" : "Activate Service"}
                    className={cn(
                      "p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1",
                      service.isActive
                        ? "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-red-400"
                        : "bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30"
                    )}
                  >
                    <Power size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id, service.name)}
                    disabled={isPending}
                    title="Delete Service"
                    className="p-2 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Working Hours Tab */}
      {activeTab === "hours" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-[var(--text-primary)]">Working Hours</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Set daily opening and closing hours for appointment bookings.</p>
            </div>
            <button
              onClick={handleSaveWorkingHours}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 bg-[var(--lime)] text-[var(--bg-void)] font-bold text-sm rounded-xl hover:bg-[var(--lime-hover)] transition-colors disabled:opacity-60 shadow-sm shrink-0"
            >
              {isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Save Working Hours
            </button>
          </div>

          <div className="space-y-3">
            {DAYS.map((day) => {
              const wh = workingHours.find((h: any) => h.day === day) ?? { day, isOpen: day !== "SUN", openTime: "10:00", closeTime: "20:00" };
              return (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleDayOpen(day)}
                      disabled={isPending}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative shrink-0",
                        wh.isOpen ? "bg-[var(--lime)]" : "bg-gray-800 border border-gray-700"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full transition-transform absolute top-1",
                          wh.isOpen ? "left-6 bg-black" : "left-1 bg-gray-400"
                        )}
                      />
                    </button>
                    <span className="text-sm font-bold text-[var(--text-primary)] w-28">{DAY_LABELS[day]}</span>
                    <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-bold", wh.isOpen ? "bg-[var(--success)]/15 text-[var(--success)]" : "bg-[var(--bg-elevated)] text-[var(--text-muted)]")}>
                      {wh.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>

                  {wh.isOpen && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-[var(--text-muted)]">From:</span>
                        <input
                          type="time"
                          value={wh.openTime}
                          onChange={(e) => handleTimeChange(day, "openTime", e.target.value)}
                          disabled={isPending}
                          className="px-2.5 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--lime)]/50"
                        />
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">–</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-[var(--text-muted)]">To:</span>
                        <input
                          type="time"
                          value={wh.closeTime}
                          onChange={(e) => handleTimeChange(day, "closeTime", e.target.value)}
                          disabled={isPending}
                          className="px-2.5 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:border-[var(--lime)]/50"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveWorkingHours}
              disabled={isPending}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[var(--lime)] text-[var(--bg-void)] font-bold text-sm rounded-xl hover:bg-[var(--lime-hover)] transition-colors disabled:opacity-60 shadow-[var(--lime-glow-sm)]"
            >
              {isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Save Working Hours
            </button>
          </div>
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === "staff" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-[var(--text-primary)]">Team Members ({staff.length})</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Manage practitioners, consultants, and service specialists.</p>
            </div>
            <button
              onClick={() => setShowAddStaff(!showAddStaff)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[var(--lime)] text-[var(--bg-void)] font-bold text-sm rounded-xl hover:bg-[var(--lime-hover)] transition-colors active:scale-95 shadow-sm"
            >
              <Plus size={15} /> Add Staff Member
            </button>
          </div>

          {/* Add Staff Member Modal / Dialog */}
          <AnimatePresence>
            {showAddStaff && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="bg-[var(--bg-surface)] border border-[var(--lime)]/30 rounded-2xl p-5 space-y-4 shadow-xl">
                <h3 className="font-bold text-sm text-[var(--lime)]">New Staff Member</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name *</label>
                    <input
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Role / Title</label>
                    <input
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                      placeholder="e.g. Senior Specialist / Consultant"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number (optional)</label>
                    <input
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email Address (optional)</label>
                    <input
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      placeholder="e.g. doctor@clinic.com"
                      className={inputCls}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAddStaff}
                    disabled={isPending || !newStaff.name.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[var(--lime)] text-[var(--bg-void)] font-bold text-sm rounded-xl disabled:opacity-60 shadow-[var(--lime-glow-sm)]"
                  >
                    {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save Staff Member
                  </button>
                  <button
                    onClick={() => setShowAddStaff(false)}
                    className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {staff.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl">
              <p className="text-sm font-medium">No team members added yet.</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Default booking assignment is configured to the business owner.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {staff.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between gap-4 p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center text-sm font-bold">
                      {s.name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[var(--text-primary)]">{s.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {s.role && <p className="text-xs text-[var(--text-muted)]">{s.role}</p>}
                        {s.phone && <span className="text-[11px] text-[var(--text-secondary)] font-mono">· {s.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteStaff(s.id, s.name)}
                    disabled={isPending}
                    title="Delete Staff Member"
                    className="p-2 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Automations Tab (Section 14) */}
      {activeTab === "automations" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-[var(--text-primary)]">Pre-Built Automation Toggles</h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Toggle zero-effort WhatsApp and notification triggers for your clients.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* 1. Instant Confirmation */}
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-[var(--lime)]/10 text-[var(--lime)] shrink-0 mt-0.5">
                  <Check size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Instant Booking Confirmation</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Sends an immediate WhatsApp alert to the client as soon as their booking is confirmed.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAutomations((prev) => ({
                    ...prev,
                    bookingConfirmation: !prev.bookingConfirmation,
                  }))
                }
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative shrink-0",
                  automations.bookingConfirmation ? "bg-[var(--lime)]" : "bg-gray-800 border border-gray-700"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5",
                    automations.bookingConfirmation ? "left-6 bg-black" : "left-0.5 bg-gray-400"
                  )}
                />
              </button>
            </div>

            {/* 2. 24-Hour Pre-Appointment Reminder */}
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0 mt-0.5">
                  <Bell size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">24-Hour WhatsApp Reminder</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Automated pre-appointment reminder dispatched 24h prior via cron to prevent no-shows.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAutomations((prev) => ({
                    ...prev,
                    reminder24h: !prev.reminder24h,
                  }))
                }
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative shrink-0",
                  automations.reminder24h ? "bg-[var(--lime)]" : "bg-gray-800 border border-gray-700"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5",
                    automations.reminder24h ? "left-6 bg-black" : "left-0.5 bg-gray-400"
                  )}
                />
              </button>
            </div>

            {/* 3. Post-Service Review Request */}
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                  <Star size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Google Review Nudge</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Sends your Google Review link 2 hours after service completion to collect 5-star ratings.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAutomations((prev) => ({
                    ...prev,
                    reviewRequest: !prev.reviewRequest,
                  }))
                }
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative shrink-0",
                  automations.reviewRequest ? "bg-[var(--lime)]" : "bg-gray-800 border border-gray-700"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5",
                    automations.reviewRequest ? "left-6 bg-black" : "left-0.5 bg-gray-400"
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payments & Payouts Tab */}
      {activeTab === "payments" && (
        <div className="space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-black text-[var(--text-primary)] flex items-center gap-2">
                <CreditCard size={20} className="text-[var(--lime)]" /> Direct Merchant Settlement
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Configure your UPI VPA and settlement preferences. Customers pay directly into your account — 100% compliant with RBI Payment Aggregator guidelines with zero platform deduction.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className={labelCls}>Merchant UPI ID / VPA *</label>
                <div className="relative">
                  <input
                    value={paymentSettings.upiId}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, upiId: e.target.value })}
                    placeholder="e.g. drsharma@okhdfcbank or 9876543210@paytm"
                    className={inputCls}
                  />
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Required for direct UPI QR and intent links on your booking page.
                </p>
              </div>

              <div>
                <label className={labelCls}>Beneficiary / Payee Name *</label>
                <input
                  value={paymentSettings.beneficiaryName}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, beneficiaryName: e.target.value })}
                  placeholder="e.g. Dr. Sharma Dental Care"
                  className={inputCls}
                />
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  The verified name associated with your bank account or merchant VPA.
                </p>
              </div>
            </div>

            {/* Payment Method Preferences */}
            <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
              <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Accepted Payment Modes</h4>

              {/* Pay at Venue */}
              <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                    <Check size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">Pay at Venue (Cash / In-Clinic QR)</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Recommended default. Patients pay in person at your reception counter or scan your in-clinic QR code.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentSettings((prev) => ({ ...prev, acceptVenue: !prev.acceptVenue }))}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative shrink-0",
                    paymentSettings.acceptVenue ? "bg-[var(--lime)]" : "bg-gray-800 border border-gray-700"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5",
                      paymentSettings.acceptVenue ? "left-6 bg-black" : "left-0.5 bg-gray-400"
                    )}
                  />
                </button>
              </div>

              {/* Direct UPI Advance */}
              <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                    <QrCode size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">Direct UPI Advance / Dynamic QR</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Enables dynamic UPI intent links (GPay, PhonePe, Paytm, BHIM) that transfer directly to your VPA.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentSettings((prev) => ({ ...prev, acceptUpi: !prev.acceptUpi }))}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative shrink-0",
                    paymentSettings.acceptUpi ? "bg-[var(--lime)]" : "bg-gray-800 border border-gray-700"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5",
                      paymentSettings.acceptUpi ? "left-6 bg-black" : "left-0.5 bg-gray-400"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setSuccessMessage("");

                  if (!paymentSettings.acceptVenue && !paymentSettings.acceptUpi) {
                    setErrorMessage("Please accept at least one payment mode (Pay at Venue or Direct UPI).");
                    return;
                  }

                  if (paymentSettings.acceptUpi && paymentSettings.upiId.trim()) {
                    const vpaRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
                    if (!vpaRegex.test(paymentSettings.upiId.trim())) {
                      setErrorMessage("Invalid UPI ID format. Expected format: username@bankhandle (e.g. drsharma@okhdfcbank or 9876543210@paytm).");
                      return;
                    }
                  }

                  startTransition(async () => {
                    try {
                      const { updatePaymentSettingsAction } = await import("@/lib/actions/website");
                      await updatePaymentSettingsAction({
                        businessId: business.id,
                        upiId: paymentSettings.upiId,
                        beneficiaryName: paymentSettings.beneficiaryName,
                        acceptVenue: paymentSettings.acceptVenue,
                        acceptUpi: paymentSettings.acceptUpi,
                      });
                      setSuccessMessage("Payments & Settlement settings updated successfully!");
                    } catch (err: any) {
                      setErrorMessage(err.message || "Failed to update payment settings");
                    }
                  });
                }}
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--lime)] text-[var(--bg-void)] font-bold text-sm rounded-xl hover:bg-[var(--lime-hover)] transition-all disabled:opacity-60 shadow-[var(--lime-glow-sm)]"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Settlement Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
