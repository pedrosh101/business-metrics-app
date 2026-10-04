"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { RevenuePoint } from "@/lib/revenue-types";
import { compactCurrency, currency } from "@/lib/format";

const config = {
  business: { label: "Business", color: "#0f3d3a" },
  pro: { label: "Pro", color: "#2f7d74" },
  starter: { label: "Starter", color: "#8cb8b1" },
  addons: { label: "Add-ons", color: "#e8a33d" },
} satisfies ChartConfig;

export function RevenueByPlanChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ChartContainer config={config} className="h-64 w-full sm:h-80">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
        <Bar dataKey="starter" stackId="a" fill="var(--color-starter)" />
        <Bar dataKey="pro" stackId="a" fill="var(--color-pro)" />
        <Bar dataKey="business" stackId="a" fill="var(--color-business)" />
        <Bar dataKey="addons" stackId="a" fill="var(--color-addons)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
