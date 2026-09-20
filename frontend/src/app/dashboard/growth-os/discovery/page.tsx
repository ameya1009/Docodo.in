"use client";

import React, { useState } from "react";
import { Search, Globe, Filter, Sparkles, Building2, MapPin, CheckCircle2 } from "lucide-react";
import { runDiscoveryAction } from "../../../../lib/actions/growth-os/discovery";
import { CanonicalLead } from "../../../../lib/growth-os/agents/types";
import { PlatformSource } from "../../../../lib/growth-os/adapters/types";

export default function DiscoveryPage() {
  const [query, setQuery] = useState("Salons in Pune");
  const [city, setCity] = useState("Pune");
  const [industry, setIndustry] = useState("Salons & Beauty");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<CanonicalLead[]>([]);
  const [telemetry, setTelemetry] = useState<any[]>([]);

  const sources: Array<{ id: PlatformSource; label: string }> = [
    { id: "google_places", label: "Google Places / Maps" },
    { id: "google_search", label: "Google Search" },
    { id: "website", label: "Business Websites" },
    { id: "instagram", label: "Instagram" },
    { id: "facebook", label: "Facebook" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "x", label: "X / Twitter" },
    { id: "reddit", label: "Reddit" },
    { id: "directory", label: "Public Directories" },
  ];

  const [selectedSources, setSelectedSources] = useState<PlatformSource[]>([
    "google_places",
    "website",
    "instagram",
    "facebook",
    "linkedin",
    "x",
    "reddit",
    "directory",
  ]);

  const toggleSource = (src: PlatformSource) => {
    setSelectedSources((prev) =>
      prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src]
    );
  };

  const handleDiscovery = async () => {
    setLoading(true);
    try {
      const res = await runDiscoveryAction(
        { query, city, industry, limit: 15 },
        selectedSources
      );
      if (res.success) {
        setLeads(res.leads);
        setTelemetry(res.progress);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Omnichannel Discovery Hub</h1>
          <p className="text-xs text-slate-400">
            Query multiple official APIs and web sources without single-channel dependence.
          </p>
        </div>
      </div>

      {/* Query Bar */}
      <div className="p-5 rounded-xl bg-[#111622] border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Target Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Locality / City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-black/40 border border-white/10 text-xs text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleDiscovery}
              disabled={loading}
              className="w-full h-10 rounded-lg bg-lime-400 text-black font-semibold text-xs hover:bg-lime-300 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Scanning Fleet..." : "Run Omnichannel Discovery"}
            </button>
          </div>
        </div>

        {/* Source Pills */}
        <div className="pt-2 border-t border-white/5">
          <div className="text-[11px] text-slate-400 mb-2 font-medium">Configured Data Adapters:</div>
          <div className="flex flex-wrap gap-2">
            {sources.map((s) => {
              const active = selectedSources.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSource(s.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    active
                      ? "bg-lime-400/20 border-lime-400/40 text-lime-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Latency & Telemetry */}
      {telemetry.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {telemetry.map((t, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-[#111622] border border-white/5 text-xs">
              <div className="text-slate-400 uppercase text-[10px]">{t.source}</div>
              <div className="font-bold text-white text-sm">{t.count} records</div>
              <div className="text-[10px] text-slate-500">{t.latencyMs}ms response time</div>
            </div>
          ))}
        </div>
      )}

      {/* Results List */}
      {leads.length > 0 && (
        <div className="p-6 rounded-xl bg-[#111622] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Discovered Candidates ({leads.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leads.map((lead) => (
              <div key={lead.id} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">{lead.canonicalName}</h4>
                    <p className="text-xs text-slate-400">{lead.address || `${lead.city}, ${lead.country}`}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-lime-400/20 text-lime-400">
                    ICP: {lead.icpScore}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  {lead.normalizedPhone && <div>📞 {lead.normalizedPhone}</div>}
                  {lead.normalizedDomain && <div>🌐 {lead.normalizedDomain}</div>}
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                  {lead.identities.map((id, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-slate-300">
                      {id.platform}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
