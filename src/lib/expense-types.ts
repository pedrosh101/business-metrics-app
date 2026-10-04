export type ExpensePeriod = "6m" | "12m";
export type ExpenseCategory = "Payroll" | "Software" | "Marketing" | "Operations" | "Services";

export interface Expense { id: string; date: string; description: string; vendor: string; category: ExpenseCategory; amount: number }
export interface ExpenseQuery { search: string; category: ExpenseCategory | "all"; page: number; pageSize: number }
export interface ExpensePage { items: Expense[]; total: number }
export interface ExpenseSummary {
  series: { label: string; revenue: number; expenses: number }[];
  total: number; change: number; margin: number;
  categories: { name: ExpenseCategory; share: number }[];
}
