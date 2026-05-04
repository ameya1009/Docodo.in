"use client";

import React from "react";
import Link from "next/link";
import { 
  Youtube, 
  Linkedin, 
  Twitter, 
  Instagram, 
  ArrowRight,
  Heart
} from "lucide-react";
import { CONTACT, NAVIGATION } from "@/lib/constants";

export const Footer = () => {
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
              AI Growth OS for Pune SMBs & Founders Worldwide. Made in Pune 🇮🇳. Running globally.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Youtube, href: CONTACT.youtube },
                { icon: Linkedin, href: CONTACT.linkedin },
                { icon: Twitter, href: CONTACT.twitter },
                { icon: Instagram, href: "#" },
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--lime)] transition-all"
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-[var(--text-primary)]">Products</h4>
            <ul className="space-y-4">
              {["WhatsApp AI Nurturer", "Content Repurposer", "Docodo Care Plans", "Free 50-Point Audit", "All Tools"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-[var(--text-primary)]">Company</h4>
            <ul className="space-y-4">
              {["About Docodo", "Case Studies", "Blog", "Pricing", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-[var(--text-primary)]">Legal</h4>
            <ul className="space-y-4">
              {["Privacy Policy", "Terms of Service", "DPDP Compliance", "Data Deletion", "Refund Policy"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xs text-[var(--text-muted)]">
            © 2026 Docodo. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 items-center">
            {["AWS Powered", "Firebase", "DPDP Compliant", "SSL Secured"].map((badge) => (
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
