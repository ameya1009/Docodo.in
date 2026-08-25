import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Docodo SaaS Platform",
  description: "Terms of Service and Merchant Agreement for using Docodo appointment booking and CRM SaaS.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--lime)] transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Docodo Home
        </Link>

        <div className="space-y-4 pb-8 border-b border-[var(--border-subtle)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] text-xs font-mono font-bold">
            <FileText size={13} /> Merchant Agreement & Master Terms
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Terms of Service</h1>
          <p className="text-sm text-[var(--text-secondary)]">Effective date: August 2026</p>
        </div>

        <div className="space-y-8 pt-8 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle size={18} className="text-[var(--lime)]" /> 1. Acceptance of Terms
            </h2>
            <p>
              By registering an account, creating a business profile, or utilizing the booking links provided by Docodo Technologies Private Limited (&quot;Docodo&quot;), you agree to be bound by these Terms of Service. If you are registering on behalf of a salon, clinic, spa, gym, or commercial entity, you represent that you possess legal authority to bind that entity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle size={18} className="text-[var(--lime)]" /> 2. SaaS Service Scope & Subscriptions
            </h2>
            <p>
              Docodo grants merchants a non-exclusive, revocable license to access our cloud-based booking engine, digital catalog customizer, customer database (CRM), and payment processing gateway. Subscription tiers are billed monthly or annually as specified during signup.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle size={18} className="text-[var(--lime)]" /> 3. Payment Processing & Merchant Obligations
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-muted)]">
              <li>Merchants are solely responsible for fulfilling booked services in a professional manner at their physical premises.</li>
              <li>Online appointment transactions are processed through Razorpay. Payouts are settled according to standard RBI T+2 settlement cycles.</li>
              <li>Docodo does not charge hidden commission fees beyond the agreed SaaS plan and standard payment gateway processing fees.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Limitation of Liability & Dispute Jurisdiction</h2>
            <p>
              To the maximum extent permitted by Indian Law, Docodo shall not be liable for indirect, punitive, or consequential damages resulting from merchant-customer service disputes. All legal matters are subject to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
