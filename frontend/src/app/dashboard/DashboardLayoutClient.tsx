"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, Users, Globe, Sparkles,
  Settings, LogOut, Menu, X, ChevronRight, Bell, ExternalLink
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/website", label: "Website", icon: Globe },
  { href: "/dashboard/ai-content", label: "AI Content", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
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
      <div className="px-5 py-5 border-b border-[var(--border-subtle)]">
        <span className="text-xl font-black text-[var(--lime)] font-display">Docodo</span>
        {businessName && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{businessName}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-[var(--lime-ghost)] text-[var(--lime)] border border-[var(--lime)]/20"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              )}
            >
              <Icon size={17} />
              {item.label}
              {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
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
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-[var(--lime)] bg-[var(--lime-ghost)] hover:bg-[var(--lime)]/15 transition-colors"
          >
            <ExternalLink size={14} />
            View Booking Page
          </Link>
        </div>
      )}

      {/* User */}
      <div className="px-3 py-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-[var(--lime-ghost)] border border-[var(--lime)]/30 flex items-center justify-center text-xs font-bold text-[var(--lime)] shrink-0">
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
            <p className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] fixed inset-y-0 left-0 z-30">
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
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-60 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] flex flex-col lg:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[var(--bg-deep)] border-b border-[var(--border-subtle)] px-4 sm:px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1" />

          <button className="relative text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[var(--lime)] rounded-full" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
