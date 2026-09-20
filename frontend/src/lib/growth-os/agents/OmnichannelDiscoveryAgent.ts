import { adapterRegistry } from "../adapters/AdapterRegistry";
import { DiscoveredRecord, DiscoveryQuery, PlatformSource } from "../adapters/types";

export interface DiscoveryTelemetry {
  source: PlatformSource;
  count: number;
  latencyMs: number;
  status: "SUCCESS" | "FAILED" | "SKIPPED";
}

export class OmnichannelDiscoveryAgent {
  public async executeDiscovery(
    query: DiscoveryQuery,
    enabledSources?: PlatformSource[]
  ): Promise<{ records: DiscoveredRecord[]; progress: DiscoveryTelemetry[] }> {
    const allRecords: DiscoveredRecord[] = [];
    const progress: DiscoveryTelemetry[] = [];

    const discoveryAdapters = adapterRegistry.getDiscoveryAdapters();
    const targetAdapters = enabledSources
      ? discoveryAdapters.filter((a) => enabledSources.includes(a.platform))
      : discoveryAdapters;

    for (const adapter of targetAdapters) {
      const startTime = Date.now();
      try {
        if (adapter.discover) {
          const results = await adapter.discover(query);
          allRecords.push(...results);
          progress.push({
            source: adapter.platform,
            count: results.length,
            latencyMs: Date.now() - startTime,
            status: "SUCCESS",
          });
        }
      } catch (err) {
        console.error(`[OmnichannelDiscoveryAgent] Error scanning source ${adapter.platform}:`, err);
        progress.push({
          source: adapter.platform,
          count: 0,
          latencyMs: Date.now() - startTime,
          status: "FAILED",
        });
      }
    }

    return { records: allRecords, progress };
  }
}

export const omnichannelDiscoveryAgent = new OmnichannelDiscoveryAgent();
