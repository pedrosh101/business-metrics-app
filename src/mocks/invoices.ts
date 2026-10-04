import type { Invoice, InvoiceStatus } from "@/lib/revenue-types";
import { customers } from "./customers";

const DAY = 86400000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const END = Date.UTC(2026, 8, 30);
const amounts = [1200, 2400, 640, 8240, 1850];

export const invoices: Invoice[] = Array.from({ length: 24 }, (_, i) => {
  const issued = END - i * 2 * DAY;
  const status: InvoiceStatus = i < 3 ? "pending" : i === 5 || i === 9 ? "overdue" : "paid";
  return {
    id: `INV-${1042 - i}`,
    customer: customers[i % customers.length].name,
    issued: iso(issued), due: iso(issued + 14 * DAY),
    amount: amounts[i % amounts.length], status,
  };
});
