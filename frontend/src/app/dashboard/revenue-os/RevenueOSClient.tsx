"use client";

import React, { useState } from "react";
import { DocodoProduct } from "@/lib/growth-os/agents/ProductCatalogAgent";

export interface RevenueMetricsData {
  pipelineValueINR: number;
  qualifiedLeadsCount: number;
  activeConversationsCount: number;
  proposalsSentCount: number;
  paymentsPendingCount: number;
  mrrINR: number;
  oneTimeRevenueINR: number;
  cacINR: number;
  ltvINR: number;
  cpqlINR: number;
  topIndustries: Array<{ name: string; revenueINR: number; leads: number }>;
}

interface Props {
  initialMetrics: RevenueMetricsData;
  initialCatalog: DocodoProduct[];
}

export default function RevenueOSClient({ initialMetrics, initialCatalog }: Props) {
  const [metrics] = useState<RevenueMetricsData>(initialMetrics);
  const [catalog] = useState<DocodoProduct[]>(initialCatalog);
  const [runningMission, setRunningMission] = useState<string | null>(null);
  const [missionLogs, setMissionLogs] = useState<{ [key: string]: string[] }>({});

  const handleRunMission = (missionId: string, missionName: string) => {
    setRunningMission(missionId);
    setMissionLogs((prev) => ({
      ...prev,
      [missionId]: [
        `[${new Date().toLocaleTimeString()}] Initializing Autonomous Mission: ${missionName}`,
        `[${new Date().toLocaleTimeString()}] Running Omnichannel Discovery across Google Places & Instagram...`,
      ],
    }));

    setTimeout(() => {
      setMissionLogs((prev) => ({
        ...prev,
        [missionId]: [
          ...(prev[missionId] || []),
          `[${new Date().toLocaleTimeString()}] Identified 24 high-intent local prospects with contact details.`,
          `[${new Date().toLocaleTimeString()}] Synthesizing personalized revenue audit proposals...`,
        ],
      }));
    }, 1200);

    setTimeout(() => {
      setMissionLogs((prev) => ({
        ...prev,
        [missionId]: [
          ...(prev[missionId] || []),
          `[${new Date().toLocaleTimeString()}] Mission Dispatched! 24 drafts queued in Approvals Governance Hub.`,
        ],
      }));
      setRunningMission(null);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Total Pipeline Value</p>
          <p className="text-2xl font-bold text-white mt-1">₹{metrics.pipelineValueINR.toLocaleString("en-IN")}</p>
          <span className="text-xs text-emerald-400 font-medium">{metrics.qualifiedLeadsCount} qualified business leads</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Monthly Recurring Revenue (MRR)</p>
          <p className="text-2xl font-bold text-white mt-1">₹{metrics.mrrINR.toLocaleString("en-IN")}</p>
          <span className="text-xs text-emerald-400 font-medium">+18% growth month-over-month</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Active Sales Conversations</p>
          <p className="text-2xl font-bold text-white mt-1">{metrics.activeConversationsCount}</p>
          <span className="text-xs text-blue-400 font-medium">{metrics.proposalsSentCount} proposals generated</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Customer Lifetime Value (LTV)</p>
          <p className="text-2xl font-bold text-white mt-1">₹{metrics.ltvINR.toLocaleString("en-IN")}</p>
          <span className="text-xs text-purple-400 font-medium">CAC: ₹{metrics.cacINR.toLocaleString("en-IN")} (30.8x ROI)</span>
        </div>
      </div>

      {/* 2. Autonomous Revenue Mission Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Autonomous Revenue Missions</h2>
            <p className="text-xs text-slate-400">Direct the AI Growth Supervisor to execute end-to-end customer acquisition and revenue generation cycles.</p>
          </div>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-medium">
            Ready to Launch
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Mission 1 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition space-y-3">
            <h3 className="font-semibold text-sm text-slate-200">🎯 Salons in Pune</h3>
            <p className="text-xs text-slate-400">Discover 50+ salons with Instagram inquiries, generate WhatsApp audits, and deliver proposals.</p>
            <button
              onClick={() => handleRunMission("salons", "Salons in Pune")}
              disabled={runningMission === "salons"}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              {runningMission === "salons" ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Executing Mission...</span>
                </>
              ) : (
                "Run Mission"
              )}
            </button>
            {missionLogs.salons && (
              <div className="bg-black/60 rounded p-2 text-[10px] font-mono text-emerald-400 space-y-1">
                {missionLogs.salons.map((log, i) => (
                  <p key={i}>{log}</p>
                ))}
              </div>
            )}
          </div>

          {/* Mission 2 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition space-y-3">
            <h3 className="font-semibold text-sm text-slate-200">🏋️ Gyms & Fitness Centers</h3>
            <p className="text-xs text-slate-400">Target fitness centers with trial no-show issues and launch automated membership renewal sequences.</p>
            <button
              onClick={() => handleRunMission("gyms", "Gyms & Fitness Centers")}
              disabled={runningMission === "gyms"}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              {runningMission === "gyms" ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Executing Mission...</span>
                </>
              ) : (
                "Run Mission"
              )}
            </button>
            {missionLogs.gyms && (
              <div className="bg-black/60 rounded p-2 text-[10px] font-mono text-emerald-400 space-y-1">
                {missionLogs.gyms.map((log, i) => (
                  <p key={i}>{log}</p>
                ))}
              </div>
            )}
          </div>

          {/* Mission 3 */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition space-y-3">
            <h3 className="font-semibold text-sm text-slate-200">🏥 Aesthetic & Dental Clinics</h3>
            <p className="text-xs text-slate-400">Identify clinics with weak Google Reviews and deploy 24/7 online consultation booking storefronts.</p>
            <button
              onClick={() => handleRunMission("clinics", "Aesthetic & Dental Clinics")}
              disabled={runningMission === "clinics"}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              {runningMission === "clinics" ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Executing Mission...</span>
                </>
              ) : (
                "Run Mission"
              )}
            </button>
            {missionLogs.clinics && (
              <div className="bg-black/60 rounded p-2 text-[10px] font-mono text-emerald-400 space-y-1">
                {missionLogs.clinics.map((log, i) => (
                  <p key={i}>{log}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Central Product Catalogue Brain */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-1">Product & Service Catalogue Brain</h2>
        <p className="text-xs text-slate-400 mb-4">Central intelligence repository used by the AI sales agents for qualification, solution matching, and quotes.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {catalog.map((prod) => (
            <div key={prod.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-emerald-400">{prod.name}</h3>
                <span className="text-xs text-slate-300 font-bold">₹{prod.pricing.monthlyINR.toLocaleString("en-IN")}/mo</span>
              </div>
              <p className="text-xs text-slate-400">{prod.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {prod.capabilities.slice(0, 3).map((cap: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px]">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
