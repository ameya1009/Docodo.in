"use client";

import React, { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { signUpAction } from "@/lib/actions/auth";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams?.get("error");

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(
    urlError
      ? "Authentication session expired or failed. Please try again."
      : ""
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const result = await signUpAction(fd);
        if (result?.error) {
          setError(result.error);
          return;
        }
        if (result?.success) {
          router.push(result.redirectTo || "/onboarding");
          router.refresh();
        }
      } catch (err: any) {
        if (
          err?.digest?.startsWith?.("NEXT_REDIRECT") ||
          err?.message?.includes?.("NEXT_REDIRECT")
        ) {
          return;
        }
        setError(err?.message || "Failed to create account. Please try again.");
      }
    });
  };

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8 lg:hidden">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <span className="text-2xl font-black text-[var(--lime)] font-display">Docodo</span>
        </Link>
      </div>
      <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2 font-display">Create your account</h1>
      <p className="text-[var(--text-secondary)] text-sm mb-6">Free pilot plan • Ready in 15 minutes</p>

      <div className="glass rounded-2xl p-8 border border-[var(--border-default)] shadow-xl bg-[var(--bg-surface)]/80 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input name="name" type="text" required placeholder="Your name" className="w-full pl-10 pr-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--lime)]/50 focus:ring-1 focus:ring-[var(--lime)]/20 transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input name="email" type="email" required placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--lime)]/50 focus:ring-1 focus:ring-[var(--lime)]/20 transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input name="password" type={showPass ? "text" : "password"} required placeholder="Min. 8 characters" className="w-full pl-10 pr-11 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--lime)]/50 focus:ring-1 focus:ring-[var(--lime)]/20 transition-all" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[var(--danger)] text-xs bg-[var(--danger)]/10 rounded-xl p-3 border border-[var(--danger)]/20 font-medium flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <button type="submit" disabled={isPending} className="w-full py-3.5 bg-[var(--lime)] text-[var(--bg-void)] font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-[var(--lime-glow-md)] active:scale-[0.99]">
            {isPending ? (<><Loader2 size={16} className="animate-spin" /> Creating account...</>) : (<>Start Free Setup <ArrowRight size={16} /></>)}
          </button>

          <p className="text-xs text-center text-[var(--text-muted)] leading-relaxed pt-2">
            By signing up you agree to our{" "}
            <Link href="/privacy" className="text-[var(--lime)] hover:underline">Privacy Policy</Link>{" "}and{" "}
            <Link href="/terms" className="text-[var(--lime)] hover:underline">Terms</Link>.
          </p>
        </form>
      </div>

      <p className="text-center text-sm text-[var(--text-muted)] mt-6">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[var(--lime)] font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  const perks = [
    "Free pilot plan — zero credit card required",
    "Live booking page in under 15 minutes",
    "Customer CRM and WhatsApp follow-up ready",
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex">
      {/* Left panel — value prop (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--lime)]/5 to-transparent" />
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-96 h-96 bg-[var(--lime)]/10 blur-[80px] rounded-full" />
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-12">
            <span className="text-3xl font-black text-[var(--lime)] font-display">Docodo</span>
          </Link>
          <h2 className="text-4xl font-black text-[var(--text-primary)] leading-tight mb-4 font-display">
            Your digital service business,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--lime)] via-lime-300 to-emerald-400">ready in 15 minutes.</span>
          </h2>
          <p className="text-[var(--text-secondary)] mb-10 leading-relaxed max-w-md">
            Join local salons, clinics, gyms, and service professionals who run on Docodo.
          </p>
          <ul className="space-y-4">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[var(--lime)] mt-0.5 shrink-0" />
                <span className="text-[var(--text-secondary)] text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--lime)]/4 blur-[100px] rounded-full lg:hidden" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <Suspense fallback={<div className="text-center text-white py-12">Loading...</div>}>
            <SignupForm />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
