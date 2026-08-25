"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global runtime error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 bg-[var(--bg-surface)] border border-red-500/30 rounded-3xl space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white font-display">
            Something unexpected occurred
          </h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Our autonomous error recovery engine has logged this issue. You can retry immediately or return to the main dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 px-4 rounded-xl bg-[var(--lime)] text-[var(--bg-void)] font-black text-xs flex items-center justify-center gap-2 hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-sm)]"
          >
            <RefreshCw size={14} /> Try Again
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[var(--bg-elevated)]/80 transition-all"
          >
            <Home size={14} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
