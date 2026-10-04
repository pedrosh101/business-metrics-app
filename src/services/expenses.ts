import type { ExpenseCategory, ExpensePage, ExpensePeriod, ExpenseQuery, ExpenseSummary } from "@/lib/expense-types";
import { MONTHS, analyticsMock } from "@/mocks/analytics";
import { expenses, monthlyExpenses } from "@/mocks/expenses";

/** Swap bodies for fetch(`/api/expenses/summary?...`) and fetch(`/api/expenses?...`) when the backend exists. */
export async function getExpenseSummary(period: ExpensePeriod): Promise<ExpenseSummary> {
  await new Promise((r) => setTimeout(r, 500));
  const n = period === "6m" ? 6 : 12;
  const rev = analyticsMock.revenue.current;
  const series = MONTHS.map((label, i) => ({ label, revenue: rev[i], expenses: monthlyExpenses[i] })).slice(-n);
  const total = series.reduce((s, p) => s + p.expenses, 0);
  const revenue = series.reduce((s, p) => s + p.revenue, 0);

  const latest = expenses.filter((e) => e.date.startsWith("2026-09"));
  const sum = latest.reduce((s, e) => s + e.amount, 0);
  const byCat = new Map<ExpenseCategory, number>();
  latest.forEach((e) => byCat.set(e.category, (byCat.get(e.category) ?? 0) + e.amount));
  const categories = [...byCat].map(([name, v]) => ({ name, share: Math.round((v / sum) * 100) })).sort((a, b) => b.share - a.share);

  return { series, total, change: (1 / 1.032 - 1) * 100, margin: ((revenue - total) / revenue) * 100, categories };
}

export async function getExpenses(q: ExpenseQuery): Promise<ExpensePage> {
  await new Promise((r) => setTimeout(r, 400));
  const term = q.search.trim().toLowerCase();
  const rows = expenses
    .filter((e) => q.category === "all" || e.category === q.category)
    .filter((e) => !term || e.vendor.toLowerCase().includes(term) || e.description.toLowerCase().includes(term));
  const start = (q.page - 1) * q.pageSize;
  return { items: rows.slice(start, start + q.pageSize), total: rows.length };
}
