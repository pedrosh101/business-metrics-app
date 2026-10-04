import type { ReportPeriod, ReportType } from "@/lib/report-types";
import { toCsv } from "@/lib/csv";
import { MONTHS, analyticsMock } from "@/mocks/analytics";
import { customers } from "@/mocks/customers";
import { expenses, monthlyExpenses } from "@/mocks/expenses";
import { subscriptions } from "@/mocks/subscriptions";
import { getRevenueSummary } from "@/services/revenue";

/** Swap for POST /api/reports (returns a file or a signed URL) when the backend exists. */
export async function generateReport(type: ReportType, period: ReportPeriod): Promise<{ filename: string; csv: string }> {
  await new Promise((r) => setTimeout(r, 600));
  const n = period === "6m" ? 6 : 12;
  const rev = analyticsMock.revenue.current;

  if (type === "monthly") {
    const rows = MONTHS.map((m, i) => [m, rev[i], monthlyExpenses[i], rev[i] - monthlyExpenses[i], (((rev[i] - monthlyExpenses[i]) / rev[i]) * 100).toFixed(1)]).slice(-n);
    return { filename: `monthly-summary-${period}.csv`, csv: toCsv([["Month", "Revenue", "Expenses", "Net", "Margin %"], ...rows]) };
  }
  if (type === "revenue") {
    const { series } = await getRevenueSummary(period);
    return { filename: `revenue-by-plan-${period}.csv`, csv: toCsv([["Month", "Business", "Pro", "Starter", "Add-ons"], ...series.map((p) => [p.label, p.business, p.pro, p.starter, p.addons])]) };
  }
  if (type === "customers")
    return { filename: "customers.csv", csv: toCsv([["Name", "Email", "Plan", "Status", "Revenue", "Customer since"], ...customers.map((c) => [c.name, c.email, c.plan, c.status, c.revenue, c.since])]) };
  if (type === "subscriptions")
    return { filename: "subscriptions.csv", csv: toCsv([["Customer", "Plan", "Status", "Billing", "Per month", "Next renewal"], ...subscriptions.map((s) => [s.customer, s.plan, s.status, s.cycle, s.monthly, s.renewal ?? ""])]) };
  return { filename: "expenses.csv", csv: toCsv([["Date", "Description", "Vendor", "Category", "Amount"], ...expenses.map((e) => [e.date, e.description, e.vendor, e.category, e.amount])]) };
}
