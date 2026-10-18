import React from "react";
import Link from "next/link";
import { Home, Calendar, Stethoscope, ArrowRight, Activity } from "lucide-react";

export const metadata = {
  title: "404 - Consultation Not Found | Docodo Clinical OS",
  description: "The clinical page or consultation schedule you are looking for has been moved or does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Luminous Aura */}
      <div className="absolute w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none -top-24 -left-24 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none -bottom-24 -right-24 animate-pulse" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Animated Lightbulb 404 Beacon */}
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center">
            <span className="w-16 h-16 rounded-full bg-white/20 animate-ping absolute" />
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-black shadow-[0_0_30px_#ffffff,0_0_60px_rgba(255,255,255,0.7)] relative z-10">
              <Activity size={24} className="text-black" />
            </div>
          </div>
        </div>

        {/* 404 Headline */}
        <div className="space-y-2">
          <h1 className="text-8xl sm:text-9xl font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 tracking-tighter drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-black text-white font-display">
            Consultation Slot Not Found
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
            The clinic page or booking route you requested does not exist, has been rescheduled, or was moved to another doctor.
          </p>
        </div>

        {/* Quick Recovery Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black font-black text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(255,255,255,0.6)] active:scale-95"
          >
            <Home size={15} /> Return to Homepage
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#09090B] border border-white/20 text-white font-bold text-xs hover:border-white/50 transition-all active:scale-95"
          >
            <Calendar size={15} /> Doctor Dashboard
          </Link>
        </div>

        {/* Clinical Destinations */}
        <div className="pt-6 border-t border-white/10 text-xs text-zinc-500 space-y-2">
          <p className="font-semibold text-zinc-400">Verified Clinical Destinations:</p>
          <div className="flex flex-wrap justify-center gap-3 text-zinc-300">
            <Link href="/for/doctors" className="hover:text-white underline transition-colors flex items-center gap-1">
              <Stethoscope size={12} /> Doctor OS
            </Link>
            <span>·</span>
            <Link href="/for/dentists" className="hover:text-white underline transition-colors">
              Dental Clinic OS
            </Link>
            <span>·</span>
            <Link href="/pricing" className="hover:text-white underline transition-colors">
              Pricing Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
