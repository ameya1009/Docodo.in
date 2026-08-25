import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Docodo SaaS Platform",
  description: "Privacy policy and data protection standards for Docodo SaaS booking and CRM platform in compliance with DPDP Act 2023.",
};

export default function PrivacyPolicyPage() {
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
            <Shield size={13} /> Digital Personal Data Protection (DPDP) Act 2023 Compliant
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white">Privacy Policy</h1>
          <p className="text-sm text-[var(--text-secondary)]">Last updated: August 2026</p>
        </div>

        <div className="space-y-8 pt-8 text-sm text-[var(--text-secondary)] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye size={18} className="text-[var(--lime)]" /> 1. Information We Collect
            </h2>
            <p>
              Docodo Technologies Private Limited (&quot;Docodo&quot;, &quot;we&quot;, &quot;our&quot;) provides an automated B2B SaaS booking, CRM, and growth platform for Indian local appointment-based businesses. We collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-muted)]">
              <li><strong>Business Account Information:</strong> Name, phone number, email address, business location, GSTIN (if applicable), and account credentials.</li>
              <li><strong>Customer Booking Data:</strong> Customer name, phone number, appointment schedule, selected service, and transaction identifiers collected strictly on behalf of the merchant.</li>
              <li><strong>Payment Telemetry:</strong> Transaction identifiers, payment methods, and timestamps processed securely through our RBI-authorized payment partner (Razorpay). We do not store raw card numbers or CVVs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock size={18} className="text-[var(--lime)]" /> 2. How We Use & Protect Your Data
            </h2>
            <p>We use the collected information solely to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-muted)]">
              <li>Facilitate real-time appointment reservations and prevent double-booking collisions.</li>
              <li>Dispatch automated transactional WhatsApp and email confirmations for confirmed slots.</li>
              <li>Enable merchants to manage their customer database and view real-time revenue analytics.</li>
              <li>Process payments and settle merchant payouts in compliance with Indian financial regulations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-[var(--lime)]" /> 3. Data Storage & Security
            </h2>
            <p>
              All personal and financial data is encrypted in transit using TLS 1.3 and at rest with AES-256 encryption. Databases reside in certified high-security cloud regions in India. We do not sell, rent, or trade merchant or customer data to third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Your Rights & Grievance Redressal</h2>
            <p>
              Under the Indian Digital Personal Data Protection (DPDP) Act 2023, you have the right to access, rectify, or request deletion of your personal data. For grievances, contact our Data Protection Officer at:
            </p>
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl font-mono text-xs text-white space-y-1">
              <p>Email: <a href="mailto:privacy@docodo.in" className="text-[var(--lime)] underline">privacy@docodo.in</a></p>
              <p>Address: Docodo Technologies Pvt Ltd, Pune, Maharashtra, India 411045</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
