import type { ReportMeta, ScheduledReport } from "@/lib/report-types";

export const reportTypes: ReportMeta[] = [
  { id: "monthly", title: "Monthly summary", description: "Revenue, expenses and net margin, month by month.", usesPeriod: true },
  { id: "revenue", title: "Revenue by plan", description: "How each plan contributed to revenue over time.", usesPeriod: true },
  { id: "customers", title: "Customer list", description: "Every customer with plan, status and lifetime revenue.", usesPeriod: false },
  { id: "subscriptions", title: "Subscriptions and renewals", description: "Active plans, billing cycles and next renewal dates.", usesPeriod: false },
  { id: "expenses", title: "Expense ledger", description: "Every expense with vendor and category.", usesPeriod: false },
];

export const scheduledReports: ScheduledReport[] = [
  { id: "s1", name: "Monthly summary", frequency: "1st of every month", recipients: "team@yourcompany.com", enabled: true },
  { id: "s2", name: "Subscriptions and renewals", frequency: "Every Monday", recipients: "you@yourcompany.com", enabled: true },
  { id: "s3", name: "Expense ledger", frequency: "Every quarter", recipients: "finance@yourcompany.com", enabled: false },
];
