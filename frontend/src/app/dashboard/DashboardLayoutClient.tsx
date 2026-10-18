"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, Users, Globe, Sparkles,
  Settings, LogOut, Menu, X, ChevronRight, Bell, ExternalLink,
  MessageSquare, BarChart3, Zap, ShieldCheck, Crown, Lock
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true, mobileNav: true, minPlan: "PILOT" },
  { href: "/dashboard/bookings", label: "Bookings", icon: Calendar, mobileNav: true, minPlan: "PILOT" },
  { href: "/dashboard/customers", label: "Customers", icon: Users, mobileNav: true, minPlan: "PILOT" },
  { href: "/dashboard/whatsapp", label: "WhatsApp", icon: MessageSquare, mobileNav: true, minPlan: "STARTER" },
  { href: "/dashboard/automations", label: "Automations", icon: Zap, mobileNav: true, minPlan: "GROWTH" },
  { href: "/dashboard/ai-content", label: "AI Suite", icon: Sparkles, mobileNav: true, minPlan: "GROWTH" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3, mobileNav: false, minPlan: "GROWTH" },
  { href: "/dashboard/website", label: "Website", icon: Globe, mobileNav: false, minPlan: "PILOT" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, mobileNav: false, minPlan: "PILOT" },
];

interface SidebarContentProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
  businessName?: string;
  businessSlug?: string;
  pathname: string;
  plan?: string;
  onClose?: () => void;
}

function SidebarContent({
  user,
  businessName,
  businessSlug,
  pathname,
  plan = "PILOT",
  onClose,
}: SidebarContentProps) {
  const currentPlan = plan.toUpperCase();
  const isActive = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[var(--border-subtle)] space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black text-[var(--lime)] font-display">Docodo</span>
            {businessName && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate max-w-[170px]">{businessName}</p>
            )}
          </div>
        </div>

        {/* Plan Status Banner */}
        <div>
          {currentPlan === "PILOT" && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="font-mono text-[10px] text-zinc-400 font-bold">PILOT (50 CAP)</span>
              <Link href="/pricing" onClick={onClose} className="text-[10px] font-black text-black bg-white hover:brightness-110 px-2 py-0.5 rounded-md transition-all shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                Upgrade →
              </Link>
            </div>
          )}
          {currentPlan === "STARTER" && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="font-mono text-[10px] text-white font-bold flex items-center gap-1">
                <ShieldCheck size={11} className="text-white" /> STARTER OS
              </span>
              <Link href="/checkout?plan=growth" onClick={onClose} className="text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md transition-all">
                Go Pro →
              </Link>
            </div>
          )}
          {(currentPlan === "GROWTH" || currentPlan === "PRO") && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/10 border border-white/20 text-xs">
              <span className="font-mono text-[10px] text-white font-black flex items-center gap-1 shadow-[0_0_10px_#ffffff]">
                <Crown size={12} className="text-white" /> GROWTH PRO
              </span>
              <span className="text-[9px] font-mono text-zinc-400">UNLIMITED</span>
            </div>
          )}
          {currentPlan === "CONCIERGE" && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/15 border border-white/30 text-xs">
              <span className="font-mono text-[10px] text-white font-black flex items-center gap-1 shadow-[0_0_15px_#ffffff]">
                <Sparkles size={12} className="text-white" /> CONCIERGE VIP
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const isGrowthLocked = item.minPlan === "GROWTH" && (currentPlan === "PILOT" || currentPlan === "STARTER");
          const isStarterLocked = item.minPlan === "STARTER" && currentPlan === "PILOT";

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                active
                  ? "bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/20 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{item.label}</span>
              {isGrowthLocked && (
                <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-400 font-bold border border-white/10">
                  PRO
                </span>
              )}
              {isStarterLocked && !isGrowthLocked && (
                <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-400 font-bold border border-white/10">
                  PLUS
                </span>
              )}
              {active && !isGrowthLocked && !isStarterLocked && <ChevronRight size={15} className="ml-auto opacity-70" />}
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

      {/* Founder Direct Shortcut (Strictly Ameya Kshirsagar Only) */}
      {user.email?.toLowerCase() === "ameyakshirsagar@docodo.in" && (
        <div className="px-3 py-2 border-t border-[var(--border-subtle)]">
          <Link
            href="/founder"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[var(--lime)] bg-[var(--lime-ghost)] border border-[var(--lime)]/30 hover:bg-[var(--lime)]/20 transition-all"
          >
            <Sparkles size={14} />
            <span>Founder Suite (/founder)</span>
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
}

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; image?: string | null };
  businessName?: string;
  businessSlug?: string;
  plan?: string;
}

export default function DashboardLayoutClient({
  children,
  user,
  businessName,
  businessSlug,
  plan = "PILOT",
}: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-void)] flex flex-col lg:flex-row text-[var(--text-primary)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] fixed inset-y-0 left-0 z-30">
        <SidebarContent
          user={user}
          businessName={businessName}
          businessSlug={businessSlug}
          pathname={pathname}
          plan={plan}
        />
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
              <SidebarContent
                user={user}
                businessName={businessName}
                businessSlug={businessSlug}
                pathname={pathname}
                onClose={() => setSidebarOpen(false)}
              />
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
              className="lg:hidden p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-extrabold text-[var(--text-primary)] font-display">
                {NAV_ITEMS.find((item) =>
                  item.exact ? pathname === item.href : pathname.startsWith(item.href)
                )?.label ?? "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            {businessSlug && (
              <Link
                href={`/book/${businessSlug}`}
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--lime)] transition-colors shadow-sm"
              >
                <ExternalLink size={13} />
                <span>View Booking Page</span>
              </Link>
            )}

            {/* Notifications Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                    <span className="text-xs font-bold uppercase text-[var(--text-primary)]">System Alerts</span>
                    <span className="text-[10px] font-bold text-[var(--lime)] bg-[var(--lime-ghost)] px-2 py-0.5 rounded">All Clear</span>
                  </div>
                  <div className="py-3 text-xs text-[var(--text-secondary)] space-y-2">
                    <p className="text-[11px] text-[var(--text-muted)]">No active dispute alerts or server warnings.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[var(--bg-surface)]/95 backdrop-blur-lg border-t border-[var(--border-subtle)] z-30 px-2 py-1.5 flex items-center justify-around">
        {NAV_ITEMS.filter((item) => item.mobileNav).map((item) => {
          const Icon = item.icon;
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-bold transition-all min-w-[56px]",
                active
                  ? "text-[var(--lime)] bg-[var(--lime-ghost)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon size={18} className="mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
