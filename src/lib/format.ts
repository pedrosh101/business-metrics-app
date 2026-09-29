import type { Kpi } from "./types";
const brl = new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 0 });

export const currency = (n: number) => brl.format(n);
export const compactCurrency = (n: number) => `R$ ${compact.format(n)}`;
export function formatKpi(k: Pick<Kpi, "value" | "format">) {
  if (k.format === "currency") return currency(k.value);
  if (k.format === "percent") return `${k.value.toFixed(1)}%`;
  return new Intl.NumberFormat("en-US").format(k.value);
}
