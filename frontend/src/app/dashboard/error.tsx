"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error caught:", error);
  }, [error]);

  return (
    <div className="p-8 max-w-lg mx-auto text-center space-y-6 bg-[var(--bg-surface)] border border-red-500/20 rounded-3xl mt-12 shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
        <AlertCircle size={28} />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl font-black text-white">Failed to load dashboard data</h2>
        <p className="text-xs text-[var(--text-secondary)]">
          There was an issue fetching your live appointments or business statistics.
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-[var(--lime)] text-[var(--bg-void)] font-bold text-xs flex items-center gap-2 hover:bg-[var(--lime-hover)] transition-all shadow-sm"
        >
          <RefreshCw size={14} /> Retry Load
        </button>
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-[var(--bg-elevated)] text-white font-bold text-xs flex items-center gap-2 hover:bg-[var(--bg-elevated)]/80 transition-all border border-[var(--border-default)]"
        >
          <LayoutDashboard size={14} /> Refresh Dashboard
        </Link>
      </div>
    </div>
  );
}
