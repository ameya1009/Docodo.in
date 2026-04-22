import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Col 1 */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-cabinet font-extrabold text-2xl tracking-tight flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[var(--color-accent-primary)] animate-pulse"></span>
              Docodo.
            </Link>
            <p className="text-[var(--color-text-secondary)] text-sm">
              The AI Growth OS That Works While You Sleep. Built for Pune SMBs and global founders.
            </p>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[var(--color-text-primary)] uppercase tracking-wider text-sm">Tools</h4>
            <Link href="/tools/whatsapp-nurturer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] text-sm transition-colors">WhatsApp AI Nurturer</Link>
            <Link href="/tools/content-repurposer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] text-sm transition-colors">Content Repurposer</Link>
            <Link href="/tools/growth-os" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] text-sm transition-colors">Growth OS in a Box</Link>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[var(--color-text-primary)] uppercase tracking-wider text-sm">Company</h4>
            <Link href="/case-studies" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] text-sm transition-colors">Case Studies</Link>
            <Link href="/blog" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] text-sm transition-colors">Blog</Link>
            <Link href="/about" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] text-sm transition-colors">About Amey</Link>
            <Link href="/careers" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] text-sm transition-colors">Careers</Link>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[var(--color-text-primary)] uppercase tracking-wider text-sm">Legal</h4>
            <Link href="/legal/privacy" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] text-sm transition-colors">Privacy Policy</Link>
            <Link href="/legal/terms" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] text-sm transition-colors">Terms of Service</Link>
            <Link href="/legal/refund" className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] text-sm transition-colors">Refund Policy</Link>
            <span className="text-[var(--color-accent-primary)] text-xs border border-[var(--color-accent-primary)] rounded px-2 py-1 w-max">DPDP Compliant</span>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--color-text-tertiary)] text-sm">
            © 2026 Docodo. Built in Pune, India.
          </p>
          <p className="text-[var(--color-text-tertiary)] text-xs">
            Powered by Claude AI + AWS + Firebase
          </p>
        </div>
      </div>
    </footer>
  );
};
