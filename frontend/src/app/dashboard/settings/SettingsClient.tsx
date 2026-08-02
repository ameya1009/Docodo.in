"use client";

import React, { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Settings, Plus, Trash2, Edit2, Loader2, Check, Clock, DollarSign } from "lucide-react";
import { formatCurrency, INDUSTRIES, cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

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
  const [workingHours, setWorkingHours] = useState(business.workingHours ?? []);
  const [staff, setStaff] = useState(business.staff ?? []);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  // New service form
  const [newService, setNewService] = useState({ name: "", description: "", duration: 60, price: 0 });
  const [showAddService, setShowAddService] = useState(false);

  const handleAddService = () => {
    if (!newService.name) return;
    startTransition(async () => {
      try {
        const res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId: business.id, ...newService }),
        });
        if (res.ok) {
          const data = await res.json();
          setServices([...services, data]);
          setNewService({ name: "", description: "", duration: 60, price: 0 });
          setShowAddService(false);
        }
      } catch {}
    });
  };

  const inputCls = "w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--lime)]/50 transition-all";
  const labelCls = "block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-2">
          <Settings size={22} className="text-[var(--lime)]" /> Settings
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your services, hours, and team</p>
      </div>

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
              className="flex items-center gap-1.5 px-4 py-2 bg-[var(--lime)] text-[var(--bg-void)] font-bold text-sm rounded-xl hover:bg-[var(--lime-hover)] transition-colors"
            >
              <Plus size={15} /> Add Service
            </button>
          </div>

          {/* Add Service Form */}
          {showAddService && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-[var(--bg-surface)] border border-[var(--lime)]/30 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-[var(--lime)]">New Service</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Service Name *</label>
                  <input value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} placeholder="e.g. Haircut & Style" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Duration (minutes)</label>
                  <input type="number" value={newService.duration} onChange={e => setNewService({...newService, duration: Number(e.target.value)})} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Price (₹)</label>
                  <input type="number" value={newService.price} onChange={e => setNewService({...newService, price: Number(e.target.value)})} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Description (optional)</label>
                  <input value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} placeholder="Brief description" className={inputCls} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddService} disabled={isPending} className="flex items-center gap-1.5 px-4 py-2 bg-[var(--lime)] text-[var(--bg-void)] font-bold text-sm rounded-xl disabled:opacity-60">
                  {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save Service
                </button>
                <button onClick={() => setShowAddService(false)} className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Cancel</button>
              </div>
            </motion.div>
          )}

          {/* Service List */}
          <div className="space-y-3">
            {services.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl">
                <DollarSign size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No services yet. Add your first service above.</p>
              </div>
            ) : services.map((service: any) => (
              <div key={service.id} className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl">
                <div className="flex-1">
                  <p className="font-bold text-sm text-[var(--text-primary)]">{service.name}</p>
                  {service.description && <p className="text-xs text-[var(--text-muted)] mt-0.5">{service.description}</p>}
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Clock size={11} /> {service.duration} min</span>
                    <span className="text-xs font-bold text-[var(--lime)]">{service.price > 0 ? formatCurrency(service.price) : "Free"}</span>
                  </div>
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
            const wh = workingHours.find((h: any) => h.day === day) ?? { day, isOpen: day !== "SUN", openTime: "09:00", closeTime: "18:00" };
            return (
              <div key={day} className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl">
                <span className="text-sm font-bold text-[var(--text-primary)] w-24">{DAY_LABELS[day]}</span>
                <div className="flex items-center gap-2 ml-auto flex-wrap">
                  {wh.isOpen ? (
                    <>
                      <span className="text-xs text-[var(--text-muted)]">{wh.openTime} – {wh.closeTime}</span>
                      <span className="text-xs px-2 py-1 bg-[var(--success)]/15 text-[var(--success)] rounded-full font-bold">Open</span>
                    </>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-[var(--bg-elevated)] text-[var(--text-muted)] rounded-full font-bold">Closed</span>
                  )}
                </div>
              </div>
            );
          })}
          <p className="text-xs text-[var(--text-muted)] pt-2">Full working hours editor available in the next update.</p>
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
              <p className="text-sm">No staff added yet. Staff management coming soon.</p>
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
