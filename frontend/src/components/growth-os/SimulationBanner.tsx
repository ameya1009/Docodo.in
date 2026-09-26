import React from "react";
import { Info, ExternalLink } from "lucide-react";

export function SimulationModeBanner({
  featureName = "Growth OS Social Adapters",
}: {
  featureName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
          Simulation Mode
        </span>
        <span className="text-zinc-300 text-[11px]">
          {featureName} is currently operating in local sandbox/dry-run mode. Live external social dispatch requires connecting approved third-party OAuth app credentials in Settings.
        </span>
      </div>
    </div>
  );
}
