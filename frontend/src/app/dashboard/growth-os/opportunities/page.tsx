"use client";

import React from "react";
import { Lightbulb, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function OpportunitiesPage() {
  const sampleOpps = [
    {
      id: "opp_1",
      business: "Velvet Scissor Unisex Salon",
      problem: "High Instagram followers (8.4k) but manual DM booking friction",
      evidence: "Instagram bio says 'DM to book'. Inquiries wait 4+ hours for price menu.",
      recommendedProduct: "Docodo Instant Booking & WhatsApp Receptionist",
      solution: "Deploy WhatsApp calendar booking link directly in IG bio & automated DM response.",
      confidence: 0.95,
      reachability: "WhatsApp + IG Verified",
    },
    {
      id: "opp_2",
      business: "Radiance Aesthetic Clinic",
      problem: "Low Google Review count (32 reviews) despite 3 years in prime locality",
      evidence: "Google Place listing has 4.1 stars with only 32 reviews; losing local map pack ranking.",
      recommendedProduct: "Google Review & Local SEO Engine",
      solution: "Activate automated post-treatment WhatsApp review request sequence.",
      confidence: 0.93,
      reachability: "Phone + Website Verified",
    },
    {
      id: "opp_3",
      business: "Serene Ayurvedic Spa Baner",
      problem: "No mobile-responsive website or direct online payment booking portal",
      evidence: "Operates purely on incoming phone calls with no interactive web schedule.",
      recommendedProduct: "Docodo AI Storefront",
      solution: "Deploy customized Docodo AI booking website in under 5 minutes.",
      confidence: 0.96,
      reachability: "Phone Verified",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Opportunity Matrix</h1>
          <p className="text-xs text-slate-400">
            AI-mapped verified business bottlenecks connected to high-conversion Docodo solutions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleOpps.map((opp) => (
          <div key={opp.id} className="p-5 rounded-xl bg-[#111622] border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-lime-400/20 text-lime-400 text-[10px] font-bold">
                  {Math.round(opp.confidence * 100)}% Confidence
                </span>
                <span className="text-[11px] text-slate-500">{opp.reachability}</span>
              </div>
              <h3 className="font-bold text-base text-white">{opp.business}</h3>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                <div className="font-semibold text-[11px] uppercase tracking-wider text-red-400">Bottleneck:</div>
                <div>{opp.problem}</div>
                <div className="text-[11px] text-slate-400 pt-1 italic">&ldquo;{opp.evidence}&rdquo;</div>
              </div>
              <div className="p-3 rounded-lg bg-lime-400/10 border border-lime-400/20 text-lime-300 text-xs">
                <div className="font-semibold text-[11px] uppercase tracking-wider text-lime-400">Docodo Solution:</div>
                <div className="font-bold text-white">{opp.recommendedProduct}</div>
                <div className="text-[11px] text-slate-300 pt-1">{opp.solution}</div>
              </div>
            </div>

            <button className="w-full h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2">
              <span>Generate Targeted Outreach Draft</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
