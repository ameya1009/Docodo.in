"use client";

import React from "react";
import { BarChart3, TrendingUp, DollarSign, Target, Users, ArrowUpRight } from "lucide-react";

export default function AnalyticsPage() {
  const channelData = [
    { source: "Google Places / Maps", leads: 184, qualified: 112, meetings: 44, won: 18, cac: "₹450" },
    { source: "Instagram Direct", leads: 142, qualified: 86, meetings: 38, won: 14, cac: "₹620" },
    { source: "Website AI Storefront", leads: 96, qualified: 68, meetings: 28, won: 12, cac: "₹380" },
    { source: "Meta Ads Funnel", leads: 220, qualified: 124, meetings: 52, won: 22, cac: "₹740" },
    { source: "LinkedIn Outreach", leads: 48, qualified: 34, meetings: 16, won: 7, cac: "₹1,120" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Attribution & Channel Performance</h1>
          <p className="text-xs text-slate-400">
            End-to-end multi-touch ROI tracking across all discovery, content, and outreach channels.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Customer Acquisition", value: "73 Customers", icon: Users, change: "+28% MoM" },
          { label: "Average CAC", value: "₹580", icon: DollarSign, change: "-14% efficiency" },
          { label: "Pipeline Value", value: "₹4,82,000", icon: TrendingUp, change: "Active CRM deals" },
          { label: "Discovery Conversion Rate", value: "10.6%", icon: Target, change: "Discovery &rarr; Deal Won" },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="p-5 rounded-xl bg-[#111622] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{m.label}</span>
                <Icon className="h-4 w-4 text-lime-400" />
              </div>
              <div className="text-xl font-bold text-white">{m.value}</div>
              <div className="text-[11px] text-lime-400">{m.change}</div>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-xl bg-[#111622] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white">Channel Attribution Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">Channel / Touchpoint</th>
                <th className="pb-3 font-semibold">Discovered Leads</th>
                <th className="pb-3 font-semibold">Qualified</th>
                <th className="pb-3 font-semibold">Demos / Meetings</th>
                <th className="pb-3 font-semibold">Customers Won</th>
                <th className="pb-3 font-semibold">Blended CAC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {channelData.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-lime-400" />
                    <span>{row.source}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-300">{row.leads}</td>
                  <td className="py-3.5 pr-4 text-slate-300">{row.qualified}</td>
                  <td className="py-3.5 pr-4 text-slate-300">{row.meetings}</td>
                  <td className="py-3.5 pr-4 font-bold text-emerald-400">{row.won}</td>
                  <td className="py-3.5 font-mono text-slate-300">{row.cac}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
