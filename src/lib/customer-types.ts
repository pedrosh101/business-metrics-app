export type Plan = "Starter" | "Pro" | "Business";
export type CustomerStatus = "active" | "trial" | "overdue" | "canceled";
export type CustomerSort = "name" | "revenue" | "since";

export interface CustomerEvent { date: string; event: string; amount: number }
export interface Customer {
  id: string; name: string; email: string; plan: Plan; status: CustomerStatus;
  revenue: number; since: string; subscriptions: number; events: CustomerEvent[];
}
export interface CustomerQuery {
  search: string; status: CustomerStatus | "all"; plan: Plan | "all";
  sort: CustomerSort; dir: "asc" | "desc"; page: number; pageSize: number;
}
export interface CustomerPage { items: Customer[]; total: number }
