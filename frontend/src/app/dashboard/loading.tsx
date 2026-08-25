import React from "react";
import { StatsCardSkeleton, TableRowSkeleton } from "@/components/ui/Skeletons";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-[var(--bg-elevated)]/60 rounded-xl animate-pulse" />
          <div className="h-4 w-72 bg-[var(--bg-elevated)]/40 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-[var(--bg-elevated)]/60 rounded-xl animate-pulse" />
      </div>

      {/* KPI Cards Skeleton Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Table Skeleton */}
      <div className="p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl space-y-4">
        <div className="h-5 w-40 bg-[var(--bg-elevated)]/60 rounded-lg animate-pulse" />
        <div className="space-y-2 pt-2">
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      </div>
    </div>
  );
}
