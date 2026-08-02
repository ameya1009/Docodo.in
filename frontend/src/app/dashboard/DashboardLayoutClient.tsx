"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, Users, Globe, Sparkles,
  Settings, LogOut, Menu, X, ChevronRight, Bell, ExternalLink,
  MessageSquare, BarChart3
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true, mobileNav: true },
  { href: "/dashboard/bookings", label: "Bookings", icon: Calendar, mobileNav: true },
  { href: "/dashboard/customers", label: "Customers", icon: Users, mobileNav: true },
  { href: "/dashboard/whatsapp", label: "WhatsApp", icon: MessageSquare, mobileNav: true },
  { href: "/dashboard/ai-content", label: "AI Suite", icon: Sparkles, mobileNav: true },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, mobileNav: false },
  { href: "/dashboard/website", label: "Website", icon: Globe, mobileNav: false },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, mobileNav: false },
];

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; image?: string | null };
  businessName?: string;
  businessSlug?: string;
}

export default function DashboardLayoutClient({
  children,
  user,
  businessName,
  businessSlug,
}: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item: typeof NAV_ITEMS[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div>
          <span className="text-xl font-black text-[var(--lime)] font-display">Docodo</span>
          {businessName && (
            <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate max-w-[170px]">{businessName}</p>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                active
                  ? "bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/20 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{item.label}</span>
              {active && <ChevronRight size={15} className="ml-auto opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Booking Link */}
      {businessSlug && (
        <div className="px-3 py-3 border-t border-[var(--border-subtle)]">
          <Link
            href={`/book/${businessSlug}`}
            target="_blank"
            className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-bold text-[var(--bg-void)] bg-[var(--lime)] hover:bg-[var(--lime-hover)] transition-all shadow-[var(--lime-glow-sm)] active:scale-95"
          >
            <ExternalLink size={14} className="shrink-0" />
            <span className="truncate">Public Booking Page</span>
          </Link>
        </div>
      )}

      {/* User */}
      <div className="px-3 py-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--bg-elevated)]/50">
          <div className="w-9 h-9 rounded-full bg-[var(--lime-ghost)] border border-[var(--lime)]/40 flex items-center justify-center text-sm font-black text-[var(--lime)] shrink-0 shadow-inner">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user.name}</p>
            <p className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors active:scale-90"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex flex-col lg:flex-row text-[var(--text-primary)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col lg:hidden shadow-2xl"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content wrapper */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-[var(--bg-deep)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 sm:px-6 h-16 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all active:scale-95"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="lg:hidden font-display font-black text-lg text-[var(--text-primary)] flex items-center gap-2">
              <span className="text-[var(--lime)]">●</span> Docodo
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard/whatsapp"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              WhatsApp Engine Online
            </Link>

            <button className="relative p-2.5 rounded-xl bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all active:scale-95">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--lime)] rounded-full shadow-[0_0_8px_#C8F135]" />
            </button>
          </div>
        </header>

        {/* Page Content with added bottom padding for mobile bottom nav */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8 overflow-x-hidden">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar (Persistent Thumb Ergonomics) */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[var(--bg-surface)]/95 backdrop-blur-lg border-t border-[var(--border-default)] px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          {NAV_ITEMS.filter(i => i.mobileNav).map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[62px] py-1 px-2 rounded-xl text-[11px] font-medium transition-all active:scale-90",
                  active
                    ? "text-[var(--lime)] font-bold bg-[var(--lime-ghost)] border border-[var(--lime)]/20"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                <Icon size={18} className={cn("mb-1", active && "text-[var(--lime)] filter drop-shadow-[0_0_6px_rgba(200,241,53,0.5)]")} />
                <span className="truncate max-w-[60px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
