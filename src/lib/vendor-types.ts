import type { ExpenseCategory } from "./expense-types";

export type VendorCategory = Exclude<ExpenseCategory, "Payroll">;
export type VendorStatus = "active" | "paused" | "ended";

export interface Vendor {
  id: string; name: string; category: VendorCategory; status: VendorStatus;
  monthly: number; email: string; contractEnd: string | null; daysToEnd: number | null;
}
export interface VendorQuery { search: string; category: VendorCategory | "all"; status: VendorStatus | "all"; page: number; pageSize: number }
export interface VendorPage { items: Vendor[]; total: number }
export interface VendorSummary { active: number; paused: number; monthly: number; endingSoon: number }
