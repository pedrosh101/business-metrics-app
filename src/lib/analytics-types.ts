export type Metric = "revenue" | "customers" | "subscriptions" | "churn";
export type AnalyticsPeriod = "6m" | "12m";

export interface AnalyticsData {
  metric: Metric;
  format: "currency" | "number" | "percent";
  total: number;
  change: number;
  goodWhenDown: boolean;
  insight: string;
  series: { label: string; current: number; previous: number }[];
  breakdownTitle: string;
  breakdown: { name: string; share: number }[];
}
