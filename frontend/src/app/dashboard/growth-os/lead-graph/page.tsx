"use client";

import React, { useState } from "react";
import { Network, Share2, Layers, CheckCircle2, Search } from "lucide-react";
import { LeadGraphEngine } from "@/lib/growth-os/agents/LeadGraphEngine";
import { CanonicalLead } from "@/lib/growth-os/agents/types";
import { PUNE_CLINICS_RAW_DATA } from "@/lib/growth-os/campaigns/pune_clinics_100";

export default function LeadGraphPage() {
  const engine = new LeadGraphEngine();
  const [selectedLeadId, setSelectedLeadId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");

  const activeRaw = PUNE_CLINICS_RAW_DATA.find((c) => c.id === selectedLeadId) || PUNE_CLINICS_RAW_DATA[0];

  const currentLead: CanonicalLead = {
    id: `clinic_${activeRaw.id}`,
    canonicalName: activeRaw.clinicName,
    city: activeRaw.locality + ", Pune",
    country: "IN",
    normalizedDomain: activeRaw.hasWeb ? `clinic${activeRaw.id}.docodo.in` : undefined,
    normalizedPhone: activeRaw.phone.replace(/\s+/g, ""),
    icpScore: 85 + (activeRaw.id % 12),
    crmStage: "qualified",
    confidenceScore: 0.95,
    primarySource: "google_places",
    identities: [
      {
        id: `gp_${activeRaw.id}`,
        platform: "google_places",
        rawName: activeRaw.clinicName,
        rating: 4.5 + ((activeRaw.id % 5) * 0.1),
        reviewCount: 45 + (activeRaw.id * 3),
        sourceConfidence: 0.98,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: {},
      },
      ...(activeRaw.hasWA
        ? [
            {
              id: `wa_${activeRaw.id}`,
              platform: "whatsapp" as const,
              rawName: activeRaw.phone,
              followerCount: 0,
              sourceConfidence: 0.99,
              sourceTimestamp: new Date().toISOString(),
              rawPayload: {},
            },
          ]
        : []),
      {
        id: `li_${activeRaw.id}`,
        platform: "linkedin",
        rawName: `${activeRaw.doctor} (${activeRaw.clinicName})`,
        sourceConfidence: 0.91,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: {},
      },
      {
        id: `em_${activeRaw.id}`,
        platform: "email" as const,
        rawName: activeRaw.email,
        sourceConfidence: 0.95,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: {},
      },
    ],
    opportunities: [],
    scoreBreakdown: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const graph = engine.buildLeadGraph(currentLead);

  const filteredClinics = PUNE_CLINICS_RAW_DATA.filter(
    (c) =>
      c.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.locality.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-lime-400/20 text-lime-400 border border-lime-400/30">
              IDENTITY KNOWLEDGE GRAPH
            </span>
            <span className="text-xs text-slate-400">100 Ingested Pune Entities</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">LeadGraph Visual Explorer</h1>
          <p className="text-xs text-slate-400">
            Relational identity graph connecting business nodes, domain touchpoints, social channels, and reachability.
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-lime-400/10 border border-lime-400/20 text-lime-400 text-sm font-bold flex items-center gap-2">
          <span>Reachability:</span>
          <span className="text-base font-extrabold">{graph.reachabilityScore}/100</span>
        </div>
      </div>

      {/* Entity Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search clinic or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-lime-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {filteredClinics.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedLeadId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedLeadId === c.id
                  ? "bg-lime-400 text-black shadow-md shadow-lime-400/20 font-bold"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              #{c.id} {c.clinicName.split(" ")[1]} ({c.locality})
            </button>
          ))}
        </div>
      </div>

      {/* Graph Visual Matrix */}
      <div className="p-8 rounded-2xl bg-[#111622] border border-white/10 min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Central Node */}
        <div className="z-10 p-5 rounded-2xl bg-lime-400 text-black font-bold text-sm shadow-xl shadow-lime-400/20 text-center border-2 border-white max-w-sm">
          <div className="text-[10px] uppercase tracking-wider opacity-80">Canonical Business Entity</div>
          <div className="text-base mt-0.5">{currentLead.canonicalName}</div>
          <div className="text-xs font-medium text-slate-900 mt-1">
            {activeRaw.doctor} &bull; {currentLead.city}
          </div>
          <div className="text-[11px] font-mono text-emerald-950 font-bold mt-1">
            ICP Score: {currentLead.icpScore} &bull; Stack: {activeRaw.digitalStack}
          </div>
        </div>

        {/* Orbiting Channel Nodes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-12 z-10">
          {graph.nodes
            .filter((n) => n.type !== "BUSINESS")
            .map((node) => (
              <div
                key={node.id}
                className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs space-y-2 hover:border-lime-400 transition-all backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-300 font-mono">
                    {node.type}
                  </span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-lime-400" />
                </div>
                <div className="font-bold text-white truncate">{node.label}</div>
                {node.properties.followers && (
                  <div className="text-[11px] text-slate-400">{node.properties.followers} followers</div>
                )}
                {node.properties.rating && (
                  <div className="text-[11px] text-slate-400">
                    ⭐ {node.properties.rating} ({node.properties.reviewCount} reviews)
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Relational Edge Schema List */}
      <div className="p-6 rounded-xl bg-[#111622] border border-white/10 space-y-3">
        <h3 className="text-sm font-bold text-white">Graph Edge Relationships ({graph.edges.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {graph.edges.map((edge) => (
            <div
              key={edge.id}
              className="p-3 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-lime-400 font-bold">{edge.relation}</span>
                <span className="text-slate-400">&rarr;</span>
                <span className="text-slate-200 truncate max-w-[200px]">{edge.target}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Confidence: {Math.round(edge.confidence * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
