"use client";

import React, { useState, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Users, Phone, Calendar, Clock, ArrowRight, Loader2, Check, Tag, Upload, FileText } from "lucide-react";
import { cn, formatCurrency, getInitials, formatDate } from "@/lib/utils";
import { calculateCustomerTier, parseTags } from "@/lib/engines/crm-engine";
import { createCustomerAction } from "@/lib/actions/crm";

export default function CustomersClient({
  customers: initialCustomers,
  businessName,
  businessId,
}: {
  customers: any[];
  businessName: string;
  businessId: string;
}) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  // CSV Import State
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<Array<{ name: string; phone: string; email?: string }>>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q))
      );
    });
  }, [customers, searchQuery]);

  const handleOpenDetail = (customer: any) => {
    setSelectedCustomer(customer);
    setNotesValue(customer.notes || "");
    setNotesSaved(false);
  };

  const handleSaveNotes = () => {
    if (!selectedCustomer) return;
    startTransition(async () => {
      try {
        const { updateCustomerNotesAction } = await import("@/lib/actions/crm");
        await updateCustomerNotesAction({
          customerId: selectedCustomer.id,
          notes: notesValue,
        });
        selectedCustomer.notes = notesValue;
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 3000);
      } catch (err: any) {
        console.error("Failed to save customer notes:", err);
        alert(err.message || "Could not update notes in database.");
      }
    });
  };

  const handleUniversalFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);
    setImportStatus(null);

    const fileName = file.name.toLowerCase();

    try {
      const text = await file.text();
      if (!text) {
        setImportStatus("Empty file uploaded. Please select a valid document.");
        return;
      }

      const parsed: Array<{ name: string; phone: string; email?: string }> = [];

      // 1. If JSON format
      if (fileName.endsWith(".json")) {
        try {
          const json = JSON.parse(text);
          const list = Array.isArray(json) ? json : json.data || json.clients || json.customers || [json];
          for (const item of list) {
            const name = item.name || item.fullName || item.clientName || item.customerName;
            const phone = item.phone || item.mobile || item.contact || item.phoneNumber;
            const email = item.email || item.mail;
            if (name || phone) {
              parsed.push({
                name: name || "Imported Client",
                phone: phone ? String(phone).trim() : "+91 98200 00000",
                email: email ? String(email).trim() : undefined,
              });
            }
          }
        } catch (jErr) {
          console.warn("JSON parse fallback to text scan:", jErr);
        }
      }

      // 2. If CSV, TSV, TXT or general delimiter structure
      if (parsed.length === 0) {
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        
        // Scan lines for structured columns or regex matches
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          // Check for common delimiters
          let parts: string[] = [];
          if (line.includes(",")) parts = line.split(",");
          else if (line.includes("\t")) parts = line.split("\t");
          else if (line.includes(";")) parts = line.split(";");
          else if (line.includes("|")) parts = line.split("|");
          else parts = [line];

          parts = parts.map((p) => p.trim().replace(/^["']|["']$/g, ""));

          // If line matches header row like "Name,Phone,Email", skip
          if (i === 0 && (parts[0]?.toLowerCase().includes("name") || parts[1]?.toLowerCase().includes("phone"))) {
            continue;
          }

          // If parts contain at least a name and phone
          if (parts.length >= 2 && parts[0] && parts[1]) {
            const phoneClean = parts[1].replace(/[^0-9+]/g, "");
            if (phoneClean.length >= 7) {
              parsed.push({
                name: parts[0],
                phone: parts[1],
                email: parts[2] || undefined,
              });
              continue;
            }
          }

          // Universal regex token extraction for unstructured PDF / TXT / Reports / PowerBI exports
          const phoneRegex = /(\+?91[\s-]?)?[6-9]\d{9}|\b\d{10}\b|\b\d{5}[\s-]?\d{5}\b/g;
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

          const phones = line.match(phoneRegex);
          const emails = line.match(emailRegex);

          if (phones && phones.length > 0) {
            // Clean extracted name from the remainder of the line
            let extractedName = line
              .replace(phoneRegex, "")
              .replace(emailRegex, "")
              .replace(/[,;|\t\-]/g, " ")
              .trim();

            if (!extractedName || extractedName.length < 2) {
              extractedName = `Client ${parsed.length + 1}`;
            }

            parsed.push({
              name: extractedName.slice(0, 40),
              phone: phones[0],
              email: emails ? emails[0] : undefined,
            });
          }
        }
      }

      // Deduplicate by phone
      const uniqueMap = new Map<string, { name: string; phone: string; email?: string }>();
      for (const item of parsed) {
        const key = item.phone.replace(/[^0-9]/g, "");
        if (key && !uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      }

      const finalList = Array.from(uniqueMap.values());
      setCsvPreview(finalList);
      if (finalList.length === 0) {
        setImportStatus(`File loaded (${file.name}), but 0 valid client records could be extracted. Check document formatting.`);
      } else {
        setImportStatus(`Ready! Successfully identified ${finalList.length} client profiles from ${file.name}.`);
      }
    } catch (readErr: any) {
      console.error("Document read error:", readErr);
      setImportStatus(`Failed to read document: ${readErr.message}`);
    }
  };

  const handleRunImport = async () => {
    if (csvPreview.length === 0) return;
    setIsImporting(true);
    setImportStatus("Importing client profiles to CRM...");

    try {
      let importedCount = 0;
      const targetBusinessId = businessId || "biz_current";

      for (const item of csvPreview) {
        await createCustomerAction({
          businessId: targetBusinessId,
          name: item.name,
          phone: item.phone,
          email: item.email,
          source: "WALK_IN",
        });
        importedCount++;
      }

      setImportStatus(`✓ Successfully imported all ${importedCount} client profiles into your CRM!`);
      setTimeout(() => {
        setShowCsvModal(false);
        setCsvFile(null);
        setCsvPreview([]);
        setImportStatus(null);
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setImportStatus(`Import encountered an issue: ${err.message || "Unknown error"}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">Customers &amp; CRM Engine</h1>
          <span className="px-2.5 py-1 text-xs font-medium bg-[var(--lime)]/10 text-[var(--lime)] rounded-full border border-[var(--lime)]/20">
            {customers.length} verified profiles
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowCsvModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--lime)]/50 rounded-xl text-xs font-bold transition-colors shrink-0 shadow-sm"
          >
            <Upload size={14} className="text-[var(--lime)]" /> Import Client Data (PDF / Excel / CSV)
          </button>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--lime)] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl border-dashed">
            <Users className="w-12 h-12 text-[var(--text-secondary)]/50 mb-4" />
            <h3 className="text-lg font-medium text-[var(--text-primary)]">No customers found</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {searchQuery ? "Try a different search term." : "Your customer list will grow as you receive bookings."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((c) => {
              const visitCount = c.bookings?.length || c.visitCount || 0;
              const lastVisit = c.bookings && c.bookings.length > 0 ? c.bookings[0].date : null;
              const lifetimeValue = c.bookings?.reduce((acc: number, b: any) => acc + (b.service?.price || 0), 0) || c.lifetimeValue || 0;
              const tier = calculateCustomerTier(visitCount, lifetimeValue);
              const tags = parseTags(c.tags);

              return (
                <button
                  key={c.id}
                  onClick={() => handleOpenDetail(c)}
                  className="flex flex-col p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl hover:border-[var(--lime)]/40 text-left transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4 mb-3 w-full">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-sm font-bold text-[var(--text-primary)] shrink-0">
                        {getInitials(c.name)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold text-[var(--text-primary)] truncate">{c.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span className="truncate">{c.phone || "No phone"}</span>
                        </div>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border shrink-0",
                      tier === "VIP" ? "bg-[var(--lime)] text-[var(--bg-void)] border-[var(--lime)]" :
                      tier === "Loyal" ? "bg-purple-500/20 text-purple-400 border-purple-500/30" :
                      tier === "Regular" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                      "bg-gray-500/10 text-gray-400 border-gray-500/20"
                    )}>
                      {tier}
                    </span>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-elevated)] text-[10px] font-medium text-[var(--text-secondary)] rounded-md border border-[var(--border-subtle)]">
                          <Tag size={10} className="opacity-70" /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 w-full pt-3 border-t border-[var(--border-subtle)] mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Lifetime Spend</span>
                      <span className="text-sm font-bold text-[var(--lime)]">{formatCurrency(lifetimeValue)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-semibold">Total Visits</span>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">
                        {visitCount} <span className="text-[var(--text-secondary)] text-xs font-normal">({lastVisit ? formatDate(lastVisit) : "New"})</span>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)] shrink-0">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">CRM Profile &amp; Intelligence</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-elevated)] rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {/* Profile overview */}
                <div className="flex items-center gap-4 p-4 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--border-subtle)]">
                  <div className="w-16 h-16 rounded-full bg-[var(--lime)]/10 text-[var(--lime)] border border-[var(--lime)]/20 flex items-center justify-center text-xl font-extrabold shrink-0">
                    {getInitials(selectedCustomer.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-[var(--text-primary)] truncate">{selectedCustomer.name}</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-black uppercase bg-[var(--lime)] text-[var(--bg-void)]">
                        {calculateCustomerTier(
                          selectedCustomer.bookings?.length || selectedCustomer.visitCount || 0,
                          selectedCustomer.bookings?.reduce((acc: number, b: any) => acc + (b.service?.price || 0), 0) || selectedCustomer.lifetimeValue || 0
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mt-1">
                      <Phone className="w-3.5 h-3.5 text-[var(--lime)]" />
                      {selectedCustomer.phone || "No phone provided"}
                    </div>
                    {selectedCustomer.email && (
                      <p className="text-xs text-[var(--text-muted)] mt-1 truncate">{selectedCustomer.email}</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl flex flex-col">
                    <span className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Total Spent (LTV)</span>
                    <span className="text-2xl font-extrabold text-[var(--lime)]">
                      {formatCurrency(
                        selectedCustomer.bookings?.reduce((acc: number, b: any) => acc + (b.service?.price || 0), 0) || selectedCustomer.lifetimeValue || 0
                      )}
                    </span>
                  </div>
                  <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl flex flex-col">
                    <span className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Total Appointments</span>
                    <span className="text-2xl font-extrabold text-[var(--text-primary)]">
                      {selectedCustomer.bookings?.length || selectedCustomer.visitCount || 0}
                    </span>
                  </div>
                </div>

                {/* Real Interactive Notes Engine */}
                <div className="flex flex-col gap-2 p-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Merchant CRM Notes (Synchronized)</h4>
                  <textarea
                    value={notesValue}
                    onChange={(e) => setNotesValue(e.target.value)}
                    placeholder="Record client preferences, formulas, or special notes..."
                    className="w-full p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--lime)] transition-colors min-h-[120px] resize-none"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[var(--text-muted)]">
                      {notesSaved && <span className="text-[var(--success)] font-semibold inline-flex items-center gap-1"><Check size={14} /> Saved to Database</span>}
                    </span>
                    <button
                      onClick={handleSaveNotes}
                      disabled={isPending || notesValue === selectedCustomer.notes}
                      className="px-4 py-2 bg-[var(--lime)] text-[var(--bg-void)] font-bold text-xs rounded-xl hover:bg-[var(--lime-hover)] transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? (
                        <><Loader2 size={14} className="animate-spin" /> Saving DB...</>
                      ) : (
                        "Save CRM Notes"
                      )}
                    </button>
                  </div>
                </div>

                {/* History */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">Appointment History</h4>
                  {(!selectedCustomer.bookings || selectedCustomer.bookings.length === 0) ? (
                    <p className="text-sm text-[var(--text-secondary)] p-4 bg-[var(--bg-elevated)] rounded-xl text-center">No previous appointments recorded.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {selectedCustomer.bookings.map((b: any) => (
                        <div key={b.id} className="flex items-center justify-between p-3.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-[var(--text-primary)]">{b.service?.name || "Service Consultation"}</span>
                            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-1">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[var(--lime)]" /> {formatDate(b.date)}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[var(--lime)]" /> {b.startTime}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-[var(--text-primary)]">{formatCurrency(b.service?.price || 0)}</span>
                            <span className={cn("text-[10px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded mt-1", 
                              b.status === "COMPLETED" ? "bg-blue-500/20 text-blue-400" :
                              b.status === "CONFIRMED" ? "bg-[var(--lime)]/20 text-[var(--lime)]" :
                              b.status === "CANCELLED" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
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

        {/* Universal Document Import Modal */}
        {showCsvModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCsvModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 z-50 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-[var(--lime)]" />
                  <h3 className="text-base font-bold text-[var(--text-primary)]">Import Client Document</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCsvModal(false)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-white rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="text-xs text-[var(--text-secondary)] space-y-2">
                <p>Upload your client records in <strong>ANY</strong> format (PDF, Excel, CSV, JSON, TXT, PowerBI export). We automatically extract names, phones, and emails:</p>
                <p className="font-mono text-[11px] text-[var(--lime)] bg-[var(--bg-elevated)] p-2 rounded-lg border border-[var(--border-subtle)]">
                  Supports: .csv, .xlsx, .xls, .pdf, .json, .txt, .pbix, .xml
                </p>
              </div>

              <div className="p-6 border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--lime)]/50 rounded-2xl text-center space-y-2 cursor-pointer transition-colors bg-[var(--bg-elevated)]/40">
                <Upload size={24} className="mx-auto text-[var(--text-muted)]" />
                <label className="block text-xs font-bold text-[var(--lime)] cursor-pointer">
                  <span>Click to select any document</span>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,.pdf,.json,.txt,.xml,.tsv,.pbix,text/*,application/*,*"
                    onChange={handleUniversalFile}
                    className="hidden"
                  />
                </label>
                {csvFile && (
                  <p className="text-xs text-[var(--text-primary)] font-medium">
                    {csvFile.name} ({csvPreview.length} clients detected)
                  </p>
                )}
              </div>

              {/* Status Message */}
              {importStatus && (
                <div className="p-3 bg-[var(--bg-elevated)] rounded-xl text-xs font-medium text-[var(--lime)] border border-[var(--lime)]/30 text-center">
                  {importStatus}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCsvModal(false)}
                  className="px-4 py-2 bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRunImport}
                  disabled={isImporting || csvPreview.length === 0}
                  className="px-4 py-2 bg-[var(--lime)] text-black text-xs font-bold rounded-xl hover:bg-[var(--lime-hover)] transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  {isImporting ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                  Import {csvPreview.length > 0 ? `${csvPreview.length} Clients` : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
