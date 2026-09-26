"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  Send,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { runSupervisorMissionAction } from "../../../lib/actions/growth-os/supervisor";
import { SupervisorMissionPlan } from "../../../lib/growth-os/agents/types";
import { SimulationModeBanner } from "@/components/growth-os/SimulationBanner";

export default function GrowthOSOverviewPage() {
  const [objective, setObjective] = useState(
    "Find 100 salons in Pune that could benefit from Docodo across Google, Instagram, Facebook, LinkedIn and start outreach."
  );
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SupervisorMissionPlan | null>(null);

  const handleLaunchMission = async () => {
    setLoading(true);
    try {
      const res = await runSupervisorMissionAction({
        objective,
        city: "Pune",
        industry: "salon",
        limit: 20,
      });
      if (res.success && res.plan) {
        setCurrentPlan(res.plan);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SimulationModeBanner featureName="Social Discovery & Outreach Engine" />
      {/* Top Welcome / Mission Trigger Box */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#121824] via-[#161F2E] to-[#121824] border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-semibold">
            <Zap className="h-3.5 w-3.5" />
            <span>Growth Supervisor Engine</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Autonomous Omnichannel Customer Acquisition
          </h2>
          <p className="text-sm text-slate-300">
            Tell the Growth Supervisor what customers to acquire. The fleet will query multiple sources, resolve duplicate identities, identify business needs, map Docodo solutions, place qualified leads into CRM, and generate personalized drafts for your review.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="e.g. Find 100 clinics in Pune that need WhatsApp automation"
                className="w-full h-12 pl-4 pr-10 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 placeholder:text-slate-500"
              />
            </div>
            <button
              onClick={handleLaunchMission}
              disabled={loading || !objective.trim()}
              className="h-12 px-6 rounded-xl bg-lime-400 text-black font-semibold text-sm hover:bg-lime-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-lime-400/20 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Fleet Executing...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-black" />
                  <span>Launch Supervisor Mission</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Subtle Decorative Backdrop Elements */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Discovered Footprints", value: currentPlan?.stages[0]?.count || 482, icon: Search, change: "+34% this week" },
          { label: "Resolved Entities", value: currentPlan?.stages[1]?.count || 214, icon: Users, change: "92% match confidence" },
          { label: "Qualified CRM Leads", value: currentPlan?.stages[2]?.count || 128, icon: Target, change: "ICP Score > 75" },
          { label: "Pending Approvals", value: currentPlan?.pendingApprovals.length || 15, icon: ShieldCheck, change: "Safety Gate Halted" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-5 rounded-xl bg-[#111622] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{stat.label}</span>
                <Icon className="h-4 w-4 text-lime-400" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
              <div className="text-[11px] text-lime-400/90 font-medium">{stat.change}</div>
            </div>
          );
        })}
      </div>

      {/* Supervisor Mission Live Progress Panel */}
      {currentPlan && (
        <div className="p-6 rounded-xl bg-[#111622] border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Active Mission Workflow</div>
              <h3 className="text-lg font-bold text-white">{currentPlan.objective}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Human Approval Required
              </span>
            </div>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {currentPlan.stages.map((stage, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                  stage.status === "COMPLETED"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : stage.status === "PAUSED_FOR_APPROVAL"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    : stage.status === "RUNNING"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                    : "bg-white/5 border-white/5 text-slate-500"
                }`}
              >
                <div className="font-semibold">{idx + 1}. {stage.name}</div>
                <div className="text-[11px] opacity-80">{stage.details || stage.status}</div>
                {stage.count !== undefined && (
                  <div className="font-bold text-sm text-white pt-1">{stage.count} items</div>
                )}
              </div>
            ))}
          </div>

          {/* Audit Logs Stream */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase">Supervisor Audit Ledger</div>
            <div className="bg-black/40 rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-1.5 max-h-48 overflow-y-auto border border-white/5">
              {currentPlan.auditLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-slate-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-lime-400 font-semibold">{log.agent}:</span>
                  <span className={log.level === "GATE" ? "text-amber-300 font-bold" : "text-slate-300"}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Discovered & Resolved Canonical Leads Table */}
      {currentPlan && currentPlan.discoveredLeads.length > 0 && (
        <div className="p-6 rounded-xl bg-[#111622] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Resolved Canonical Lead Entities</h3>
            <span className="text-xs text-slate-400">
              Showing {currentPlan.discoveredLeads.length} resolved records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 font-semibold">Canonical Business</th>
                  <th className="pb-3 font-semibold">Normalized Contacts</th>
                  <th className="pb-3 font-semibold">Identities</th>
                  <th className="pb-3 font-semibold">ICP Score</th>
                  <th className="pb-3 font-semibold">CRM Stage</th>
                  <th className="pb-3 font-semibold">Docodo Opportunity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentPlan.discoveredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4 font-medium text-white">
                      <div>{lead.canonicalName}</div>
                      <div className="text-[11px] text-slate-400">{lead.city}, {lead.country}</div>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">
                      <div>{lead.normalizedPhone || "—"}</div>
                      <div className="text-[11px] text-slate-500">{lead.normalizedDomain || "No domain"}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1">
                        {lead.identities.map((id, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 uppercase"
                          >
                            {id.platform.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-400 font-bold">
                        {lead.icpScore}/100
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                        {lead.crmStage}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">
                      {lead.opportunities[0]?.recommendedProduct || "General Acquisition"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
