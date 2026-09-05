"use client";

import React, { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams?.get("error");

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(
    urlError
      ? "Authentication session expired or failed. Please sign in."
      : ""
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const result = await loginAction(fd);
        if (result?.error) {
          setError(result.error);
          return;
        }
        if (result?.success) {
          router.push(result.redirectTo || "/dashboard");
          router.refresh();
        }
      } catch (err: any) {
        // Next.js redirect thrown is expected behavior when redirecting
        if (
          err?.digest?.startsWith?.("NEXT_REDIRECT") ||
          err?.message?.includes?.("NEXT_REDIRECT")
        ) {
          return;
        }
        setError(err?.message || "Failed to sign in. Please verify your email and password.");
      }
    });
  };

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--lime)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--lime)]"></span>
          </span>
          <span className="text-2xl font-black text-[var(--lime)] font-display tracking-tight">Docodo</span>
        </Link>
        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2 font-display">Merchant Portal</h1>
        <p className="text-[var(--text-secondary)] text-sm">Sign in to your Docodo business dashboard</p>
      </div>

      {/* Card */}
      <div className="glass rounded-2xl p-8 border border-[var(--border-default)] shadow-xl bg-[var(--bg-surface)]/80 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--lime)]/50 focus:ring-1 focus:ring-[var(--lime)]/20 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Password</label>
              <Link href="/auth/forgot" className="text-xs text-[var(--lime)] hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                name="password"
                type={showPass ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--lime)]/50 focus:ring-1 focus:ring-[var(--lime)]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error Feedback */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[var(--danger)] text-xs bg-[var(--danger)]/10 rounded-xl p-3 border border-[var(--danger)]/20 font-medium flex items-start gap-2"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 bg-[var(--lime)] text-[var(--bg-void)] font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-4 shadow-[var(--lime-glow-md)] active:scale-[0.99]"
          >
            {isPending ? (
              <><Loader2 size={16} className="animate-spin" /> Verifying Credentials...</>
            ) : (
              <>Sign In to Dashboard <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)] font-mono">
          <ShieldCheck size={14} className="text-[var(--lime)]" /> Supabase &amp; Database Connected
        </div>
      </div>

      <p className="text-center text-sm text-[var(--text-muted)] mt-6">
        Don&apos;t have an account yet?{" "}
        <Link href="/auth/signup" className="text-[var(--lime)] font-semibold hover:underline">
          Create account (15 mins)
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--lime)]/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Suspense fallback={<div className="text-center text-white py-12">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
