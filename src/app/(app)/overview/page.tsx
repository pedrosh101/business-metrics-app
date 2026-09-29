"use client";
import { useState } from "react";
import type { Channel, Filters, Period } from "@/lib/types";
import { channels } from "@/mocks/dashboard";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { KpiStrip } from "@/components/dashboard/KpiStrip";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ChannelBreakdown } from "@/components/dashboard/Breakdown";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { ErrorState, Skeleton } from "@/components/ui/States";

const select = "rounded-md border border-line bg-surface px-3 py-2 text-sm";

export default function OverviewPage() {
  const [filters, setFilters] = useState<Filters>({ period: "12m", channel: "all" });
  const { status, data, refetch } = useDashboardMetrics(filters);
  const loading = status === "loading";

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">How your business is doing</h1>
          <p className="mt-1 text-sm text-muted" aria-live="polite">
            {data ? `Updated ${new Date(data.updatedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}` : "Loading latest numbers…"}
          </p>
        </div>
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="period">Period</label>
          <select id="period" className={select} value={filters.period} onChange={(e) => setFilters({ ...filters, period: e.target.value as Period })}>
            <option value="6m">Last 6 months</option>
            <option value="12m">Last 12 months</option>
          </select>
          <label className="sr-only" htmlFor="channel">Channel</label>
          <select id="channel" className={select} value={filters.channel} onChange={(e) => setFilters({ ...filters, channel: e.target.value as Channel })}>
            <option value="all">All channels</option>
            {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </header>

      {status === "error" && !data ? (
        <ErrorState what="your business metrics" onRetry={refetch} />
      ) : (
        <>
          <KpiStrip kpis={data?.kpis} loading={loading} />
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <section aria-labelledby="rev">
              <h2 id="rev" className="mb-4 text-base font-semibold">Revenue</h2>
              {data ? <RevenueChart data={data.revenue} /> : <Skeleton className="h-72 w-full" />}
            </section>
            <section aria-labelledby="ch">
              <h2 id="ch" className="mb-4 text-base font-semibold">Revenue by channel</h2>
              {data ? <ChannelBreakdown channels={data.channels} /> : <Skeleton className="h-40 w-full" />}
            </section>
          </div>
          <section aria-labelledby="act">
            <h2 id="act" className="mb-2 text-base font-semibold">Recent activity</h2>
            {data ? <ActivityList items={data.activity} /> : <Skeleton className="h-40 w-full" />}
          </section>
        </>
      )}
    </div>
  );
}
