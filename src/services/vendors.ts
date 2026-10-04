import type { Expense } from "@/lib/expense-types";
import type { VendorPage, VendorQuery, VendorSummary } from "@/lib/vendor-types";
import { expenses } from "@/mocks/expenses";
import { vendors } from "@/mocks/vendors";

/** Swap bodies for fetch(`/api/vendors...`) when the backend exists. */
export async function getVendorSummary(): Promise<VendorSummary> {
  await new Promise((r) => setTimeout(r, 450));
  const active = vendors.filter((v) => v.status === "active");
  return {
    active: active.length, paused: vendors.filter((v) => v.status === "paused").length,
    monthly: vendors.filter((v) => v.status !== "ended").reduce((s, v) => s + v.monthly, 0),
    endingSoon: active.filter((v) => v.daysToEnd !== null && v.daysToEnd <= 60).length,
  };
}

export async function getVendors(q: VendorQuery): Promise<VendorPage> {
  await new Promise((r) => setTimeout(r, 400));
  const term = q.search.trim().toLowerCase();
  const rows = vendors
    .filter((v) => q.status === "all" || v.status === q.status)
    .filter((v) => q.category === "all" || v.category === q.category)
    .filter((v) => !term || v.name.toLowerCase().includes(term))
    .sort((a, b) => b.monthly - a.monthly);
  const start = (q.page - 1) * q.pageSize;
  return { items: rows.slice(start, start + q.pageSize), total: rows.length };
}

export async function getVendorExpenses(vendor: string): Promise<Expense[]> {
  await new Promise((r) => setTimeout(r, 300));
  return expenses.filter((e) => e.vendor === vendor).slice(0, 4);
}
