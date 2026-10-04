"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { RevenuePoint } from "@/lib/types";
import { compactCurrency, currency } from "@/lib/format";

const config = {
  revenue: { label: "Revenue", color: "#0f3d3a" },
  previous: { label: "Previous period", color: "#9aa8a5" },
} satisfies ChartConfig;

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    // aspect-auto + fixed height: without it ChartContainer sizes itself from its width (aspect-video),
    // which can feed back into the grid layout and cause a resize loop.
    <ChartContainer config={config} className="aspect-auto h-64 w-full sm:h-72">
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
        <Area dataKey="previous" type="monotone" stroke="var(--color-previous)" strokeDasharray="4 4" fill="none" />
        <Area dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2.5} fill="var(--color-revenue)" fillOpacity={0.08} />
      </AreaChart>
    </ChartContainer>
  );
}
