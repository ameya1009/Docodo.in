import React from 'react';
import Link from 'next/link';
import { Youtube, Linkedin, Twitter, MessageSquare } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-bg-deep pt-32 pb-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Col 1 */}
          <div className="space-y-6">
            <Link href="/" className="font-display font-black text-2xl tracking-tighter text-white">
              DOCODO<span className="text-lime">.</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The AI Growth OS for Pune SMBs and global founders. 
              Turning businesses into automated machines.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-lime hover:text-bg-deep transition-all">
                <Youtube size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-lime hover:text-bg-deep transition-all">
                <Linkedin size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-lime hover:text-bg-deep transition-all">
                <Twitter size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-lime hover:text-bg-deep transition-all">
                <MessageSquare size={18} />
              </Link>
            </div>
            <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">
              Made in Pune. Used globally.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-6">
            <h4 className="text-white font-display font-bold text-sm uppercase tracking-widest">Products</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/tools/whatsapp-nurturer" className="hover:text-lime transition-colors">WhatsApp Nurturer</Link></li>
              <li><Link href="/tools/content-repurposer" className="hover:text-lime transition-colors">Content Repurposer</Link></li>
              <li><Link href="/care-plans" className="hover:text-lime transition-colors">Care Plans</Link></li>
              <li><Link href="/audit" className="hover:text-lime transition-colors">Free 50-Point Audit</Link></li>
              <li><Link href="/tools" className="hover:text-lime transition-colors">AI Tools Marketplace</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-6">
            <h4 className="text-white font-display font-bold text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-lime transition-colors">About Docodo</Link></li>
              <li><Link href="/case-studies" className="hover:text-lime transition-colors">Case Studies</Link></li>
              <li><Link href="/blog" className="hover:text-lime transition-colors">Blog & News</Link></li>
              <li><Link href="/pricing" className="hover:text-lime transition-colors">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-lime transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-6">
            <h4 className="text-white font-display font-bold text-sm uppercase tracking-widest">Trust & Legal</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link href="/privacy" className="hover:text-lime transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-lime transition-colors">Terms of Service</Link></li>
              <li><Link href="/compliance" className="hover:text-lime transition-colors">DPDP Compliance</Link></li>
              <li><Link href="/data-deletion" className="hover:text-lime transition-colors">Data Deletion Request</Link></li>
              <li><Link href="/refunds" className="hover:text-lime transition-colors">Refund Policy</Link></li>
            </ul>
            <div className="pt-4">
              <span className="px-3 py-1 border border-lime/30 text-lime text-[10px] font-black uppercase tracking-widest rounded-md bg-lime/5">
                DPDP Act 2023 Compliant
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-700 uppercase tracking-[0.2em] font-bold">
          <p>© 2026 Docodo. All rights reserved.</p>
          <div className="flex gap-6">
            <span>AWS Infrastructure</span>
            <span>Firebase Cloud</span>
            <span>Claude AI Powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
