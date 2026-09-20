"use client";

import React, { useState } from "react";
import { Radio, MessageSquare, TrendingUp, Sparkles, Filter } from "lucide-react";
import { socialListeningAgent } from "../../../../lib/growth-os/agents/SocialListeningAgent";

export default function SocialSignalsPage() {
  const sampleSignals = [
    socialListeningAgent.analyzeSignal(
      "reddit",
      "u/pune_hairdresser",
      "We run a salon in Baner and I lose leads because nobody follows up after 8 PM on WhatsApp. Looking for software recommendations."
    ),
    socialListeningAgent.analyzeSignal(
      "x",
      "@salon_owner_pune",
      "Our website doesn't generate bookings at all. Everyone just DMs on Instagram and our staff misses them."
    ),
    socialListeningAgent.analyzeSignal(
      "instagram",
      "@wellness_studio_in",
      "Need more customers for our newly opened luxury spa in Koregaon Park. Any growth tips?"
    ),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Social Intelligence & Intent Stream</h1>
          <p className="text-xs text-slate-400">
            Real-time permitted conversation listening, buying intent classification, and non-spam opportunity synthesis.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sampleSignals.map((sig) => (
          <div key={sig.id} className="p-5 rounded-xl bg-[#111622] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] uppercase font-bold text-slate-300">
                  {sig.platform}
                </span>
                <span className="text-xs font-semibold text-white">{sig.author}</span>
                <span className="text-[11px] text-slate-500">&bull; {new Date(sig.timestamp).toLocaleTimeString()}</span>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-lime-400/20 text-lime-400 uppercase">
                {sig.entityType.replace("_", " ")}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-200">
              &ldquo;{sig.content}&rdquo;
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Intent:</span>
                <span className="font-semibold text-lime-400">{sig.intentClass}</span>
                <span className="text-slate-400">&bull; Sentiment:</span>
                <span className={sig.sentiment === "negative" ? "text-red-400" : "text-emerald-400"}>
                  {sig.sentiment}
                </span>
              </div>
              <div className="font-semibold text-white text-xs">{sig.recommendedAction}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
