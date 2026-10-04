export type RevenuePeriod = "6m" | "12m";
export type InvoiceStatus = "paid" | "pending" | "overdue";

export interface Invoice { id: string; customer: string; issued: string; due: string; amount: number; status: InvoiceStatus }
export interface InvoiceQuery { status: InvoiceStatus | "all"; page: number; pageSize: number }
export interface InvoicePage { items: Invoice[]; total: number }

export interface RevenuePoint { label: string; business: number; pro: number; starter: number; addons: number }
export interface RevenueSummary {
  series: RevenuePoint[]; total: number; change: number;
  perCustomer: number; outstanding: number; overdueCount: number;
}
