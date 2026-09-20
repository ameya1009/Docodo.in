"use client";

import React, { useState } from "react";
import { CheckSquare, ShieldCheck, XCircle, CheckCircle2, Clock } from "lucide-react";

export default function ApprovalsPage() {
  const [items, setItems] = useState([
    {
      id: "appr_1",
      type: "OUTREACH",
      title: "WhatsApp Outreach to Velvet Scissor Unisex Salon (+919822099881)",
      description: "Personalized pitch referencing manual DM delay bottleneck and offering 24/7 AI Receptionist demo.",
      status: "PENDING",
    },
    {
      id: "appr_2",
      type: "AD_CAMPAIGN",
      title: "Meta Ads Campaign: 'Pune Salons & Aesthetic Clinics' (Budget: ₹500/day)",
      description: "Targeted feed and stories ads for local salon owners with link to Docodo WhatsApp demo.",
      status: "PENDING",
    },
    {
      id: "appr_3",
      type: "SOCIAL_POST",
      title: "LinkedIn Carousel: 'Why 78% of Salon Inquiries Never Book'",
      description: "5-slide carousel scheduled for Monday 10:00 AM.",
      status: "APPROVED",
    },
  ]);

  const handleAction = (id: string, action: "APPROVED" | "REJECTED") => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: action } : it))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Centralized Governance & Approvals</h1>
          <p className="text-xs text-slate-400">
            Mandatory human review gate for all outbound communications, scheduled posts, and ad expenditures.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.id} className="p-6 rounded-xl bg-[#111622] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-white/10 text-slate-300 text-xs font-bold">
                {it.type}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  it.status === "APPROVED"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : it.status === "REJECTED"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {it.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-white">{it.title}</h3>
              <p className="text-xs text-slate-300 pt-1">{it.description}</p>
            </div>

            {it.status === "PENDING" && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleAction(it.id, "APPROVED")}
                  className="h-9 px-4 rounded-lg bg-lime-400 text-black font-semibold text-xs hover:bg-lime-300 transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve & Authorize</span>
                </button>
                <button
                  onClick={() => handleAction(it.id, "REJECTED")}
                  className="h-9 px-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-red-500/20"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject Action</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
