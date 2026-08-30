"use client";

import React, { useState, useTransition, Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { ResetPasswordSchema } from "@/lib/validations/auth";
import { requestPasswordResetAction } from "@/lib/actions/auth";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Client-side Zod validation
    const validation = ResetPasswordSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const result = await requestPasswordResetAction(fd);
        if (result?.error) {
          setError(result.error);
        } else {
          setSubmittedEmail(email);
        }
      } catch (err: any) {
        setError("Unable to process your request at this time. Please try again.");
      }
    });
  };

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <span className="text-2xl font-black text-[var(--lime)] font-display">Docodo</span>
        </Link>
        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">Reset Password</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Enter your registered email address to receive password reset instructions
        </p>
      </div>

      {/* Card */}
      <div className="glass rounded-2xl p-8 border border-[var(--border-default)]">
        {submittedEmail ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-5"
          >
            <div className="w-16 h-16 rounded-2xl bg-[var(--lime)]/10 text-[var(--lime)] flex items-center justify-center mx-auto border border-[var(--lime)]/20 shadow-[var(--lime-glow-sm)]">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Check your email</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                If an account exists for{" "}
                <span className="text-[var(--lime)] font-semibold">{submittedEmail}</span>,
                we have dispatched a secure link to reset your password.
              </p>
            </div>

            <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-muted)] text-left space-y-1">
              <p>• Didn&apos;t receive an email? Check your spam or promotions folder.</p>
              <p>• Reset links expire after 60 minutes for security.</p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmittedEmail(null);
                  setEmail("");
                  setError("");
                }}
                className="w-full py-3 px-4 bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm font-semibold rounded-xl border border-[var(--border-default)] transition-colors"
              >
                Try another email
              </button>

              <Link
                href="/auth/login"
                className="w-full py-3.5 bg-[var(--lime)] text-[var(--bg-void)] font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
              >
                <ArrowLeft size={16} /> Return to Sign In
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-sm focus:outline-none focus:border-[var(--lime)]/50 focus:ring-1 focus:ring-[var(--lime)]/20 transition-all"
                />
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[var(--danger)] text-sm bg-[var(--danger)]/10 rounded-lg px-3.5 py-2.5 border border-[var(--danger)]/20 flex items-start gap-2"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || !email.trim()}
              className="w-full py-3.5 bg-[var(--lime)] text-[var(--bg-void)] font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending Instructions...
                </>
              ) : (
                <>
                  Send Reset Link <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Return to Login */}
            <div className="pt-2 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--lime)] transition-colors font-medium"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>

      <p className="text-center text-sm text-[var(--text-muted)] mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-[var(--lime)] font-semibold hover:underline">
          Start free
        </Link>
      </p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center p-4">
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
          <ForgotPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
