import type { Expense, ExpenseCategory } from "@/lib/expense-types";
import { vendors } from "./vendors";

/** Twelve months of total expenses (Oct → Sep). September matches the transactions below. */
export const monthlyExpenses = [38.2, 39.1, 40.6, 40.9, 40.2, 41.4, 42.0, 43.1, 42.9, 42.5, 42.7, 42.18].map((n) => Math.round(n * 1000));

const verbs: Record<ExpenseCategory, string> = {
  Payroll: "Monthly payroll", Software: "Monthly subscription", Marketing: "Campaign spend", Operations: "Monthly service", Services: "Retainer fee",
};
const months = [6, 7, 8]; // Jul, Aug, Sep (0-indexed)
const pad = (n: number) => String(n).padStart(2, "0");

const list: Expense[] = [];
months.forEach((m, mi) => {
  const entries: [string, ExpenseCategory, number][] = vendors
    .filter((v) => v.status !== "ended")
    .map((v) => [v.name, v.category, v.monthly] as [string, ExpenseCategory, number]);
  entries.push(["Payroll", "Payroll", 10760]);
  entries.forEach(([vendor, category, base], i) => {
    list.push({
      id: `exp_${m}_${i}`, vendor, category,
      date: `2026-${pad(m + 1)}-${pad(((i * 2) % 27) + 1)}`,
      description: verbs[category],
      amount: mi === 2 ? base : base + (((i + m) * 53) % 240) - 120, // September is exact
    });
  });
});
export const expenses: Expense[] = list.sort((a, b) => b.date.localeCompare(a.date));
