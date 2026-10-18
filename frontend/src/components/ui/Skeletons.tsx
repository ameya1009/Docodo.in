import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-white/[0.06] border border-white/[0.03]", className)}
      {...props}
    />
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="p-5 bg-[#09090B] border border-white/10 rounded-2xl space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-[#09090B] border border-white/10 rounded-xl">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-4 w-28 hidden sm:block" />
      <Skeleton className="h-4 w-20 hidden md:block" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  );
}

export function BookingSlotSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-11 rounded-xl" />
      ))}
    </div>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="p-6 bg-[#09090B] border border-white/15 rounded-3xl space-y-4 shadow-2xl">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <div className="space-y-2 pt-2 border-t border-white/10">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Full Skeleton Website Animation
 * Displayed when network is slow, offline, or during page transitions
 */
export function ClinicalWebsiteSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8 animate-pulse text-zinc-500">
      {/* Navbar Skeleton */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
          <div className="h-6 w-28 bg-white/10 rounded-lg" />
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="h-4 w-20 bg-white/10 rounded" />
          <div className="h-4 w-20 bg-white/10 rounded" />
          <div className="h-4 w-20 bg-white/10 rounded" />
        </div>
        <div className="h-9 w-32 bg-white/20 rounded-xl" />
      </div>

      {/* Hero Header Skeleton */}
      <div className="text-center space-y-4 max-w-2xl mx-auto py-4">
        <div className="h-7 w-48 bg-white/15 rounded-full mx-auto" />
        <div className="h-12 w-full bg-white/10 rounded-2xl" />
        <div className="h-4 w-3/4 bg-white/10 rounded mx-auto" />
      </div>

      {/* Grid: Calendar / OPD Queue / Token Register */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-black/60 border border-white/10 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-white/15 rounded" />
            <div className="h-3 w-12 bg-white/10 rounded" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-white/5 rounded-xl border border-white/5 flex items-center px-3 justify-between">
                <div className="h-3 w-28 bg-white/10 rounded" />
                <div className="h-4 w-12 bg-white/15 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-black/60 border border-white/10 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-white/15 rounded" />
            <div className="h-3 w-16 bg-white/10 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-12 bg-white/5 rounded-xl border border-white/5" />
            ))}
          </div>
        </div>

        <div className="p-5 bg-black/60 border border-white/10 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-28 bg-white/15 rounded" />
            <div className="h-4 w-4 rounded-full bg-white/20" />
          </div>
          <div className="h-28 bg-white/5 rounded-xl border border-white/5 p-3 space-y-2">
            <div className="h-3 w-3/4 bg-white/10 rounded" />
            <div className="h-3 w-1/2 bg-white/10 rounded" />
            <div className="h-8 w-full bg-white/20 rounded-lg mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
