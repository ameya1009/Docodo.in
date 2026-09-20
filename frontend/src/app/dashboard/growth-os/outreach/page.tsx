"use client";

import React, { useState } from "react";
import { Send, ShieldAlert, CheckCircle2, MessageSquare, Mail, AlertTriangle } from "lucide-react";
import { outreachAgent } from "../../../../lib/growth-os/agents/OutreachAgent";

export default function OutreachDashboardPage() {
  const [drafts, setDrafts] = useState(() => {
    const sampleLead = {
      id: "lead_101",
      canonicalName: "Aura Luxury Spa & Salon",
      city: "Pune",
      country: "IN",
      normalizedPhone: "+919822011223",
      normalizedDomain: "auraspapune.com",
      icpScore: 90,
      crmStage: "qualified" as const,
      confidenceScore: 0.95,
      primarySource: "google_places" as const,
      identities: [],
      opportunities: [
        {
          id: "opp_1",
          problem: "Missing automated WhatsApp booking receptionist",
          evidence: "Inquiries after 8 PM wait until next morning for appointment confirmation.",
          source: "whatsapp" as const,
          recommendedSolution: "Deploy 24/7 AI Receptionist",
          recommendedProduct: "WhatsApp AI Receptionist" as const,
          confidence: 0.94,
          status: "OPEN" as const,
        },
      ],
      scoreBreakdown: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return [
      outreachAgent.generatePersonalizedDraft(sampleLead, "whatsapp", "APPROVAL_REQUIRED"),
      outreachAgent.generatePersonalizedDraft(sampleLead, "email", "APPROVAL_REQUIRED"),
      outreachAgent.generatePersonalizedDraft(sampleLead, "instagram_dm", "APPROVAL_REQUIRED"),
    ];
  });

  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [dispatchStatus, setDispatchStatus] = useState<Record<string, string>>({});

  const handleApprove = (id: string) => {
    outreachAgent.approveDraft(id);
    setApprovedIds((prev) => [...prev, id]);
  };

  const handleDispatch = async (id: string) => {
    const res = await outreachAgent.dispatchOutreach(id);
    setDispatchStatus((prev) => ({
      ...prev,
      [id]: res.success ? "SENT" : `BLOCKED: ${res.error}`,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Omnichannel Outreach Dispatcher</h1>
          <p className="text-xs text-slate-400">
            Personalized, research-backed outreach drafts with mandatory human safety gates and opt-out suppression.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {drafts.map((draft) => {
          const isApproved = approvedIds.includes(draft.id);
          const status = dispatchStatus[draft.id];

          return (
            <div key={draft.id} className="p-6 rounded-xl bg-[#111622] border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-lime-400/10 text-lime-400 text-xs font-bold uppercase">
                    {draft.channel.replace("_", " ")}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-white">{draft.businessName}</h3>
                    <p className="text-xs text-slate-400">Recipient: {draft.recipient}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isApproved
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {isApproved ? "Approved by User" : "Pending Human Approval"}
                  </span>
                </div>
              </div>

              {/* Citations Box */}
              {draft.evidenceCitations.length > 0 && (
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-lime-400">Verified Business Evidence Cited:</div>
                  {draft.evidenceCitations.map((c, i) => (
                    <div key={i}>&bull; {c}</div>
                  ))}
                </div>
              )}

              {/* Body Box */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-slate-200 whitespace-pre-line font-sans">
                {draft.subject && <div className="font-bold text-white mb-2">Subject: {draft.subject}</div>}
                {draft.body}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-500">
                  Mode: <span className="font-mono text-slate-300">{draft.mode}</span> &bull; Opt-out Footer Included
                </div>

                <div className="flex items-center gap-2">
                  {!isApproved ? (
                    <button
                      onClick={() => handleApprove(draft.id)}
                      className="h-9 px-4 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Approve Outbound Draft</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDispatch(draft.id)}
                      className="h-9 px-4 rounded-lg bg-lime-400 text-black hover:bg-lime-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Send className="h-4 w-4" />
                      <span>Dispatch Now</span>
                    </button>
                  )}
                </div>
              </div>

              {status && (
                <div
                  className={`p-3 rounded-lg text-xs font-mono ${
                    status === "SENT"
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                      : "bg-red-500/10 text-red-300 border border-red-500/30"
                  }`}
                >
                  Status: {status}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
