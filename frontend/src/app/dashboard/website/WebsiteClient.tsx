"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, ExternalLink, Copy, Check, QrCode, Eye, Pencil, ToggleLeft, ToggleRight, Loader2, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseWebsiteConfig, generateEmbedSnippet } from "@/lib/engines/website-engine";

interface WebsiteClientProps {
  business: any;
}

const SECTION_LABELS = [
  { id: "hero", label: "Hero / Banner" },
  { id: "services", label: "Services Showcase" },
  { id: "about", label: "About Us" },
  { id: "gallery", label: "Photo Gallery" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faq", label: "Frequently Asked Questions (FAQ)" },
  { id: "contact", label: "Contact & Location Map" },
  { id: "booking_cta", label: "Instant Booking CTA Banner" },
];

export default function WebsiteClient({ business }: WebsiteClientProps) {
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [sections, setSections] = useState<Record<string, boolean>>(() =>
    parseWebsiteConfig(business.websiteConfig)
  );
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://docodo.in";
  const bookingUrl = `${appUrl}/book/${business.slug}`;
  const embedCode = generateEmbedSnippet(business.slug, appUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const toggleSection = (id: string) => {
    const nextState = { ...sections, [id]: !sections[id] };
    setSections(nextState);

    startTransition(async () => {
      try {
        const { updateWebsiteSectionsAction } = await import("@/lib/actions/website");
        await updateWebsiteSectionsAction({
          businessId: business.id,
          sections: nextState,
        });
        setSaveMessage("Saved to database!");
        setTimeout(() => setSaveMessage(""), 2500);
      } catch (err: any) {
        console.error("Failed to save website config:", err);
        // Revert local state on database failure
        setSections(sections);
        alert(err.message || "Failed to sync changes with server.");
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-2">
            <Globe size={22} className="text-[var(--lime)]" /> Website &amp; Booking Engine Generator
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage public page sections, embed codes, and instant QR booking links</p>
        </div>
        <Link
          href={`/book/${business.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--lime)]/10 border border-[var(--lime)]/40 text-[var(--lime)] text-sm font-semibold rounded-xl hover:bg-[var(--lime)]/20 transition-all shadow-sm"
        >
          <ExternalLink size={15} /> Preview Live Page
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-1 space-y-5">
          {/* Booking Link Card */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">🔗 Direct Booking Link</h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">Share on WhatsApp, Instagram, or via SMS</p>
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
              <button onClick={() => setShowQR(true)} className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border border-[var(--border-default)] text-[var(--text-secondary)] rounded-xl hover:border-[var(--lime)]/30 hover:text-[var(--lime)] transition-all">
                <QrCode size={14} /> QR Code
              </button>
            </div>
          </div>

          {/* Embed Snippet Generator */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5 mb-1">
              <Code2 size={16} className="text-[var(--lime)]" /> HTML Iframe Embed Code
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">Embed your responsive appointment scheduler directly onto any existing corporate website.</p>
            <div className="relative bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-3 text-[11px] font-mono text-[var(--text-secondary)] break-all max-h-24 overflow-y-auto mb-3">
              {embedCode}
            </div>
            <button
              onClick={handleCopyEmbed}
              className="w-full py-2 bg-[var(--bg-elevated)] hover:bg-[var(--bg-deep)] border border-[var(--border-default)] hover:border-[var(--lime)]/40 text-xs font-bold text-[var(--text-primary)] rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {embedCopied ? (
                <><Check size={14} className="text-[var(--success)]" /> Embed Code Copied!</>
              ) : (
                <><Copy size={14} /> Copy Embed Snippet</>
              )}
            </button>
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
          {/* Section Manager with real database persistence */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-[var(--text-primary)]">Live Website Section Engine</h3>
              <span className="text-xs font-semibold">
                {isPending ? (
                  <span className="text-amber-400 inline-flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> Saving to DB...</span>
                ) : saveMessage ? (
                  <span className="text-[var(--success)] inline-flex items-center gap-1"><Check size={14} /> {saveMessage}</span>
                ) : (
                  <span className="text-[var(--text-muted)]">Synchronized with DB</span>
                )}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mb-6">
              Toggle which layout sections appear on your public landing page. Changes immediately persist to Postgres and invalidate Next.js caches.
            </p>
            <div className="space-y-3">
              {SECTION_LABELS.map((section) => {
                const isEnabled = !!sections[section.id];
                return (
                  <div
                    key={section.id}
                    onClick={() => !isPending && toggleSection(section.id)}
                    className={cn(
                      "flex items-center justify-between py-3 px-4 rounded-xl border transition-all cursor-pointer select-none",
                      isEnabled
                        ? "bg-[var(--bg-elevated)] border-[var(--lime)]/30 hover:border-[var(--lime)]/60"
                        : "bg-[var(--bg-surface)] border-[var(--border-subtle)] opacity-60 hover:opacity-90"
                    )}
                  >
                    <div>
                      <span className="text-sm font-bold text-[var(--text-primary)] block">{section.label}</span>
                      <span className="text-[11px] text-[var(--text-muted)]">
                        {isEnabled ? "Visible to public visitors" : "Hidden from booking site"}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={isPending}
                      className={cn("transition-all duration-200 transform scale-105", isEnabled ? "text-[var(--lime)]" : "text-[var(--text-disabled)]")}
                    >
                      {isEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Services Summary */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-[var(--text-primary)]">Services on Booking Page</h3>
              <Link href="/dashboard/settings" className="text-xs text-[var(--lime)] hover:underline font-bold">
                Manage Services →
              </Link>
            </div>
            <div className="space-y-2">
              {(!business.services || business.services.length === 0) ? (
                <p className="text-sm text-[var(--text-muted)] p-3 bg-[var(--bg-elevated)] rounded-xl text-center">No services yet. <Link href="/dashboard/settings" className="text-[var(--lime)] hover:underline font-bold">Add services →</Link></p>
              ) : (
                business.services.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between py-2.5 px-3.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{s.name}</span>
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span>{s.duration} min</span>
                      <span className="font-extrabold text-[var(--lime)]">
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

      {/* Interactive QR Code Display Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-[var(--text-primary)]">Store Counter QR Code</h3>
            <p className="text-xs text-[var(--text-secondary)]">Let walk-in clients scan and book instantly on WhatsApp & Web!</p>
            <div className="flex justify-center p-4 bg-white rounded-2xl mx-auto w-fit shadow-inner">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingUrl)}`} alt="Store Booking QR Code" className="w-48 h-48 rounded-lg" />
            </div>
            <p className="text-[11px] font-mono text-[var(--lime)] break-all px-2 py-1 bg-[var(--bg-elevated)] rounded-lg">{bookingUrl}</p>
            <div className="flex gap-2 pt-2">
              <a href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(bookingUrl)}`} target="_blank" download="Docodo-QR.png" className="flex-1 py-2.5 bg-[var(--lime)] text-[var(--bg-void)] font-bold rounded-xl text-xs hover:bg-[var(--lime-hover)] transition-colors">
                Download High-Res
              </a>
              <button onClick={() => setShowQR(false)} className="px-4 py-2.5 bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold rounded-xl text-xs hover:bg-[var(--bg-deep)] transition-colors">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
