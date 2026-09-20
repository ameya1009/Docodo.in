"use client";

import React, { useState } from "react";
import { Megaphone, ShieldCheck, AlertCircle, Play, Pause, TrendingUp } from "lucide-react";
import { adsAgent, ManagedCampaign } from "../../../../lib/growth-os/agents/AdsAgent";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<ManagedCampaign[]>(() => {
    return [
      adsAgent.createCampaignDraft("meta_ads", "LEAD_GENERATION", "Salons & Spas", "Pune", 500),
      adsAgent.createCampaignDraft("google_ads", "CONVERSIONS", "Aesthetic Clinics", "Pune", 800),
    ];
  });

  const [alerts, setAlerts] = useState<string[]>([]);

  const handleApprove = (id: string) => {
    adsAgent.approveCampaign(id);
    setCampaigns([...adsAgent.getCampaigns()]);
  };

  const handleLaunch = async (id: string) => {
    const res = await adsAgent.launchCampaign(id);
    if (!res.success) {
      setAlerts((prev) => [...prev, `Campaign ${id} Launch Failed: ${res.error}`]);
    } else {
      setCampaigns([...adsAgent.getCampaigns()]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Paid Acquisition Engine</h1>
          <p className="text-xs text-slate-400">
            Autonomous ad drafting with hard daily (₹2,500) and monthly (₹30,000) safety spend limits.
          </p>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span>{a}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((camp) => (
          <div key={camp.id} className="p-6 rounded-xl bg-[#111622] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-lime-400/20 text-lime-400 text-xs font-bold uppercase">
                {camp.platform.replace("_", " ")}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  camp.approvalStatus === "APPROVED"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {camp.approvalStatus === "APPROVED" ? "Approved" : "Requires Authorization"}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-white">{camp.name}</h3>
              <div className="text-xs text-slate-400">Objective: {camp.objective}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-black/40 border border-white/5 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Daily Budget</span>
                <span className="text-sm font-bold text-white">₹{camp.dailyBudget}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Monthly Cap</span>
                <span className="text-sm font-bold text-white">₹{camp.monthlyBudgetLimit}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1 text-xs">
              <div className="font-bold text-white">{camp.headline}</div>
              <div className="text-slate-300">{camp.adCopy}</div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {camp.approvalStatus !== "APPROVED" ? (
                <button
                  onClick={() => handleApprove(camp.id)}
                  className="w-full h-9 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold transition-colors"
                >
                  Authorize Ad Budget & Campaign
                </button>
              ) : (
                <button
                  onClick={() => handleLaunch(camp.id)}
                  className="w-full h-9 rounded-lg bg-lime-400 text-black hover:bg-lime-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="h-3.5 w-3.5 fill-black" />
                  <span>Launch to Ad Platform</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
