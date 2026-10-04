import type { Plan } from "./customer-types";

export type SubStatus = "active" | "trialing" | "past_due" | "canceled";
export type Cycle = "monthly" | "annual";
export type SubSort = "customer" | "amount" | "renewal";

export interface Subscription {
  id: string; customer: string; plan: Plan; status: SubStatus; cycle: Cycle;
  monthly: number; started: string; renewal: string | null; daysToRenewal: number | null;
}
export interface SubscriptionQuery {
  search: string; status: SubStatus | "all"; cycle: Cycle | "all";
  sort: SubSort; dir: "asc" | "desc"; page: number; pageSize: number;
}
export interface SubscriptionPage { items: Subscription[]; total: number }
export interface SubscriptionSummary {
  mrr: number; active: number; pastDue: number; pastDueAmount: number;
  renewals30: number; renewals30Amount: number;
  plans: { plan: Plan; count: number; mrr: number }[];
}
