import type { InvoicePage, InvoiceQuery, RevenuePeriod, RevenueSummary } from "@/lib/revenue-types";
import { MONTHS, analyticsMock } from "@/mocks/analytics";
import { invoices } from "@/mocks/invoices";

/** Swap bodies for fetch(`/api/revenue?period=...`) and fetch(`/api/invoices?...`) when the backend exists. */
export async function getRevenueSummary(period: RevenuePeriod): Promise<RevenueSummary> {
  await new Promise((r) => setTimeout(r, 500));
  const totals = analyticsMock.revenue.current;
  const n = period === "6m" ? 6 : 12;
  const all = MONTHS.map((label, i) => {
    const business = Math.round(totals[i] * (0.36 + i * 0.0055));
    const pro = Math.round(totals[i] * 0.31);
    const addons = Math.round(totals[i] * 0.09);
    return { label, business, pro, addons, starter: totals[i] - business - pro - addons };
  });
  const total = totals.slice(-n).reduce((s, v) => s + v, 0);
  const prev = totals.slice(-n).reduce((s, v) => s + v * analyticsMock.revenue.prevFactor, 0);
  const open = invoices.filter((i) => i.status !== "paid");
  return {
    series: all.slice(-n), total, change: ((total - prev) / prev) * 100,
    perCustomer: Math.round(totals[11] / 1284),
    outstanding: open.reduce((s, i) => s + i.amount, 0),
    overdueCount: invoices.filter((i) => i.status === "overdue").length,
  };
}

export async function getInvoices(q: InvoiceQuery): Promise<InvoicePage> {
  await new Promise((r) => setTimeout(r, 400));
  const rows = invoices.filter((i) => q.status === "all" || i.status === q.status);
  const start = (q.page - 1) * q.pageSize;
  return { items: rows.slice(start, start + q.pageSize), total: rows.length };
}
