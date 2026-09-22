import React from "react";
import { getPuneClinicsDraftsAction } from "@/lib/actions/growth-os/dispatch-campaign";

export default async function PuneClinicsCampaignPage() {
  const drafts = await getPuneClinicsDraftsAction();

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PUNE CLINICS B2B CAMPAIGN
            </span>
            <span className="text-xs text-slate-400">100 / 100 Verified Leads Ingested</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Pune Clinics Lead Generation & Multi-Channel Outreach
          </h1>
          <p className="text-sm text-slate-400">
            Personalized Email, WhatsApp, and LinkedIn campaigns tailored to each clinic's digital stack and medical specialty.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-emerald-900/30">
            ⚡ Dispatch Batch (20 Clinics / Day)
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Total Leads Ingested</p>
          <p className="text-2xl font-bold text-white mt-1">100</p>
          <span className="text-xs text-emerald-400">Across 10 Pune micro-markets</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Ready Channels</p>
          <p className="text-2xl font-bold text-white mt-1">3 Channels</p>
          <span className="text-xs text-blue-400">Email + WhatsApp + LinkedIn</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Specialty Categories</p>
          <p className="text-2xl font-bold text-white mt-1">6 Specialties</p>
          <span className="text-xs text-purple-400">Derm, Peds, Ortho, Gyn, Polyclinic, Dental</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-400">Compliance & Safety</p>
          <p className="text-2xl font-bold text-white mt-1">100%</p>
          <span className="text-xs text-emerald-400">E.164 Cleaned + Opt-out Enabled</span>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Lead Directory & Personalized Pitch Matrix</h2>
          <span className="text-xs text-slate-400">Showing all 100 clinics</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Clinic & Doctor</th>
                <th className="p-3">Locality</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Specialty & Solution Match</th>
                <th className="p-3">Deal Offer</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {drafts.map((draft) => (
                <tr key={draft.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono text-slate-400">{draft.id}</td>
                  <td className="p-3">
                    <p className="font-semibold text-white">{draft.clinicName}</p>
                    <p className="text-[11px] text-emerald-400">{draft.doctor}</p>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-medium">
                      {draft.locality}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px]">
                    <p className="text-slate-300">{draft.phone}</p>
                    <p className="text-slate-500">{draft.email}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-slate-200">{draft.specialty}</p>
                    <p className="text-[11px] text-blue-400">{draft.matchedPackage}</p>
                  </td>
                  <td className="p-3">
                    <span className="text-[11px] text-amber-300/90 font-medium">
                      {draft.customDeal}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition">
                      Preview Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
