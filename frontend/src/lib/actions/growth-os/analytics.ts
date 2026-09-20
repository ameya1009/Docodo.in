"use server";

import { adapterRegistry } from "../../growth-os/adapters/AdapterRegistry";

export async function getOmnichannelAnalyticsAction() {
  try {
    const platforms = adapterRegistry.listSupportedPlatforms();
    const metrics: Record<string, any> = {};

    for (const p of platforms) {
      const adapter = adapterRegistry.getAdapter(p.platform);
      if (adapter && adapter.getAnalytics) {
        metrics[p.platform] = await adapter.getAnalytics();
      }
    }

    return { success: true, metrics };
  } catch (error: any) {
    return { success: false, error: error?.message || "Failed to fetch analytics" };
  }
}
