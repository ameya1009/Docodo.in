"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { signUpAction } from "@/lib/actions/auth";

export default function SignupPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signUpAction(fd);
      if (result?.error) setError(result.error);
    });
  };

  const perks = [
    "Free forever plan — no credit card needed",
    "Live booking page in under 15 minutes",
    "AI-generated business content included",
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
          <h2 className="text-4xl font-black text-[var(--text-primary)] leading-tight mb-4">
            Your digital business,<br />
            <span className="text-lime-gradient">ready in 15 minutes.</span>
          </h2>
          <p className="text-[var(--text-secondary)] mb-10 leading-relaxed">
            Join 47+ local businesses who run on AI — bookings, WhatsApp, CRM, website.
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
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-2xl font-black text-[var(--lime)] font-display">Docodo</span>
            </Link>
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">Create your account</h1>
          <p className="text-[var(--text-secondary)] text-sm mb-8">Free forever • No credit card required</p>

          <div className="glass rounded-2xl p-8 border border-[var(--border-default)]">
            {/* Google OAuth */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-50 transition-colors mb-6 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
              <span className="text-xs text-[var(--text-muted)] font-medium">or use email</span>
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input name="name" type="text" required placeholder="Your name" className="w-full pl-10 pr-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--lime)]/50 focus:ring-1 focus:ring-[var(--lime)]/20 transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input name="email" type="email" required placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--lime)]/50 focus:ring-1 focus:ring-[var(--lime)]/20 transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input name="password" type={showPass ? "text" : "password"} required placeholder="Min. 6 characters" className="w-full pl-10 pr-11 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--lime)]/50 focus:ring-1 focus:ring-[var(--lime)]/20 transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[var(--danger)] text-sm bg-[var(--danger)]/10 rounded-lg px-3 py-2 border border-[var(--danger)]/20">
                  {error}
                </motion.p>
              )}

              <button type="submit" disabled={isPending} className="w-full py-3.5 bg-[var(--lime)] text-[var(--bg-void)] font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-[var(--lime-glow-md)]">
                {isPending ? (<><Loader2 size={16} className="animate-spin" /> Creating account...</>) : (<>Start Free <ArrowRight size={16} /></>)}
              </button>

              <p className="text-xs text-center text-[var(--text-muted)] leading-relaxed">
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
        </motion.div>
      </div>
    </div>
  );
}
