import React from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Soft Ambient Glow */}
      <div className="absolute w-96 h-96 bg-white/[0.04] rounded-full blur-3xl pointer-events-none -top-20 -left-20 animate-pulse" />
      <div className="absolute w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none -bottom-20 -right-20 animate-pulse" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center space-y-6">
        {/* Luminous Bulb Loading Icon */}
        <div className="relative flex items-center justify-center mb-2">
          {/* Corona rings */}
          <div className="w-20 h-20 rounded-full bg-white/20 animate-ping absolute" />
          <div className="w-16 h-16 rounded-full bg-white/30 blur-md absolute" />
          
          {/* Bulb Nucleus */}
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-black shadow-[0_0_25px_#ffffff,0_0_50px_rgba(255,255,255,0.7)] relative z-10">
            {/* Filament */}
            <div className="w-3.5 h-3.5 rounded-full bg-black flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Animated Clinical ECG / Heartbeat Line */}
        <div className="w-48 h-8 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full text-white" viewBox="0 0 200 40" fill="none">
            <path
              d="M0 20 L60 20 L70 5 L80 35 L90 10 L100 25 L110 20 L200 20"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Status Messaging */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-mono font-bold text-white uppercase tracking-wider">
            <Sparkles size={12} className="text-white" /> Docodo Clinical OS
          </div>
          <h2 className="text-lg font-black font-display tracking-tight text-white">
            Syncing Doctor Slots &amp; OPD Queue
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            DPDP Act 2023 Encrypted · Loading zero-conflict schedule
          </p>
        </div>

        {/* Skeleton Bar Indicator */}
        <div className="w-56 h-1.5 bg-white/10 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-white rounded-full animate-[shimmer_1.5s_infinite] w-2/3" />
        </div>
      </div>
    </div>
  );
}
