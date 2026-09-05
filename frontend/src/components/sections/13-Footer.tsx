"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle, Heart, ArrowRight } from "lucide-react";
import { FOOTER_LINKS, WHATSAPP_LINK } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="bg-[var(--bg-void)] border-t border-[var(--border-subtle)] pt-16 pb-12 relative overflow-hidden text-xs">
      <div className="container relative z-10">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Col 1: Product */}
          <div>
            <h4 className="font-bold text-sm text-[var(--text-primary)] font-display uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.product.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[var(--text-secondary)] hover:text-[var(--lime)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Solutions */}
          <div>
            <h4 className="font-bold text-sm text-[var(--text-primary)] font-display uppercase tracking-wider mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.solutions.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[var(--text-secondary)] hover:text-[var(--lime)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="font-bold text-sm text-[var(--text-primary)] font-display uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[var(--text-secondary)] hover:text-[var(--lime)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <h4 className="font-bold text-sm text-[var(--text-primary)] font-display uppercase tracking-wider mb-4">
              Legal &amp; Trust
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[var(--text-secondary)] hover:text-[var(--lime)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Account & Launch */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-bold text-sm text-[var(--text-primary)] font-display uppercase tracking-wider mb-4">
              Account
            </h4>
            <ul className="space-y-2.5 mb-6">
              {FOOTER_LINKS.account.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[var(--text-secondary)] hover:text-[var(--lime)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link 
              href={WHATSAPP_LINK("Hi Docodo team! I want to set up my business.")}
              className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30 hover:bg-[var(--lime)] hover:text-black font-bold transition-all"
            >
              <MessageCircle size={15} /> WhatsApp Support
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-base text-[var(--text-primary)]">DOCODO</span>
            <span>• Built with ❤️ for local businesses in India.</span>
          </div>
          <div className="font-mono text-[11px]">
            © {new Date().getFullYear()} Docodo.in. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
