"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { RevenuePoint } from "../../lib/types";
import { compactCurrency, currency } from "../../lib/format";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#0f3d3a",
  },
  previous: {
    label: "Previous period",
    color: "#9aa8a5",
  },
} satisfies ChartConfig;

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          top: 8,
          right: 8,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} stroke="#dbe2e0" />

        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: "#5d6b68", fontSize: 12 }}
        />

        <YAxis
          width={56}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: "#5d6b68", fontSize: 12 }}
          tickFormatter={compactCurrency}
        />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, name) => (
                <>
                  <div className="text-muted-foreground">
                    {chartConfig[name as keyof typeof chartConfig]?.label ||
                      name}
                  </div>
                  <div className="font-mono font-medium text-foreground">
                    {currency(Number(value))}
                  </div>
                </>
              )}
            />
          }
        />

        {/* Período Anterior (Linha tracejada) */}
        <Area
          type="monotone"
          dataKey="previous"
          stroke="var(--color-previous)"
          strokeDasharray="4 4"
          fill="none"
        />

        {/* Período Atual (Preenchido) */}
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-revenue)"
          strokeWidth={2.5}
          fill="var(--color-revenue)"
          fillOpacity={0.08}
        />
      </AreaChart>
    </ChartContainer>
  );
}
