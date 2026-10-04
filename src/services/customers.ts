import type { CustomerPage, CustomerQuery } from "@/lib/customer-types";
import { customers } from "@/mocks/customers";

/** Swap the body for fetch(`/api/customers?${new URLSearchParams(...)}`) when the backend exists. */
export async function getCustomers(q: CustomerQuery): Promise<CustomerPage> {
  await new Promise((r) => setTimeout(r, 400));
  const term = q.search.trim().toLowerCase();
  const filtered = customers
    .filter((c) => q.status === "all" || c.status === q.status)
    .filter((c) => q.plan === "all" || c.plan === q.plan)
    .filter((c) => !term || c.name.toLowerCase().includes(term) || c.email.includes(term))
    .sort((a, b) => {
      const av = a[q.sort], bv = b[q.sort];
      const r = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return q.dir === "asc" ? r : -r;
    });
  const start = (q.page - 1) * q.pageSize;
  return { items: filtered.slice(start, start + q.pageSize), total: filtered.length };
}
