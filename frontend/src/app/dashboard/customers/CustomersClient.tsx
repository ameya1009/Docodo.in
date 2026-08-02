"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Users, Phone, Calendar, Clock, ArrowRight } from "lucide-react";
import { cn, formatCurrency, getInitials, formatDate } from "@/lib/utils";

export default function CustomersClient({ customers, businessName }: { customers: any[]; businessName: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q))
      );
    });
  }, [customers, searchQuery]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Customers</h1>
          <span className="px-2.5 py-1 text-xs font-medium bg-lime/10 text-lime rounded-full border border-lime/20">
            {customers.length} total
          </span>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-bg-surface border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-lime transition-colors"
          />
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20 bg-bg-surface border border-border-subtle rounded-2xl border-dashed">
            <Users className="w-12 h-12 text-text-secondary/50 mb-4" />
            <h3 className="text-lg font-medium text-text-primary">No customers found</h3>
            <p className="text-sm text-text-secondary mt-1">
              {searchQuery ? "Try a different search term." : "Your customer list will grow as you receive bookings."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((c) => {
              const visitCount = c.bookings?.length || 0;
              const lastVisit = visitCount > 0 ? c.bookings[0].date : null;
              const lifetimeValue = c.bookings?.reduce((acc: number, b: any) => acc + (b.service?.price || 0), 0) || 0;

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className="flex flex-col p-5 bg-bg-surface border border-border-subtle rounded-2xl hover:border-lime/30 text-left transition-all group"
                >
                  <div className="flex items-start gap-4 mb-4 w-full">
                    <div className="w-12 h-12 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-sm font-semibold text-text-primary shrink-0">
                      {getInitials(c.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-text-primary truncate">{c.name}</h4>
                      <div className="flex items-center gap-1.5 text-sm text-text-secondary mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span className="truncate">{c.phone || "No phone"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-border-subtle mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-text-secondary font-medium">LTV</span>
                      <span className="text-sm font-semibold text-lime">{formatCurrency(lifetimeValue)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-text-secondary font-medium">Visits</span>
                      <span className="text-sm font-medium text-text-primary">
                        {visitCount} <span className="text-text-secondary text-xs font-normal">({lastVisit ? formatDate(lastVisit) : "Never"})</span>
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-bg-surface border-l border-border-subtle z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-subtle shrink-0">
                <h2 className="text-lg font-semibold text-text-primary">Customer Details</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 text-text-secondary hover:text-text-primary bg-bg-elevated rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                {/* Profile overview */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-lime/10 text-lime border border-lime/20 flex items-center justify-center text-xl font-bold shrink-0">
                    {getInitials(selectedCustomer.name)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">{selectedCustomer.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-text-secondary mt-1">
                      <Phone className="w-3.5 h-3.5" />
                      {selectedCustomer.phone || "No phone provided"}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-bg-elevated border border-border-subtle rounded-2xl flex flex-col">
                    <span className="text-xs text-text-secondary mb-1">Total Spent</span>
                    <span className="text-xl font-semibold text-lime">
                      {formatCurrency(
                        selectedCustomer.bookings?.reduce((acc: number, b: any) => acc + (b.service?.price || 0), 0) || 0
                      )}
                    </span>
                  </div>
                  <div className="p-4 bg-bg-elevated border border-border-subtle rounded-2xl flex flex-col">
                    <span className="text-xs text-text-secondary mb-1">Total Visits</span>
                    <span className="text-xl font-semibold text-text-primary">
                      {selectedCustomer.bookings?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-medium text-text-primary">Internal Notes</h4>
                  <textarea
                    defaultValue={selectedCustomer.notes || ""}
                    placeholder="Add notes about this customer..."
                    className="w-full p-3 bg-bg-elevated border border-border-subtle rounded-xl text-sm text-text-primary focus:outline-none focus:border-lime transition-colors min-h-[100px] resize-none"
                  />
                  <div className="flex justify-end">
                    <button className="text-xs font-medium text-lime hover:text-[#bbf04b]">Save Notes</button>
                  </div>
                </div>

                {/* History */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-medium text-text-primary">Recent Visits</h4>
                  {(!selectedCustomer.bookings || selectedCustomer.bookings.length === 0) ? (
                    <p className="text-sm text-text-secondary">No visits recorded.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {selectedCustomer.bookings.map((b: any) => (
                        <div key={b.id} className="flex items-center justify-between p-3 bg-bg-elevated border border-border-subtle rounded-xl">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-text-primary">{b.service?.name || "Service"}</span>
                            <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(b.date)}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.startTime}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-text-primary">{formatCurrency(b.service?.price || 0)}</span>
                            <span className={cn("text-[10px] font-bold tracking-wider uppercase mt-1", 
                              b.status === "COMPLETED" ? "text-blue-500" :
                              b.status === "CONFIRMED" ? "text-lime" :
                              b.status === "CANCELLED" ? "text-red-500" : "text-amber-500"
                            )}>
                              {b.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
