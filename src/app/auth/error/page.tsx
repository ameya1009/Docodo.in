"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "There is a problem with the server configuration. Please contact support.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The sign-in link has expired or has already been used.",
  OAuthSignin: "Could not sign in with Google. Please try again.",
  OAuthCallback: "There was an error during the Google sign-in process.",
  Default: "An unexpected error occurred. Please try again.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Default";
  const message = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default;

  return (
    <div className="w-full max-w-md text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--danger)]/15 text-[var(--danger)] mb-6">
        <AlertTriangle size={32} />
      </div>
      <h1 className="text-2xl font-black text-[var(--text-primary)] mb-3">Authentication Error</h1>
      <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">{message}</p>
      <Link href="/auth/login" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--lime)] text-[var(--bg-void)] font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-colors">
        <ArrowLeft size={16} /> Back to Login
      </Link>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-center text-[var(--text-muted)] flex flex-col items-center gap-2"><Loader2 className="w-8 h-8 animate-spin text-[var(--lime)]" /><span>Loading error details...</span></div>}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
