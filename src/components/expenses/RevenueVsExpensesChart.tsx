"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { compactCurrency, currency } from "@/lib/format";

const config = {
  revenue: { label: "Revenue", color: "#0f3d3a" },
  expenses: { label: "Expenses", color: "#e8a33d" },
} satisfies ChartConfig;

export function RevenueVsExpensesChart({ data }: { data: { label: string; revenue: number; expenses: number }[] }) {
  return (
    <ChartContainer config={config} className="h-64 w-full sm:h-72">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis width={52} tickLine={false} axisLine={false} tickFormatter={compactCurrency} />
        <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => (
          <div className="flex w-full justify-between gap-4">
            <span className="text-muted-foreground">{config[name as keyof typeof config]?.label}</span>
            <span className="font-medium">{currency(Number(value))}</span>
          </div>
        )} />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2.5} fill="var(--color-revenue)" fillOpacity={0.08} />
        <Area dataKey="expenses" type="monotone" stroke="var(--color-expenses)" strokeWidth={2.5} fill="var(--color-expenses)" fillOpacity={0.12} />
      </AreaChart>
    </ChartContainer>
  );
}
