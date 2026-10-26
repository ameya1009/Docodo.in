"use client";

import React from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <aside aria-label="Support and Contact Options">
      <Link
        href="https://wa.me/919284310604"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Docodo Clinic Team on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-105 group border border-white/20"
      >
        <span className="relative flex items-center justify-center">
          <span className="absolute -inset-1 rounded-full bg-white/40 animate-ping opacity-75" />
          <MessageCircle className="w-5 h-5 fill-white text-white relative z-10" />
        </span>
        <span className="text-xs font-bold tracking-tight font-body hidden sm:inline-block">
          Chat on WhatsApp
        </span>
      </Link>
    </aside>
  );
}
