"use client";

import React, { useState } from "react";
import { PersonalizedOutreachDraft } from "@/lib/growth-os/campaigns/pune_clinics_100";
import { dispatchPuneClinicsBatchAction, BatchDispatchResult } from "@/lib/actions/growth-os/dispatch-campaign";

interface Props {
  initialDrafts: PersonalizedOutreachDraft[];
}

export default function PuneClinicsClient({ initialDrafts }: Props) {
  const [drafts, setDrafts] = useState<PersonalizedOutreachDraft[]>(initialDrafts);
  const [selectedDraft, setSelectedDraft] = useState<PersonalizedOutreachDraft | null>(null);
  const [activeTab, setActiveTab] = useState<"whatsapp" | "email" | "linkedin">("whatsapp");
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<BatchDispatchResult | null>(null);
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const specialties = Array.from(new Set(drafts.map((d) => d.specialty)));

  const filteredDrafts = drafts.filter((d) => {
    if (filterSpecialty === "all") return true;
    return d.specialty === filterSpecialty;
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleBatchDispatch = async () => {
    setIsDispatching(true);
    setDispatchResult(null);
    try {
      const res = await dispatchPuneClinicsBatchAction(20, []);
      setDispatchResult(res);
      // Update local status of first 20
      setDrafts((prev) =>
        prev.map((d, i) => (i < 20 ? { ...d, status: "SENT" as const } : d))
      );
    } catch (err) {
      console.error("Batch dispatch error:", err);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PUNE CLINICS B2B CAMPAIGN
            </span>
            <span className="text-xs text-slate-400">100 / 100 Verified Leads Ingested</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Pune Clinics Lead Generation & Multi-Channel Outreach
          </h1>
          <p className="text-sm text-slate-400">
            Personalized Email, WhatsApp, and LinkedIn campaigns tailored to each clinic's digital stack and medical specialty.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBatchDispatch}
            disabled={isDispatching}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-emerald-900/30 flex items-center gap-2"
          >
            {isDispatching ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Dispatching Batch...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Dispatch Batch (20 Clinics / Day)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dispatch Success Alert */}
      {dispatchResult && (
        <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Batch Dispatched Successfully!
            </p>
            <p className="text-xs text-emerald-400/80 mt-0.5">
              Dispatched {dispatchResult.emailsDispatched} emails and {dispatchResult.whatsappDispatched} WhatsApp pitches across {dispatchResult.totalProcessed} Pune clinics.
            </p>
          </div>
          <button
            onClick={() => setDispatchResult(null)}
            className="text-xs text-emerald-400 hover:text-emerald-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Total Leads Ingested</p>
          <p className="text-2xl font-bold text-white mt-1">{drafts.length}</p>
          <span className="text-xs text-emerald-400">Across 10 Pune micro-markets</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Ready Channels</p>
          <p className="text-2xl font-bold text-white mt-1">3 Channels</p>
          <span className="text-xs text-blue-400">Email + WhatsApp + LinkedIn</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Specialty Categories</p>
          <p className="text-2xl font-bold text-white mt-1">{specialties.length} Specialties</p>
          <span className="text-xs text-purple-400">Derm, Peds, Ortho, Gyn, Polyclinic, Dental</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Dispatched Today</p>
          <p className="text-2xl font-bold text-white mt-1">
            {drafts.filter((d) => d.status === "SENT").length}
          </p>
          <span className="text-xs text-emerald-400">Rate-limit safe (max 20/day)</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filter Specialty:</label>
        <select
          value={filterSpecialty}
          onChange={(e) => setFilterSpecialty(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Specialties ({drafts.length})</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>
              {spec} ({drafts.filter((d) => d.specialty === spec).length})
            </option>
          ))}
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Lead Directory & Personalized Pitch Matrix</h2>
          <span className="text-xs text-slate-400">Showing {filteredDrafts.length} clinics</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Clinic & Doctor</th>
                <th className="p-3">Locality</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Specialty & Solution Match</th>
                <th className="p-3">Deal Offer</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDrafts.map((draft) => (
                <tr key={draft.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono text-slate-400">{draft.id}</td>
                  <td className="p-3">
                    <p className="font-semibold text-white">{draft.clinicName}</p>
                    <p className="text-[11px] text-emerald-400">{draft.doctor}</p>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-medium">
                      {draft.locality}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px]">
                    <p className="text-slate-300">{draft.phone}</p>
                    <p className="text-slate-500">{draft.email}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-slate-200">{draft.specialty}</p>
                    <p className="text-[11px] text-blue-400">{draft.matchedPackage}</p>
                  </td>
                  <td className="p-3">
                    <span className="text-[11px] text-amber-300/90 font-medium">
                      {draft.customDeal}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        draft.status === "SENT"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {draft.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedDraft(draft)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition font-medium"
                    >
                      Preview Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Slide-Over for Previewing Pitch Copy */}
      {selectedDraft && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Personalized Outreach Asset
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedDraft.clinicName}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedDraft.doctor} • {selectedDraft.locality} • {selectedDraft.specialty}
                </p>
              </div>
              <button
                onClick={() => setSelectedDraft(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Channel Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab("whatsapp")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "whatsapp"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                WhatsApp Message
              </button>
              <button
                onClick={() => setActiveTab("email")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "email"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                Email Pitch
              </button>
              <button
                onClick={() => setActiveTab("linkedin")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === "linkedin"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                LinkedIn Direct
              </button>
            </div>

            {/* Content Preview Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {activeTab === "whatsapp" && selectedDraft.whatsappMessage}
              {activeTab === "email" && (
                <>
                  <span className="text-slate-500 font-bold block mb-2">Subject: {selectedDraft.emailSubject}</span>
                  {selectedDraft.emailBody}
                </>
              )}
              {activeTab === "linkedin" && selectedDraft.linkedinMessage}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">
                Recipient: {activeTab === "email" ? selectedDraft.email : selectedDraft.phone}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleCopy(
                      activeTab === "whatsapp"
                        ? selectedDraft.whatsappMessage
                        : activeTab === "email"
                        ? `Subject: ${selectedDraft.emailSubject}\n\n${selectedDraft.emailBody}`
                        : selectedDraft.linkedinMessage,
                      "modal_copy"
                    )
                  }
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
                >
                  {copiedKey === "modal_copy" ? "✓ Copied!" : "Copy Pitch"}
                </button>
                <a
                  href={
                    activeTab === "whatsapp"
                      ? `https://wa.me/${selectedDraft.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          selectedDraft.whatsappMessage
                        )}`
                      : `mailto:${selectedDraft.email}?subject=${encodeURIComponent(
                          selectedDraft.emailSubject
                        )}&body=${encodeURIComponent(selectedDraft.emailBody)}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
                >
                  Open in {activeTab === "whatsapp" ? "WhatsApp Web" : "Email Client"} ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
