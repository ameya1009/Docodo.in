"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar, Users, TrendingUp, Globe, ArrowRight, Clock,
  CheckCircle2, AlertCircle, Sparkles, Copy, ExternalLink
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface DashboardHomeProps {
  data: any;
}

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30",
  PENDING: "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30",
  COMPLETED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  CANCELLED: "bg-[var(--danger)]/15 text-[var(--danger)] border-[var(--danger)]/30",
  NO_SHOW: "bg-[var(--text-muted)]/15 text-[var(--text-muted)] border-[var(--text-muted)]/30",
};

export default function DashboardHome({ data }: DashboardHomeProps) {
  const { business, stats, upcomingBookings } = data;
  const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://docodo.in"}/book/${business.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingUrl);
  };

  const STAT_CARDS = [
    {
      label: "Today's Bookings",
      value: stats.todayBookings,
      icon: Calendar,
      color: "text-[var(--lime)]",
      bg: "bg-[var(--lime-ghost)]",
      href: "/dashboard/bookings",
    },
    {
      label: "Revenue This Month",
      value: formatCurrency(stats.monthlyRevenue),
      icon: TrendingUp,
      color: "text-[var(--success)]",
      bg: "bg-[var(--success)]/10",
      href: "/dashboard/bookings",
    },
    {
      label: "Total Customers",
      value: stats.customers,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      href: "/dashboard/customers",
    },
    {
      label: "Services",
      value: business.services?.length ?? 0,
      icon: Globe,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      href: "/dashboard/settings",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            Good {getGreeting()}, {data.business.name} 👋
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--lime)] text-[var(--bg-void)] font-bold text-sm rounded-xl hover:bg-[var(--lime-hover)] transition-colors shrink-0"
        >
          <Calendar size={15} /> New Booking
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={card.href}
                className="block p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl hover:border-[var(--border-default)] transition-all group"
              >
                <div className={`inline-flex p-2.5 rounded-xl ${card.bg} mb-4`}>
                  <Icon size={18} className={card.color} />
                </div>
                <div className="text-2xl font-black text-[var(--text-primary)] mb-1">{card.value}</div>
                <div className="text-xs text-[var(--text-muted)] font-medium flex items-center gap-1">
                  {card.label}
                  <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
            <h2 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Calendar size={16} className="text-[var(--lime)]" />
              Upcoming Bookings
            </h2>
            <Link href="/dashboard/bookings" className="text-xs text-[var(--lime)] hover:underline font-semibold">
              View all
            </Link>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            {upcomingBookings.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Calendar size={32} className="mx-auto mb-3 text-[var(--text-disabled)]" />
                <p className="text-sm text-[var(--text-muted)] mb-4">No upcoming bookings yet</p>
                <Link href={`/book/${business.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-xs text-[var(--lime)] font-semibold hover:underline">
                  Share your booking link <ExternalLink size={12} />
                </Link>
              </div>
            ) : (
              upcomingBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--bg-elevated)] transition-colors">
                  <div className="text-center min-w-[40px]">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase">
                      {new Date(booking.date).toLocaleDateString("en-IN", { month: "short" })}
                    </div>
                    <div className="text-xl font-black text-[var(--text-primary)] leading-none">
                      {new Date(booking.date).getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{booking.customerName}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {booking.service?.name ?? "Booking"} · {booking.startTime}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLES[booking.status] ?? ""}`}>
                    {booking.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Booking Link */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1 flex items-center gap-2">
              <Globe size={15} className="text-[var(--lime)]" /> Your Booking Link
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">Share this to receive bookings</p>
            <div className="flex items-center gap-2 p-2 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-default)]">
              <span className="text-xs text-[var(--text-secondary)] truncate flex-1 font-mono">
                {bookingUrl.replace("https://", "")}
              </span>
              <button onClick={handleCopy} className="shrink-0 p-1.5 text-[var(--text-muted)] hover:text-[var(--lime)] transition-colors">
                <Copy size={14} />
              </button>
            </div>
            <Link href={`/book/${business.slug}`} target="_blank" className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[var(--lime)] border border-[var(--lime)]/30 rounded-lg hover:bg-[var(--lime-ghost)] transition-colors">
              <ExternalLink size={13} /> Preview Page
            </Link>
          </div>

          {/* AI Suggestions */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5">
            <h3 className="font-bold text-sm text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <Sparkles size={15} className="text-[var(--lime)]" /> AI Suggestions
            </h3>
            <div className="space-y-2.5">
              {[
                { text: "Post on Instagram — it's been 7 days", href: "/dashboard/ai-content" },
                { text: "Send a WhatsApp reminder to 3 pending customers", href: "/dashboard/customers" },
                { text: "Add your working hours for Sunday", href: "/dashboard/settings" },
              ].map((s, i) => (
                <Link key={i} href={s.href} className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] hover:text-[var(--lime)] transition-colors group">
                  <AlertCircle size={13} className="text-[var(--warning)] mt-0.5 shrink-0" />
                  <span className="group-hover:underline">{s.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
