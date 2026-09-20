"use client";

import React, { useState } from "react";
import { Network, Share2, Layers, CheckCircle2 } from "lucide-react";
import { LeadGraphEngine } from "../../../../lib/growth-os/agents/LeadGraphEngine";
import { CanonicalLead } from "../../../../lib/growth-os/agents/types";

export default function LeadGraphPage() {
  const engine = new LeadGraphEngine();
  const sampleLead: CanonicalLead = {
    id: "lead_demo_pune",
    canonicalName: "Blush & Glow Luxury Salon",
    city: "Pune",
    country: "IN",
    normalizedDomain: "blushandglow.in",
    normalizedPhone: "+919822011223",
    icpScore: 88,
    crmStage: "qualified",
    confidenceScore: 0.96,
    primarySource: "google_places",
    identities: [
      {
        id: "gp_1",
        platform: "google_places",
        rawName: "Blush & Glow Luxury Salon",
        rating: 4.4,
        reviewCount: 180,
        sourceConfidence: 0.98,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: {},
      },
      {
        id: "ig_1",
        platform: "instagram",
        rawName: "@blushandglow_pune",
        followerCount: 6500,
        sourceConfidence: 0.92,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: {},
      },
      {
        id: "li_1",
        platform: "linkedin",
        rawName: "Blush & Glow Salon Pvt Ltd",
        sourceConfidence: 0.89,
        sourceTimestamp: new Date().toISOString(),
        rawPayload: {},
      },
    ],
    opportunities: [],
    scoreBreakdown: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const graph = engine.buildLeadGraph(sampleLead);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">LeadGraph Visual Explorer</h1>
          <p className="text-xs text-slate-400">
            Relational identity graph connecting business nodes, domain touchpoints, social channels, and reachability.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-lime-400/10 border border-lime-400/20 text-lime-400 text-xs font-semibold">
          Reachability Score: {graph.reachabilityScore}/100
        </div>
      </div>

      {/* Graph Visual Matrix */}
      <div className="p-8 rounded-2xl bg-[#111622] border border-white/10 min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Central Node */}
        <div className="z-10 p-5 rounded-2xl bg-lime-400 text-black font-bold text-sm shadow-xl shadow-lime-400/20 text-center border-2 border-white">
          <div className="text-xs uppercase tracking-wider opacity-80">Canonical Business Entity</div>
          <div className="text-base">{sampleLead.canonicalName}</div>
          <div className="text-[11px] font-medium pt-1">ICP Score: {sampleLead.icpScore} &bull; {sampleLead.city}</div>
        </div>

        {/* Orbiting Channel Nodes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mt-12 z-10">
          {graph.nodes
            .filter((n) => n.type !== "BUSINESS")
            .map((node) => (
              <div
                key={node.id}
                className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs space-y-2 hover:border-lime-400 transition-all"
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
        <div className="space-y-2">
          {graph.edges.map((edge) => (
            <div
              key={edge.id}
              className="p-3 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-lime-400">{edge.relation}</span>
                <span className="text-slate-400">&rarr;</span>
                <span className="text-slate-200">{edge.target}</span>
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
