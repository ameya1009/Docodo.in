"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, ExternalLink, Copy, Check, QrCode, Eye, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WebsiteClientProps {
  business: any;
}

const SECTION_LABELS = [
  { id: "hero", label: "Hero / Banner", defaultOn: true },
  { id: "services", label: "Services", defaultOn: true },
  { id: "about", label: "About Us", defaultOn: true },
  { id: "gallery", label: "Photo Gallery", defaultOn: true },
  { id: "testimonials", label: "Testimonials", defaultOn: true },
  { id: "faq", label: "FAQ", defaultOn: false },
  { id: "contact", label: "Contact / Map", defaultOn: true },
  { id: "booking_cta", label: "Booking CTA Banner", defaultOn: true },
];

export default function WebsiteClient({ business }: WebsiteClientProps) {
  const [copied, setCopied] = useState(false);
  const [sections, setSections] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTION_LABELS.map((s) => [s.id, s.defaultOn]))
  );

  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://docodo.in"}/book/${business.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (id: string) => {
    setSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <Globe size={22} className="text-[var(--lime)]" /> Your Website
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your public booking page and website sections</p>
        </div>
        <Link
          href={`/book/${business.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--lime)]/40 text-[var(--lime)] text-sm font-semibold rounded-xl hover:bg-[var(--lime-ghost)] transition-colors"
        >
          <ExternalLink size={15} /> Preview Live Page
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-1 space-y-5">
          {/* Booking Link Card */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">🔗 Booking Link</h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">Share this with customers to receive bookings</p>
            <div className="flex items-center gap-2 p-3 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)] mb-3">
              <span className="text-xs text-[var(--text-secondary)] truncate flex-1 font-mono">
                docodo.in/book/{business.slug}
              </span>
              <button onClick={handleCopy} className="shrink-0 text-[var(--text-muted)] hover:text-[var(--lime)] transition-colors">
                {copied ? <Check size={14} className="text-[var(--success)]" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href={`/book/${business.slug}`} target="_blank" className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border border-[var(--border-default)] text-[var(--text-secondary)] rounded-xl hover:border-[var(--lime)]/30 hover:text-[var(--lime)] transition-all">
                <Eye size={14} /> Preview
              </Link>
              <button className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border border-[var(--border-default)] text-[var(--text-secondary)] rounded-xl hover:border-[var(--lime)]/30 hover:text-[var(--lime)] transition-all">
                <QrCode size={14} /> QR Code
              </button>
            </div>
          </div>

          {/* Business Info Quick View */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[var(--text-primary)]">Business Info</h3>
              <Link href="/dashboard/settings" className="text-xs text-[var(--lime)] hover:underline flex items-center gap-1">
                <Pencil size={11} /> Edit
              </Link>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: "Name", value: business.name },
                { label: "Industry", value: business.industry, className: "capitalize" },
                { label: "City", value: business.city ?? "Not set" },
                { label: "Phone", value: business.phone ?? "Not set" },
                { label: "Theme", value: business.style, className: "capitalize" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-[var(--text-muted)]">{item.label}</span>
                  <span className={cn("font-semibold text-[var(--text-primary)] text-right max-w-[60%] truncate", item.className)}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Section toggles + Preview */}
        <div className="lg:col-span-2 space-y-5">
          {/* Section Manager */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-4">Page Sections</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">Toggle which sections appear on your booking page. Changes apply immediately.</p>
            <div className="space-y-2.5">
              {SECTION_LABELS.map((section, i) => (
                <div key={section.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors">
                  <span className="text-sm font-medium text-[var(--text-primary)]">{section.label}</span>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={cn("transition-colors", sections[section.id] ? "text-[var(--lime)]" : "text-[var(--text-disabled)]")}
                  >
                    {sections[section.id] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Services Summary */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[var(--text-primary)]">Services on Booking Page</h3>
              <Link href="/dashboard/settings" className="text-xs text-[var(--lime)] hover:underline">
                Manage
              </Link>
            </div>
            <div className="space-y-2">
              {business.services.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">No services yet. <Link href="/dashboard/settings" className="text-[var(--lime)] hover:underline">Add services →</Link></p>
              ) : (
                business.services.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between py-2 px-3 bg-[var(--bg-elevated)] rounded-lg">
                    <span className="text-sm text-[var(--text-primary)]">{s.name}</span>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span>{s.duration} min</span>
                      <span className="font-bold text-[var(--lime)]">
                        {s.price > 0 ? `₹${s.price.toLocaleString("en-IN")}` : "Free"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
