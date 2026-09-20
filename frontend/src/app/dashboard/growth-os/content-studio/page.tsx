"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Layers, Copy, Check, Send } from "lucide-react";
import { contentEngine, DOCODO_CONTENT_PILLARS } from "../../../../lib/growth-os/agents/ContentEngine";

export default function ContentStudioPage() {
  const [selectedPillar, setSelectedPillar] = useState<string>("WhatsApp automation");
  const [seedIdea, setSeedIdea] = useState(
    "Why local businesses lose leads after getting Instagram inquiries"
  );
  const [plan, setPlan] = useState<any>(() => contentEngine.adaptSingleIdea(seedIdea, selectedPillar as any));
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = () => {
    const newPlan = contentEngine.adaptSingleIdea(seedIdea, selectedPillar as any);
    setPlan(newPlan);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Omnichannel Content Studio</h1>
          <p className="text-xs text-slate-400">
            Transform 1 core idea into 13 native platform formats across all 21 Docodo content pillars.
          </p>
        </div>
      </div>

      {/* Input Generator Box */}
      <div className="p-6 rounded-xl bg-[#111622] border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Source Idea / Thesis</label>
            <input
              type="text"
              value={seedIdea}
              onChange={(e) => setSeedIdea(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Docodo Content Pillar</label>
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
            >
              {DOCODO_CONTENT_PILLARS.map((pillar) => (
                <option key={pillar} value={pillar}>
                  {pillar}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="h-10 px-6 rounded-xl bg-lime-400 text-black font-semibold text-xs hover:bg-lime-300 transition-all flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate 13 Native Platform Variations</span>
        </button>
      </div>

      {/* Multi-Format Output Grid */}
      {plan && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* LinkedIn */}
          <div className="p-5 rounded-xl bg-[#111622] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white uppercase tracking-wider">LinkedIn Post</span>
              <button
                onClick={() => copyToClipboard(plan.platforms.linkedinPost.copy, "li")}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === "li" ? <Check className="h-3.5 w-3.5 text-lime-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="font-semibold text-xs text-lime-400">{plan.platforms.linkedinPost.hook}</div>
            <div className="text-xs text-slate-300 whitespace-pre-line line-clamp-6">
              {plan.platforms.linkedinPost.copy}
            </div>
          </div>

          {/* Instagram Carousel */}
          <div className="p-5 rounded-xl bg-[#111622] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white uppercase tracking-wider">Instagram Carousel</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">
                {plan.platforms.instagramCarousel.slides.length} Slides
              </span>
            </div>
            <div className="text-xs text-slate-300 space-y-1">
              {plan.platforms.instagramCarousel.slides.map((s: any, i: number) => (
                <div key={i} className="p-2 rounded bg-black/30 text-[11px]">
                  <span className="font-bold text-lime-400">{s.title}:</span> {s.body}
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 italic">{plan.platforms.instagramCarousel.imageBrief}</div>
          </div>

          {/* X Thread */}
          <div className="p-5 rounded-xl bg-[#111622] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white uppercase tracking-wider">X / Twitter Thread</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">
                {plan.platforms.xThread.tweets.length} Tweets
              </span>
            </div>
            <div className="text-xs text-slate-300 space-y-1.5">
              {plan.platforms.xThread.tweets.slice(0, 3).map((t: string, i: number) => (
                <div key={i} className="p-2 rounded bg-black/30 text-[11px]">
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* YouTube Short */}
          <div className="p-5 rounded-xl bg-[#111622] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white uppercase tracking-wider">YouTube Short & Reel</span>
            </div>
            <div className="text-xs text-lime-400 font-semibold">{plan.platforms.youtubeShort.hook}</div>
            <div className="text-xs text-slate-300">{plan.platforms.youtubeShort.script}</div>
            <div className="text-[11px] text-slate-500">{plan.platforms.youtubeShort.visualNotes}</div>
          </div>

          {/* Website Content */}
          <div className="p-5 rounded-xl bg-[#111622] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white uppercase tracking-wider">Website Content & Hero</span>
            </div>
            <div className="text-xs text-lime-400 font-semibold">{plan.platforms.websiteContent?.heroHeadline}</div>
            <div className="text-xs text-slate-300">{plan.platforms.websiteContent?.subheadline}</div>
            <div className="text-[11px] text-slate-400">
              CTA: <span className="text-white font-medium">{plan.platforms.websiteContent?.ctaText}</span>
            </div>
          </div>

          {/* Ad Variation */}
          <div className="p-5 rounded-xl bg-[#111622] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white uppercase tracking-wider">Paid Ad Variation</span>
            </div>
            <div className="text-xs text-lime-400 font-semibold">{plan.platforms.adVariation.headline}</div>
            <div className="text-xs text-slate-300">{plan.platforms.adVariation.primaryText}</div>
            <div className="text-[11px] text-slate-400 font-medium">{plan.platforms.adVariation.callToAction}</div>
          </div>
        </div>
      )}
    </div>
  );
}
