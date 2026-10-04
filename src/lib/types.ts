export type Period = "6m" | "12m";
export type Channel = "all" | "direct" | "subscriptions" | "marketplace" | "other";
export interface Filters { period: Period; channel: Channel }

export interface Kpi {
  id: string;
  label: string;
  value: number;
  format: "currency" | "number" | "percent";
  change: number;
  goodWhenDown?: boolean;
  insight: string;
}
export interface RevenuePoint { label: string; revenue: number; previous: number }
export interface ChannelShare { id: Channel; name: string; share: number }
export interface Activity { id: string; customer: string; event: string; amount: number }
export interface DashboardMetrics {
  kpis: Kpi[];
  revenue: RevenuePoint[];
  channels: ChannelShare[];
  activity: Activity[];
  updatedAt: string;
}
