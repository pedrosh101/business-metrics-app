import type { Cycle, Subscription, SubStatus } from "@/lib/subscription-types";
import type { CustomerStatus } from "@/lib/customer-types";
import { customers } from "./customers";

export const TODAY = Date.UTC(2026, 9, 2);
const DAY = 86400000;
const base = { Starter: 99, Pro: 299, Business: 799 } as const;
const statusMap: Record<CustomerStatus, SubStatus> = { active: "active", trial: "trialing", overdue: "past_due", canceled: "canceled" };

export const subscriptions: Subscription[] = customers.map((c, i) => {
  const status = statusMap[c.status];
  const cycle: Cycle = i % 3 === 0 ? "annual" : "monthly";
  const days = status === "canceled" ? null : status === "past_due" ? -((i % 6) + 1) : ((i * 3) % 50) + 1;
  return {
    id: `sub_${i + 1}`, customer: c.name, plan: c.plan, status, cycle,
    monthly: Math.round(base[c.plan] * (cycle === "annual" ? 0.85 : 1)),
    started: c.since,
    renewal: days === null ? null : new Date(TODAY + days * DAY).toISOString().slice(0, 10),
    daysToRenewal: days,
  };
});
