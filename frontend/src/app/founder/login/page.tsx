"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

export default function FounderLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ameyakshirsagar@docodo.in");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/founder/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Invalid founder credentials. Access restricted.");
        setLoading(false);
        return;
      }

      router.push("/founder");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate founder session.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--lime)]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--lime)]/30 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-[var(--lime-ghost)] border border-[var(--lime)]/30 text-[var(--lime)] mb-2 shadow-[var(--lime-glow-sm)]">
            <ShieldCheck size={28} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[10px] font-mono font-bold text-[var(--lime)] uppercase tracking-wider">
            <Sparkles size={11} /> Founder Super-Admin Gate
          </div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] font-display tracking-tight">
            Docodo.in Command Suite
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Restricted to Ameya Kshirsagar. Client accounts and public visitors are strictly blocked.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-xl flex items-center gap-2.5 text-xs text-[var(--danger)] font-medium"
          >
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Founder Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ameyakshirsagar@docodo.in"
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Super-Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--lime)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[var(--lime)] text-black font-black text-sm rounded-xl hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-md)] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Verifying Access...
              </>
            ) : (
              <>
                Unlock Founder Command Center <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[var(--border-subtle)]">
          <p className="text-[11px] text-[var(--text-muted)]">
            🔒 Hardware Encrypted Session &middot; Timing-Safe SHA-256 Protocol
          </p>
        </div>
      </motion.div>
    </div>
  );
}
