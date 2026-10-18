"use client";

import React, { useState } from "react";
import { 
  Radio, MessageSquare, TrendingUp, Sparkles, Filter, 
  Mail, Send, CheckCircle2, Copy, ExternalLink, Globe, 
  Smartphone, MessageCircle, AlertCircle
} from "lucide-react";
import { 
  leadGeneratorEngine, 
  DiscoveredLeadTarget, 
  SEED_LEAD_TARGETS 
} from "@/lib/growth-os/agents/LeadGeneratorEngine";

export default function SocialSignalsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [leads, setLeads] = useState<DiscoveredLeadTarget[]>(SEED_LEAD_TARGETS);
  const [activeLead, setActiveLead] = useState<DiscoveredLeadTarget | null>(SEED_LEAD_TARGETS[0]);
  const [activeChannel, setActiveChannel] = useState<"whatsapp" | "email" | "sms" | "instagram" | "reddit">("whatsapp");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredLeads = selectedFilter === "ALL" 
    ? leads 
    : leads.filter((l) => l.detectedNeed.toLowerCase().includes(selectedFilter.toLowerCase()));

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleStatusChange = (id: string, newStatus: DiscoveredLeadTarget["status"]) => {
    leadGeneratorEngine.updateLeadStatus(id, newStatus);
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    if (activeLead?.id === id) {
      setActiveLead((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white border border-white/20">
              AUTONOMOUS DISCOVERY ENGINE
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Client Lead Scanner & Omnichannel Sales Funnel
          </h1>
          <p className="text-xs text-zinc-400">
            Automatically aggregates social signals from Reddit, Instagram, Twitter/X, and Google Maps requesting dashboards, booking websites, and automation.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "Dashboard", "Website", "Automation"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedFilter === filter
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              {filter === "ALL" ? "All Gaps" : `Need ${filter}`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left = Leads List, Right = Sales Funnel & Outreach Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Discovered Prospects List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1 font-mono">
            <span>DISCOVERED PROSPECTS ({filteredLeads.length})</span>
            <span>HIGH INTENT</span>
          </div>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredLeads.map((lead) => {
              const isSelected = activeLead?.id === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => setActiveLead(lead)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all text-left ${
                    isSelected
                      ? "bg-zinc-900 border-white/40 shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                      : "bg-black/60 border-white/10 hover:border-white/20 hover:bg-zinc-950"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[10px] font-bold">
                      {lead.source}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      {lead.intentScore}% Intent
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white">{lead.authorOrBusiness}</h3>
                  <div className="text-[11px] text-zinc-400 flex items-center gap-2 mb-2">
                    <span>{lead.city}</span>
                    <span>&bull;</span>
                    <span>{lead.industry}</span>
                    <span>&bull;</span>
                    <span className="text-zinc-300 font-medium">{lead.detectedNeed}</span>
                  </div>

                  <p className="text-xs text-zinc-300 line-clamp-2 bg-zinc-950/80 p-2.5 rounded-xl border border-white/5 mb-2 font-mono">
                    &ldquo;{lead.rawQuerySnippet}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="font-mono text-zinc-500">{lead.contactHandle}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lead.status === "CONVERTED"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : lead.status === "DISPATCHED"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Multi-Channel Sales Funnel Workspace */}
        {activeLead && (
          <div className="lg:col-span-7 p-6 rounded-2xl bg-zinc-950 border border-white/15 space-y-5">
            {/* Active Target Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Target Lead
                </span>
                <h2 className="text-lg font-bold text-white">{activeLead.authorOrBusiness}</h2>
                <div className="text-xs text-zinc-400 flex items-center gap-2">
                  <span>Handle: {activeLead.contactHandle}</span>
                  {activeLead.phone && <span>&bull; Phone: {activeLead.phone}</span>}
                  {activeLead.email && <span>&bull; Email: {activeLead.email}</span>}
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(activeLead.id, "IN_FUNNEL")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    activeLead.status === "IN_FUNNEL"
                      ? "bg-amber-400 text-black font-bold"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  In Funnel
                </button>
                <button
                  onClick={() => handleStatusChange(activeLead.id, "DISPATCHED")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    activeLead.status === "DISPATCHED"
                      ? "bg-blue-500 text-white font-bold"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Dispatched
                </button>
                <button
                  onClick={() => handleStatusChange(activeLead.id, "CONVERTED")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    activeLead.status === "CONVERTED"
                      ? "bg-emerald-400 text-black font-bold"
                      : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  Converted
                </button>
              </div>
            </div>

            {/* Funnel Channels Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
              {[
                { id: "whatsapp", label: "WhatsApp Direct", icon: MessageCircle },
                { id: "email", label: "Email Pitch", icon: Mail },
                { id: "sms", label: "SMS Blast", icon: Smartphone },
                { id: "instagram", label: "Instagram DM", icon: MessageSquare },
                { id: "reddit", label: "Reddit Answer", icon: Globe },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeChannel === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveChannel(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        : "text-zinc-400 hover:text-white bg-zinc-900/60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Channel Content Body */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-4">
              {activeChannel === "whatsapp" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>1-Click WhatsApp Outreach Message</span>
                    <span className="font-mono text-emerald-400">Recipient: {activeLead.phone || "Direct Bio Link"}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/5 text-xs text-zinc-200 whitespace-pre-line leading-relaxed font-mono">
                    {activeLead.funnel.whatsapp.message}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleCopy(activeLead.funnel.whatsapp.message, "wa_text")}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKey === "wa_text" ? "Copied!" : "Copy Text"}</span>
                    </button>
                    <a
                      href={activeLead.funnel.whatsapp.directSendUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              {activeChannel === "email" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="text-[11px] text-zinc-400 font-mono">Subject:</div>
                    <div className="p-2 rounded-lg bg-zinc-900 text-xs font-semibold text-white">
                      {activeLead.funnel.email.subject}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] text-zinc-400 font-mono">Email Body:</div>
                    <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/5 text-xs text-zinc-200 whitespace-pre-line leading-relaxed font-sans">
                      {activeLead.funnel.email.body}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() =>
                        handleCopy(
                          `Subject: ${activeLead.funnel.email.subject}\n\n${activeLead.funnel.email.body}`,
                          "email_text"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKey === "email_text" ? "Copied!" : "Copy Email Pitch"}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeChannel === "sms" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>160-Character High-Conversion SMS</span>
                    <span className="font-mono text-zinc-500">
                      {activeLead.funnel.sms.message.length} / 160 chars
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/5 text-xs text-zinc-200 leading-relaxed font-mono">
                    {activeLead.funnel.sms.message}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleCopy(activeLead.funnel.sms.message, "sms_text")}
                      className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKey === "sms_text" ? "Copied!" : "Copy SMS"}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeChannel === "instagram" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Instagram Direct Message (DM) Pitch</span>
                    <span className="font-mono text-pink-400">Handle: {activeLead.contactHandle}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/5 text-xs text-zinc-200 leading-relaxed font-sans">
                    {activeLead.funnel.instagramDm.message}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleCopy(activeLead.funnel.instagramDm.message, "ig_text")}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKey === "ig_text" ? "Copied!" : "Copy Instagram DM"}</span>
                    </button>
                  </div>
                </div>
              )}

              {activeChannel === "reddit" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Reddit Value Breakdown Comment</span>
                    <span className="font-mono text-orange-400">Target: {activeLead.funnel.redditAnswer.subreddit}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/5 text-xs text-zinc-200 whitespace-pre-line leading-relaxed font-sans">
                    {activeLead.funnel.redditAnswer.commentBody}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleCopy(activeLead.funnel.redditAnswer.commentBody, "reddit_text")}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedKey === "reddit_text" ? "Copied!" : "Copy Reddit Comment"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
