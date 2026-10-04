import type { SubscriptionPage, SubscriptionQuery, SubscriptionSummary } from "@/lib/subscription-types";
import type { Plan } from "@/lib/customer-types";
import { subscriptions } from "@/mocks/subscriptions";

/** Swap bodies for fetch(`/api/subscriptions/summary`) and fetch(`/api/subscriptions?...`) when the backend exists. */
export async function getSubscriptionSummary(): Promise<SubscriptionSummary> {
  await new Promise((r) => setTimeout(r, 450));
  const live = subscriptions.filter((s) => s.status === "active" || s.status === "past_due");
  const pastDue = subscriptions.filter((s) => s.status === "past_due");
  const soon = subscriptions.filter((s) => s.status === "active" && s.daysToRenewal !== null && s.daysToRenewal <= 30);
  const sum = (l: typeof live) => l.reduce((t, s) => t + s.monthly, 0);
  return {
    mrr: sum(live), active: subscriptions.filter((s) => s.status === "active").length,
    pastDue: pastDue.length, pastDueAmount: sum(pastDue),
    renewals30: soon.length, renewals30Amount: sum(soon),
    plans: (["Business", "Pro", "Starter"] as Plan[]).map((plan) => {
      const l = live.filter((s) => s.plan === plan);
      return { plan, count: l.length, mrr: sum(l) };
    }),
  };
}

export async function getSubscriptions(q: SubscriptionQuery): Promise<SubscriptionPage> {
  await new Promise((r) => setTimeout(r, 400));
  const term = q.search.trim().toLowerCase();
  const rows = subscriptions
    .filter((s) => q.status === "all" || s.status === q.status)
    .filter((s) => q.cycle === "all" || s.cycle === q.cycle)
    .filter((s) => !term || s.customer.toLowerCase().includes(term))
    .sort((a, b) => {
      const key = q.sort === "customer" ? "customer" : q.sort === "amount" ? "monthly" : "renewal";
      const av = a[key] ?? "9999", bv = b[key] ?? "9999";
      const r = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return q.dir === "asc" ? r : -r;
    });
  const start = (q.page - 1) * q.pageSize;
  return { items: rows.slice(start, start + q.pageSize), total: rows.length };
}
