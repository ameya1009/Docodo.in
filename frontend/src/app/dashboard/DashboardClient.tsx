"use client";

import React from "react";
import DashboardHome from "./DashboardHome";
import { UserX } from "lucide-react";

export interface NoShowReportProps {
  noShowCount: number;
  noShowRate: number;
  lostRevenue: number;
}

export function NoShowReportCard({ noShowCount, noShowRate, lostRevenue }: NoShowReportProps) {
  return (
    <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl shadow-lg relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <UserX size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-display">Patient No-Show &amp; Lost Revenue Report</h2>
            <p className="text-xs text-[var(--text-secondary)]">Tracking missed consultation appointments and estimated lost revenue</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 self-start sm:self-auto">
          OPD Slot Protection
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
          <p className="text-xs font-mono text-[var(--text-muted)]">No-Show Appointments</p>
          <p className="text-2xl font-black text-amber-400 font-display mt-1">{noShowCount} patients</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Unattended booked slots</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
          <p className="text-xs font-mono text-[var(--text-muted)]">No-Show Rate</p>
          <p className="text-2xl font-black text-white font-display mt-1">{noShowRate}%</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Of total recorded appointments</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
          <p className="text-xs font-mono text-[var(--text-muted)]">Estimated Lost Revenue</p>
          <p className="text-2xl font-black text-red-400 font-display mt-1">₹{lostRevenue.toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Recoverable via UPI Advance tokens</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient(props: { data: any }) {
  return <DashboardHome {...props} />;
}
