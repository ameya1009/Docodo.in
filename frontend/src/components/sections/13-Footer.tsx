"use client";

import React from "react";
import Link from "next/link";
import { 
  Youtube, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Heart
} from "lucide-react";
import { CONTACT } from "@/lib/constants";

export const Footer = () => {
  const productLinks = [
    { label: "WhatsApp AI Nurturer", href: "/tools/whatsapp-nurturer" },
    { label: "Content Repurposer", href: "/tools/content-repurposer" },
    { label: "Docodo Care Plans", href: "/care-plans" },
    { label: "Free 50-Point Audit", href: "/audit" },
    { label: "All Free AI Tools", href: "/tools" },
  ];

  const companyLinks = [
    { label: "About Docodo", href: "/" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Pricing & Plans", href: "/care-plans" },
    { label: "Contact & Support", href: "/contact" },
    { label: "Engineering Blog", href: "https://medium.com/@ameyakshirsagar02" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cancellation & Refunds", href: "/refund-policy" },
    { label: "DPDP 2023 Compliance", href: "/privacy" },
    { label: "Support & Grievances", href: "/contact" },
  ];

  return (
    <footer className="bg-[var(--bg-void)] border-t border-[var(--border-subtle)] pt-24 pb-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--lime)]"></span>
              </span>
              <span className="font-display font-black text-2xl tracking-tight text-[var(--text-primary)]">
                DOCODO
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm max-w-xs mb-8 leading-relaxed">
              AI Growth OS for Indian SMBs & Service Businesses Worldwide. Made in Pune 🇮🇳.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Youtube, href: CONTACT.youtube },
                { icon: Linkedin, href: CONTACT.linkedin },
                { icon: Twitter, href: CONTACT.twitter },
                { icon: Instagram, href: "https://instagram.com/docodo.in" },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--lime)] transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-[var(--text-primary)]">Products</h4>
            <ul className="space-y-4">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[var(--text-muted)] hover:text-[var(--lime)] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-[var(--text-primary)]">Company</h4>
            <ul className="space-y-4">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[var(--text-muted)] hover:text-[var(--lime)] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-[var(--text-primary)]">Legal</h4>
            <ul className="space-y-4">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[var(--text-muted)] hover:text-[var(--lime)] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xs text-[var(--text-muted)]">
            © 2026 Docodo Technologies Pvt Ltd. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 items-center">
            {["Next.js 16", "PostgreSQL", "DPDP Compliant", "Razorpay Secured"].map((badge) => (
              <span key={badge} className="text-[10px] font-bold text-[var(--text-disabled)] uppercase tracking-widest">
                {badge}
              </span>
            ))}
          </div>

          <div className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            Built with <Heart size={12} className="text-red-500 fill-current" /> in Pune
          </div>
        </div>
      </div>
    </footer>
  );
};
