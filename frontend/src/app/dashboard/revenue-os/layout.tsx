import React from "react";

export default function RevenueOSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              AUTONOMOUS REVENUE OS
            </span>
            <span className="text-xs text-slate-400">Level 2 Autonomy Active (Supervised AI)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Revenue Command Center</h1>
          <p className="text-sm text-slate-400">
            Autonomous sales, multi-channel acquisition, proposal generation, fulfillment, and retention engine.
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
