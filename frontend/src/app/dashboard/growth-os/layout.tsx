import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Network,
  Lightbulb,
  FileEdit,
  Send,
  Megaphone,
  Radio,
  CheckSquare,
  BarChart3,
  ShieldAlert,
} from "lucide-react";

export default function GrowthOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Overview", href: "/dashboard/growth-os", icon: Sparkles },
    { name: "Discovery", href: "/dashboard/growth-os/discovery", icon: Search },
    { name: "LeadGraph", href: "/dashboard/growth-os/lead-graph", icon: Network },
    { name: "Opportunities", href: "/dashboard/growth-os/opportunities", icon: Lightbulb },
    { name: "Content Studio", href: "/dashboard/growth-os/content-studio", icon: FileEdit },
    { name: "Outreach", href: "/dashboard/growth-os/outreach", icon: Send },
    { name: "Ad Campaigns", href: "/dashboard/growth-os/campaigns", icon: Megaphone },
    { name: "Social Signals", href: "/dashboard/growth-os/social-listening", icon: Radio },
    { name: "Approvals", href: "/dashboard/growth-os/approvals", icon: CheckSquare },
    { name: "Attribution", href: "/dashboard/growth-os/analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0D14] text-slate-100">
      {/* Subheader Navigation for Growth OS */}
      <div className="border-b border-white/10 bg-[#0F1420]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-lime-400/10 border border-lime-400/30 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-lime-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-white">DOCODO GROWTH OS</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-lime-400/20 text-lime-400 border border-lime-400/30">
                  OMNICHANNEL ACQUISITION
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Autonomous Discovery &bull; Entity Resolution &bull; Content &bull; CRM</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Safety Approval Gate: Active</span>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pt-3 pb-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
              >
                <Icon className="h-3.5 w-3.5 text-slate-400" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
