import React from "react";
import { getRevenueMetricsAction, getRevenueCatalogAction } from "@/lib/actions/growth-os/revenue-os";
import RevenueOSClient from "./RevenueOSClient";

export const dynamic = "force-dynamic";

export default async function RevenueOSPage() {
  const metrics = await getRevenueMetricsAction();
  const catalog = await getRevenueCatalogAction();

  return <RevenueOSClient initialMetrics={metrics} initialCatalog={catalog} />;
}
