import type { AnalyticsData, AnalyticsPeriod, Metric } from "@/lib/analytics-types";
import { MONTHS, analyticsMock } from "@/mocks/analytics";

/** Swap the body for fetch(`/api/analytics/${metric}?period=${period}`) when the backend exists. */
export async function getAnalytics(metric: Metric, period: AnalyticsPeriod): Promise<AnalyticsData> {
  await new Promise((r) => setTimeout(r, 500));
  const m = analyticsMock[metric];
  const n = period === "6m" ? 6 : 12;
  const round = (v: number) => (m.format === "percent" ? Math.round(v * 10) / 10 : Math.round(v));
  const series = MONTHS.map((label, i) => ({ label, current: m.current[i], previous: round(m.current[i] * m.prevFactor) })).slice(-n);

  const agg = (key: "current" | "previous") =>
    m.total === "sum" ? series.reduce((s, p) => s + p[key], 0) : series[series.length - 1][key];
  const total = agg("current");
  const change = ((total - agg("previous")) / agg("previous")) * 100;

  return { metric, format: m.format, total, change, goodWhenDown: !!m.goodWhenDown, insight: m.insight, series, breakdownTitle: m.breakdownTitle, breakdown: m.breakdown };
}
