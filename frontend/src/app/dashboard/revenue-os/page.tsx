import React from "react";
import { getRevenueMetricsAction, getRevenueCatalogAction } from "@/lib/actions/growth-os/revenue-os";

export default async function RevenueOSPage() {
  const metrics = await getRevenueMetricsAction();
  const catalog = await getRevenueCatalogAction();

  return (
    <div className="space-y-6">
      {/* 1. Top KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Total Pipeline Value</p>
          <p className="text-2xl font-bold text-white mt-1">₹{metrics.pipelineValueINR.toLocaleString("en-IN")}</p>
          <span className="text-xs text-emerald-400 font-medium">142 qualified business leads</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Monthly Recurring Revenue (MRR)</p>
          <p className="text-2xl font-bold text-white mt-1">₹{metrics.mrrINR.toLocaleString("en-IN")}</p>
          <span className="text-xs text-emerald-400 font-medium">+18% growth month-over-month</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Active Sales Conversations</p>
          <p className="text-2xl font-bold text-white mt-1">{metrics.activeConversationsCount}</p>
          <span className="text-xs text-blue-400 font-medium">19 proposals generated</span>
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
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition">
            <h3 className="font-semibold text-sm text-slate-200">🎯 Salons in Pune</h3>
            <p className="text-xs text-slate-400 mt-1">Discover 50+ salons with Instagram inquiries, generate WhatsApp audits, and deliver proposals.</p>
            <button className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition">
              Run Mission
            </button>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition">
            <h3 className="font-semibold text-sm text-slate-200">🏋️ Gyms & Fitness Centers</h3>
            <p className="text-xs text-slate-400 mt-1">Target fitness centers with trial no-show issues and launch automated membership renewal sequences.</p>
            <button className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition">
              Run Mission
            </button>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition">
            <h3 className="font-semibold text-sm text-slate-200">🏥 Aesthetic & Dental Clinics</h3>
            <p className="text-xs text-slate-400 mt-1">Identify clinics with weak Google Reviews and deploy 24/7 online consultation booking storefronts.</p>
            <button className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition">
              Run Mission
            </button>
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
                {prod.capabilities.slice(0, 3).map((cap, i) => (
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
