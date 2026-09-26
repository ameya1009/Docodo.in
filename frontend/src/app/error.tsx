"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp, Terminal } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = React.useState(false);

  useEffect(() => {
    console.error("[Runtime Error Boundary Caught]:", {
      name: error?.name,
      message: error?.message,
      digest: error?.digest,
      stack: error?.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-lg w-full p-8 bg-[var(--bg-surface)] border border-red-500/30 rounded-3xl space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white font-display">
            Something unexpected occurred
          </h1>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            An application error was caught by the runtime safety boundary. You can retry immediately or return to the main dashboard.
          </p>
          {error?.digest && (
            <p className="font-mono text-[10px] text-zinc-500 bg-zinc-900/60 py-1 px-2.5 rounded-lg inline-block">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        {/* Diagnostic Error Inspector (Expandable) */}
        <div className="text-left">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors mx-auto"
          >
            <Terminal size={12} />
            {showDetails ? "Hide Diagnostic Trace" : "Show Diagnostic Trace"}
            {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {showDetails && (
            <div className="mt-3 p-3.5 bg-black/60 border border-zinc-800 rounded-xl font-mono text-[11px] text-red-400 max-h-48 overflow-y-auto space-y-1 select-text">
              <p className="font-bold text-red-300">{error?.name || "Error"}: {error?.message || "Unknown error"}</p>
              {error?.stack && (
                <pre className="text-[10px] text-zinc-400 whitespace-pre-wrap font-mono mt-2 leading-tight">
                  {error.stack.split("\n").slice(0, 8).join("\n")}
                </pre>
              )}
            </div>
          )}
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
