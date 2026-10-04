"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { AnalyticsData } from "@/lib/analytics-types";
import { compactCurrency, formatKpi } from "@/lib/format";

const config = {
  current: { label: "This period", color: "#0f3d3a" },
  previous: { label: "Previous period", color: "#9aa8a5" },
} satisfies ChartConfig;

export function AnalyticsChart({ data, compare }: { data: AnalyticsData; compare: boolean }) {
  const fmt = (v: number) => formatKpi({ value: v, format: data.format });
  const tick = (v: number) => (data.format === "currency" ? compactCurrency(v) : data.format === "percent" ? `${v}%` : String(v));
  return (
    <ChartContainer config={config} className="h-64 w-full sm:h-80">
      <AreaChart data={data.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis width={52} tickLine={false} axisLine={false} tickFormatter={tick} domain={["auto", "auto"]} />
        <ChartTooltip content={<ChartTooltipContent formatter={(value, name) => (
          <div className="flex w-full justify-between gap-4">
            <span className="text-muted-foreground">{config[name as keyof typeof config]?.label}</span>
            <span className="font-medium">{fmt(Number(value))}</span>
          </div>
        )} />} />
        {compare && <Area dataKey="previous" type="monotone" stroke="var(--color-previous)" strokeDasharray="4 4" fill="none" />}
        <Area dataKey="current" type="monotone" stroke="var(--color-current)" strokeWidth={2.5} fill="var(--color-current)" fillOpacity={0.08} />
      </AreaChart>
    </ChartContainer>
  );
}
