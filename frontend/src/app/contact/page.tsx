"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--lime)] transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to Docodo Home
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column: Contact Info */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] text-xs font-mono font-bold">
              <MessageSquare size={13} /> 24/7 Dedicated Support
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
              Let&apos;s scale your service business
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Have questions about Docodo&apos;s 15-minute booking setup, payment settlements, or AI growth automation? Our team in Pune is here to help.
            </p>

            <div className="space-y-4 pt-4">
              <a
                href="https://wa.me/919876543210?text=Hi%20Docodo%2C%20I%20would%20like%20to%20learn%20more%20about%20the%20booking%20platform."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--lime)]/40 rounded-2xl transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">WhatsApp Direct Support</p>
                  <p className="text-sm font-bold text-white group-hover:text-[var(--lime)] transition-colors">+91 98765 43210</p>
                </div>
              </a>

              <a
                href="mailto:support@docodo.in"
                className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--lime)]/40 rounded-2xl transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--lime-ghost)] text-[var(--lime)] flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Email Support</p>
                  <p className="text-sm font-bold text-white group-hover:text-[var(--lime)] transition-colors">support@docodo.in</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Headquarters</p>
                  <p className="text-sm font-bold text-white">Pune, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[var(--lime-ghost)] border border-[var(--lime)]/30 text-[var(--lime)] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">Message Received!</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
                  Our team will reach out via WhatsApp / Email within 30 minutes.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                  className="px-6 py-2.5 bg-[var(--bg-elevated)] text-xs font-bold text-white rounded-xl hover:bg-[var(--bg-elevated)]/80"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-white font-display">Send us a message</h3>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Deshmukh"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--lime)]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--lime)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="priya@salon.in"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--lime)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">Business Details / Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your salon, spa, or clinic and what you need..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--lime)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[var(--lime)] text-[var(--bg-void)] font-black text-sm rounded-xl hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-sm)] flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> Submit Inquiry</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
