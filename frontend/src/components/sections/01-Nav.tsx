"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Menu, X, ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { NAVIGATION, VERTICALS, WHATSAPP_LINK } from "@/lib/constants";
import { useUIStore } from "@/store/ui";

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300",
      scrolled 
        ? "bg-[var(--bg-void)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] h-16" 
        : "bg-transparent h-20"
    )}>
      <div className="container h-full flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--lime)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--lime)]"></span>
          </span>
          <span className="font-display font-black text-2xl tracking-tight text-[var(--text-primary)] group-hover:text-[var(--lime)] transition-colors">
            DOCODO
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-mono font-bold tracking-widest px-2 py-0.5 rounded-full bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/30">
            India V1
          </span>
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden lg:flex items-center gap-7">
          {NAVIGATION.map((link) => {
            if (link.label === "Solutions") {
              return (
                <div 
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setSolutionsOpen(true)}
                  onMouseLeave={() => setSolutionsOpen(false)}
                >
                  <button 
                    className="flex items-center gap-1 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2"
                  >
                    {link.label} <ChevronDown size={14} className={cn("transition-transform duration-200", solutionsOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {solutionsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute top-full left-0 w-80 p-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-2xl grid grid-cols-1 gap-1"
                      >
                        <div className="px-3 py-1.5 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                          By Industry
                        </div>
                        {VERTICALS.map((v) => (
                          <Link
                            key={v.slug}
                            href={`/for/${v.slug}`}
                            onClick={() => setSolutionsOpen(false)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors group"
                          >
                            <div>
                              <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--lime)]">{v.name}</p>
                              <p className="text-[10px] text-[var(--text-muted)] truncate">{v.tagline}</p>
                            </div>
                            <span className="text-[10px] font-mono text-[var(--lime)] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link 
                key={link.label} 
                href={link.href}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="secondary" size="sm">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="sm" className="shadow-[var(--lime-glow-sm)]">
                Start for Free <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>
          
          <Link 
            href={WHATSAPP_LINK("Hi Docodo team! I want to try the 15-minute booking setup.")}
            className="p-2 text-[var(--lime)] hover:bg-[var(--lime-ghost)] rounded-full transition-colors"
            title="Chat on WhatsApp"
          >
            <MessageCircle size={20} />
          </Link>

          <button 
            className="lg:hidden p-2 text-[var(--text-primary)]"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
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
            className="fixed inset-0 z-40 bg-[var(--bg-void)]/98 backdrop-blur-2xl lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col min-h-full p-6 pt-20">
              <div className="flex flex-col gap-4">
                {NAVIGATION.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                  >
                    <Link 
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-display font-black text-2xl text-[var(--text-primary)] hover:text-[var(--lime)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="my-6 border-t border-[var(--border-subtle)] pt-4">
                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Industries</p>
                <div className="grid grid-cols-2 gap-2">
                  {VERTICALS.map((v) => (
                    <Link
                      key={v.slug}
                      href={`/for/${v.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs p-2 rounded-lg bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--lime)] truncate"
                    >
                      {v.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-[var(--border-subtle)]">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="lg" className="w-full">Merchant Login</Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="lg" className="w-full shadow-[var(--lime-glow-sm)]">
                    Start for Free (15 Mins) <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
