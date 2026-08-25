"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Plus, Trash2, Loader2, Check, Clock, DollarSign, Power, AlertCircle } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { createServiceAction, updateServiceAction, deleteServiceAction } from "@/lib/actions/website";

interface SettingsClientProps {
  business: any;
}

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DAY_LABELS: Record<string, string> = {
  MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday",
  FRI: "Friday", SAT: "Saturday", SUN: "Sunday",
};

export default function SettingsClient({ business }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"services" | "hours" | "staff">("services");
  const [services, setServices] = useState(business.services ?? []);
  const [workingHours, _setWorkingHours] = useState(business.workingHours ?? []);
  const [staff, _setStaff] = useState(business.staff ?? []);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    if (!confirm(`Are you sure you want to delete "${serviceName}"?`)) return;
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
      <div className="flex gap-1 p-1 bg-[var(--bg-elevated)] rounded-xl w-fit">
        {(["services", "hours", "staff"] as const).map((tab) => (
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
            {tab === "hours" ? "Working Hours" : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
        <div className="space-y-3">
          <h2 className="font-bold text-[var(--text-primary)]">Working Hours</h2>
          {DAYS.map((day) => {
            const wh = workingHours.find((h: any) => h.day === day) ?? { day, isOpen: day !== "SUN", openTime: "10:00", closeTime: "20:00" };
            return (
              <div key={day} className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl">
                <span className="text-sm font-bold text-[var(--text-primary)] w-24">{DAY_LABELS[day]}</span>
                <div className="flex items-center gap-2 ml-auto flex-wrap">
                  {wh.isOpen ? (
                    <>
                      <span className="text-xs text-[var(--text-muted)] font-mono">{wh.openTime} – {wh.closeTime}</span>
                      <span className="text-xs px-2.5 py-1 bg-[var(--success)]/15 text-[var(--success)] rounded-full font-bold">Open</span>
                    </>
                  ) : (
                    <span className="text-xs px-2.5 py-1 bg-[var(--bg-elevated)] text-[var(--text-muted)] rounded-full font-bold">Closed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === "staff" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-[var(--text-primary)]">Team Members ({staff.length})</h2>
          </div>
          {staff.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl">
              <p className="text-sm">Default booking assignment is configured to the business owner.</p>
            </div>
          ) : staff.map((s: any) => (
            <div key={s.id} className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl">
              <div className="w-9 h-9 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center text-sm font-bold">
                {s.name?.[0]}
              </div>
              <div>
                <p className="font-bold text-sm text-[var(--text-primary)]">{s.name}</p>
                {s.role && <p className="text-xs text-[var(--text-muted)]">{s.role}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
