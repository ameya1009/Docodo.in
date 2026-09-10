"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, Calendar, MessageSquare, CheckCircle2, Clock, ArrowRight, Phone, Check, RefreshCw } from "lucide-react";
import { updateBookingStatus } from "@/lib/actions/dashboard";

interface ActionCenterProps {
  business: {
    id: string;
    name: string;
    slug: string;
  };
  bookings: Array<{
    id: string;
    customerName: string;
    customerPhone: string;
    status: string;
    date: string;
    startTime: string;
    service?: { name: string; price: number };
  }>;
  enquiries: Array<{
    id: string;
    name: string;
    phone: string;
    message?: string | null;
    status: string;
    serviceName?: string | null;
    createdAt?: any;
  }>;
}

export function ActionCenter({ business, bookings, enquiries }: ActionCenterProps) {
  const [isPending, startTransition] = useTransition();
  const [localBookings, setLocalBookings] = useState(bookings);

  // Filter for items needing attention:
  // 1. Bookings in PENDING status
  const pendingBookings = localBookings.filter((b) => b.status === "PENDING");

  // 2. Enquiries in NEW status
  const newEnquiries = enquiries.filter((e) => e.status === "NEW" || e.status === "UNREAD");

  const totalActions = pendingBookings.length + newEnquiries.length;

  const handleConfirm = (bookingId: string) => {
    setLocalBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "CONFIRMED" } : b))
    );
    startTransition(async () => {
      try {
        await updateBookingStatus(bookingId, "CONFIRMED");
      } catch (err) {
        console.error("Failed to confirm booking:", err);
      }
    });
  };

  return (
    <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-[var(--text-primary)] font-display flex items-center gap-2">
              Action Center
              {totalActions > 0 ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold font-mono">
                  {totalActions} Needs Attention
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                  All Clear ✓
                </span>
              )}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Appointments and client enquiries that require quick staff action today.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/bookings"
          className="text-xs font-bold text-[var(--lime)] hover:underline flex items-center gap-1 shrink-0"
        >
          View Bookings Calendar <ArrowRight size={13} />
        </Link>
      </div>

      {totalActions === 0 ? (
        <div className="py-6 px-4 text-center rounded-2xl bg-[var(--bg-elevated)]/50 border border-[var(--border-subtle)] space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-sm font-bold text-[var(--text-primary)]">You&apos;re All Caught Up!</p>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
            No pending bookings or unread customer leads waiting for your review right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pending Bookings Column */}
          {pendingBookings.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Clock size={12} /> Pending Bookings ({pendingBookings.length})
              </span>
              <div className="space-y-2">
                {pendingBookings.slice(0, 3).map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-amber-500/20 flex items-center justify-between gap-3 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-[var(--text-primary)] truncate">{b.customerName}</p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {b.service?.name || "Service"} · {b.date} at {b.startTime}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleConfirm(b.id)}
                      disabled={isPending}
                      className="px-3 py-1.5 bg-[var(--lime)] text-black font-bold text-xs rounded-xl hover:bg-[var(--lime-hover)] transition-colors flex items-center gap-1 shrink-0 shadow-sm"
                    >
                      <Check size={13} /> Confirm
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unread Customer Leads Column */}
          {newEnquiries.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <MessageSquare size={12} /> New Enquiries ({newEnquiries.length})
              </span>
              <div className="space-y-2">
                {newEnquiries.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-purple-500/20 flex items-center justify-between gap-3 hover:border-purple-500/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-[var(--text-primary)] truncate">{e.name}</p>
                      {e.message ? (
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5 italic truncate">
                          &ldquo;{e.message}&rdquo;
                        </p>
                      ) : (
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Interested in {e.serviceName || "services"}</p>
                      )}
                    </div>
                    <a
                      href={`https://wa.me/${e.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hi ${e.name}, this is ${business.name}. How can we assist you today?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <MessageSquare size={13} /> Reply
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
