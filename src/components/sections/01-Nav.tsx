"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { NAVIGATION, CONTACT, WHATSAPP_LINK } from "@/lib/constants";
import { useUIStore } from "@/store/ui";

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300",
      scrolled 
        ? "bg-[var(--bg-void)]/85 backdrop-blur-xl border-b border-[var(--border-subtle)] h-16" 
        : "bg-transparent h-20"
    )}>
      <div className="container h-full flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--lime)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--lime)]"></span>
          </span>
          <span className="font-display font-black text-xl tracking-tight text-[var(--text-primary)]">
            DOCODO
          </span>
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAVIGATION.map((link) => (
            <Link 
              key={link.label} 
              href={link.href}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/audit">
              <Button variant="secondary" size="sm">Free Audit</Button>
            </Link>
            <Link href={WHATSAPP_LINK("I want to get started with Docodo")}>
              <Button variant="primary" size="sm">
                Get Started <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>
          
          <Link 
            href={WHATSAPP_LINK("Hi Docodo team!")}
            className="p-2 text-[var(--lime)] hover:bg-[var(--lime-ghost)] rounded-full transition-colors"
          >
            <MessageCircle size={20} />
          </Link>

          <button 
            className="md:hidden p-2 text-[var(--text-primary)]"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-[var(--bg-void)]/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col h-full p-8 pt-24">
              <div className="flex flex-col gap-6">
                {NAVIGATION.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link 
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-display font-black text-4xl hover:text-[var(--lime)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <Link href="/audit" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="lg" className="w-full">Free Audit</Button>
                </Link>
                <Link href={WHATSAPP_LINK("I want to get started")} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="lg" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
