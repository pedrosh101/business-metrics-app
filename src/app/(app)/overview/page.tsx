"use client";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KpiStrip } from "@/components/dashboard/KpiStrip";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ChannelBreakdown } from "@/components/dashboard/Breakdown";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { ErrorState, Skeleton } from "@/components/ui/States";
import { useAsync } from "@/hooks/useAsync";
import { getDashboardMetrics } from "@/services/metrics";
import { channels } from "@/mocks/dashboard";
import type { Channel, Filters, Period } from "@/lib/types";

const card = "min-w-0 rounded-lg border bg-card p-4 sm:p-5";

export default function OverviewPage() {
  const [filters, setFilters] = useState<Filters>({
    period: "12m",
    channel: "all",
  });
  const { status, data, refetch } = useAsync(
    () => getDashboardMetrics(filters),
    JSON.stringify(filters),
  );
  const loading = status === "loading";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            How your business is doing
          </h1>
          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            {data
              ? `Updated ${new Date(data.updatedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
              : "Loading latest numbers…"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <Select
            value={filters.period}
            onValueChange={(v) =>
              v && setFilters({ ...filters, period: v as Period })
            }
          >
            <SelectTrigger aria-label="Period" className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.channel}
            onValueChange={(v) =>
              v && setFilters({ ...filters, channel: v as Channel })
            }
          >
            <SelectTrigger aria-label="Channel" className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All channels</SelectItem>
              {channels.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {status === "error" && !data ? (
        <ErrorState what="your business metrics" onRetry={refetch} />
      ) : (
        <>
          {/**Cards*/}
          <KpiStrip kpis={data?.kpis} loading={loading} />
          {/*Revenue*/}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <section aria-labelledby="rev" className={card}>
              <h2 id="rev" className="mb-4 text-base font-semibold">
                Revenue
              </h2>
              {data ? (
                <div className={loading ? "opacity-60 transition-opacity" : ""}>
                  <RevenueChart data={data.revenue} />
                </div>
              ) : (
                <Skeleton className="h-64 w-full sm:h-72" />
              )}
            </section>
            <section aria-labelledby="ch" className={card}>
              <h2 id="ch" className="mb-4 text-base font-semibold">
                Revenue by channel
              </h2>
              {data ? (
                <ChannelBreakdown channels={data.channels} />
              ) : (
                <Skeleton className="h-40 w-full" />
              )}
            </section>
          </div>
          {/*Recent activity*/}
          <section aria-labelledby="act" className={card}>
            <h2 id="act" className="mb-2 text-base font-semibold">
              Recent activity
            </h2>
            {data ? (
              <ActivityList items={data.activity} />
            ) : (
              <Skeleton className="h-40 w-full" />
            )}
          </section>
        </>
      )}
    </div>
  );
}
