import React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Clock, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Cancellation & Refund Policy | Docodo",
  description: "Official cancellation, reschedule, and refund policy for appointment bookings on Docodo.",
};

export default function RefundPolicyPage() {
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
            <RefreshCw size={13} /> Razorpay & RBI Compliant Refund Framework
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Cancellation & Refund Policy</h1>
          <p className="text-sm text-[var(--text-secondary)]">Last updated: August 2026</p>
        </div>

        <div className="space-y-8 pt-8 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-[var(--lime)]" /> 1. Customer Appointment Cancellations & Rescheduling
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-muted)]">
              <li><strong>Free Cancellation Window:</strong> Customers may cancel or reschedule their appointment up to 2 hours prior to the scheduled start time without any cancellation fee.</li>
              <li><strong>Late Cancellations / No-Shows:</strong> Cancellations made under 2 hours or failure to arrive at the scheduled time may be subject to a partial retention fee at the merchant&apos;s discretion.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw size={18} className="text-[var(--lime)]" /> 2. Refund Processing Timeline
            </h2>
            <p>
              When a refund is approved by the merchant or initiated following a service cancellation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-muted)]">
              <li><strong>UPI & Netbanking Refunds:</strong> Credited back to the customer&apos;s original bank account within <strong>2 to 4 business days</strong>.</li>
              <li><strong>Debit / Credit Card Refunds:</strong> Reflected on the card statement within <strong>5 to 7 business days</strong> as per banking network standards.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle size={18} className="text-[var(--lime)]" /> 3. SaaS Subscription Refunds (for Merchants)
            </h2>
            <p>
              Merchants subscribing to Docodo Growth or Care Plans are entitled to a <strong>14-day money-back guarantee</strong> if they are unsatisfied with the onboarding or booking software performance. To claim a SaaS refund, email <a href="mailto:billing@docodo.in" className="text-[var(--lime)] underline">billing@docodo.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
