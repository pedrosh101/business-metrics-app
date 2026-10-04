import type { Activity, ChannelShare, Kpi, RevenuePoint } from "@/lib/types";
import { MONTHS, analyticsMock } from "./analytics";
import { customers } from "./customers";
import { monthlyExpenses } from "./expenses";
import { invoices } from "./invoices";
import { subscriptions } from "./subscriptions";
import { vendors } from "./vendors";

const last = (a: number[]) => a[a.length - 1];
const before = (a: number[]) => a[a.length - 2];
const pct = (cur: number, prev: number) => Math.round(((cur - prev) / prev) * 1000) / 10;

export const channels: ChannelShare[] = [
  { id: "direct", name: "Direct", share: 42 },
  { id: "subscriptions", name: "Subscriptions", share: 31 },
  { id: "marketplace", name: "Marketplace", share: 18 },
  { id: "other", name: "Other", share: 9 },
];

export const revenueSeries: RevenuePoint[] = MONTHS.map((label, i) => ({
  label,
  revenue: analyticsMock.revenue.current[i],
  previous: Math.round(analyticsMock.revenue.current[i] * analyticsMock.revenue.prevFactor),
}));

const rev = analyticsMock.revenue.current;
const cust = analyticsMock.customers.current;
const churn = analyticsMock.churn.current;
const subs = analyticsMock.subscriptions.current;

const netNewCustomers = last(cust) - before(cust);
const canceled = Math.round((before(cust) * last(churn)) / 100);
const endingSoon = vendors.filter((v) => v.status === "active" && v.daysToEnd !== null && v.daysToEnd <= 60).length;

/** Current month vs. the month before. */
export const kpis: Kpi[] = [
  { id: "revenue", label: "Revenue", value: last(rev), format: "currency", change: pct(last(rev), before(rev)),
    insight: `Up mainly because of ${last(subs) - before(subs)} net new subscriptions.` },
  { id: "customers", label: "Customers", value: last(cust), format: "number", change: pct(last(cust), before(cust)),
    insight: `${netNewCustomers + canceled} joined and ${canceled} canceled, a net gain of ${netNewCustomers}.` },
  { id: "expenses", label: "Expenses", value: last(monthlyExpenses), format: "currency", change: pct(last(monthlyExpenses), before(monthlyExpenses)), goodWhenDown: true,
    insight: `Spending is flat. ${endingSoon} vendor contracts end within 60 days.` },
  { id: "churn", label: "Churn", value: last(churn), format: "percent", change: pct(last(churn), before(churn)), goodWhenDown: true,
    insight: `Down from ${before(churn)}% last month. ${canceled} customers canceled.` },
];

const trial = customers.find((c) => c.status === "trial")!;
const newSub = subscriptions.find((s) => s.status === "active")!;
const inv = (i: number) => invoices[i];

export const activity: Activity[] = [
  { id: inv(3).id, customer: inv(3).customer, event: "Invoice paid", amount: inv(3).amount },
  { id: trial.id, customer: trial.name, event: "Trial started", amount: 0 },
  { id: inv(4).id, customer: inv(4).customer, event: "Invoice paid", amount: inv(4).amount },
  { id: inv(5).id, customer: inv(5).customer, event: "Invoice overdue", amount: -inv(5).amount },
  { id: newSub.id, customer: newSub.customer, event: "New subscription", amount: newSub.monthly },
  { id: inv(9).id, customer: inv(9).customer, event: "Invoice overdue", amount: -inv(9).amount },
];
