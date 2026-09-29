import type { DashboardMetrics, Filters } from "../lib/types";
import { activity, channels, kpis, revenueSeries } from "../mocks/dashboard";

/**
 * Para conectar um backend real adicionar:
 * const res = await fetch(`/api/dashboard?${new URLSearchParams(filters)}`);
 * if (!res.ok) throw new Error("Failed to load dashboard");
 * return res.json();
 */
export async function getDashboardMetrics(
  filters: Filters,
): Promise<DashboardMetrics> {
  await new Promise((r) => setTimeout(r, 700)); // simulated latency

  const share =
    filters.channel === "all"
      ? 1
      : (channels.find((c) => c.id === filters.channel)?.share ?? 100) / 100;
  const series =
    filters.period === "6m" ? revenueSeries.slice(-6) : revenueSeries;

  return {
    kpis: kpis.map((k) =>
      k.id === "revenue" ? { ...k, value: Math.round(k.value * share) } : k,
    ),
    revenue: series.map((p) => ({
      ...p,
      revenue: Math.round(p.revenue * share),
      previous: Math.round(p.previous * share),
    })),
    channels,
    activity,
    updatedAt: new Date().toISOString(),
  };
}
