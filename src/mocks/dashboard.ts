import type { Activity, ChannelShare, Kpi, RevenuePoint } from "../lib/types";

export const channels: ChannelShare[] = [
  { id: "direct", name: "Direct", share: 42 },
  { id: "subscriptions", name: "Subscriptions", share: 31 },
  { id: "marketplace", name: "Marketplace", share: 18 },
  { id: "other", name: "Other", share: 9 },
];

const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const base = [61, 64, 70, 68, 77, 83, 80, 91, 96, 104, 112, 128];
export const revenueSeries: RevenuePoint[] = months.map((label, i) => ({
  label,
  revenue: base[i] * 1000,
  previous: Math.round(base[i] * 0.88) * 1000,
}));

export const kpis: Kpi[] = [
  { id: "revenue", label: "Revenue", value: 128420, format: "currency", change: 12.4,
    insight: "Up mainly because of 18 new subscriptions." },
  { id: "customers", label: "Customers", value: 1284, format: "number", change: 8.2,
    insight: "184 customers joined this month." },
  { id: "expenses", label: "Expenses", value: 42180, format: "currency", change: -3.1, goodWhenDown: true,
    insight: "Vendor costs fell after two renegotiated contracts." },
  { id: "churn", label: "Churn", value: 2.4, format: "percent", change: -25, goodWhenDown: true,
    insight: "32 customers canceled, down from 43 last month." },
];

export const activity: Activity[] = [
  { id: "1", customer: "business 1", event: "New subscription", amount: 2400 },
  { id: "2", customer: "business 2", event: "Invoice paid", amount: 1200 },
  { id: "3", customer: "business 3", event: "Trial started", amount: 0 },
  { id: "4", customer: "business 4", event: "Plan upgraded", amount: 640 },
  { id: "5", customer: "business 5", event: "Invoice overdue", amount: -1850 },
  { id: "6", customer: "business 6", event: "Invoice overdue", amount: -550 },
];
