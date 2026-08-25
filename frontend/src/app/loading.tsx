import React from "react";
import { Loader2, Sparkles } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[var(--lime)]/10 border-2 border-[var(--lime)]/20 animate-ping absolute" />
        <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-center text-[var(--lime)] shadow-2xl relative z-10">
          <Loader2 size={28} className="animate-spin text-[var(--lime)]" />
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-black font-display tracking-tight text-white flex items-center justify-center gap-1.5">
          <Sparkles size={14} className="text-[var(--lime)]" /> Loading Docodo...
        </p>
        <p className="text-xs text-[var(--text-muted)] font-mono">Syncing slots & live business data</p>
      </div>
    </div>
  );
}
