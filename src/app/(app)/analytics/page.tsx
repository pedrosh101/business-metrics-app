"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorState } from "@/components/ui/States";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { useAsync } from "@/hooks/useAsync";
import { getAnalytics } from "@/services/analytics";
import { formatKpi } from "@/lib/format";
import type { AnalyticsPeriod, Metric } from "@/lib/analytics-types";

const TABS: { value: Metric; label: string }[] = [
  { value: "revenue", label: "Revenue" }, { value: "customers", label: "Customers" },
  { value: "subscriptions", label: "Subscriptions" }, { value: "churn", label: "Churn" },
];

export default function AnalyticsPage() {
  const [metric, setMetric] = useState<Metric>("revenue");
  const [period, setPeriod] = useState<AnalyticsPeriod>("12m");
  const [compare, setCompare] = useState(true);
  const { status, data, refetch } = useAsync(() => getAnalytics(metric, period), `${metric}-${period}`);

  const up = (data?.change ?? 0) > 0;
  const good = data?.goodWhenDown ? !up : up;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch id="compare" checked={compare} onCheckedChange={setCompare} />
            <Label htmlFor="compare" className="text-sm">Compare to previous period</Label>
          </div>
          <Select value={period} onValueChange={(v) => v && setPeriod(v as AnalyticsPeriod)}>
            <SelectTrigger aria-label="Period" className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="6m">Last 6 months</SelectItem><SelectItem value="12m">Last 12 months</SelectItem></SelectContent>
          </Select>
        </div>
      </header>

      <Tabs value={metric} onValueChange={(v) => setMetric(v as Metric)}>
        <TabsList className="grid h-auto w-full grid-cols-2 sm:inline-flex sm:w-auto">
          {TABS.map((t) => <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      {status === "error" && !data ? (
        <ErrorState what="this report" onRetry={refetch} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              {data ? (
                <>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <CardTitle className={`text-3xl font-bold tracking-tight ${status === "loading" ? "opacity-40" : ""}`}>{formatKpi({ value: data.total, format: data.format })}</CardTitle>
                    <span className={`text-sm font-semibold ${good ? "text-emerald-700" : "text-red-700"}`}>
                      {up ? "↑" : "↓"} {Math.abs(data.change).toFixed(1)}% <span className="font-normal text-muted-foreground">vs. previous period</span>
                    </span>
                  </div>
                  <p className="max-w-prose text-sm text-muted-foreground">{data.insight}</p>
                </>
              ) : <div className="space-y-3"><Skeleton className="h-9 w-40" /><Skeleton className="h-4 w-3/4" /></div>}
            </CardHeader>
            <CardContent>{data ? <AnalyticsChart data={data} compare={compare} /> : <Skeleton className="h-64 w-full sm:h-80" />}</CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">{data?.breakdownTitle ?? <Skeleton className="h-5 w-40" />}</CardTitle></CardHeader>
            <CardContent>
              {data ? (
                <ul className="space-y-4">
                  {data.breakdown.map((b) => (
                    <li key={b.name}>
                      <div className="flex justify-between text-sm"><span>{b.name}</span><span className="font-semibold">{b.share}%</span></div>
                      <div className="mt-1.5 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${b.share}%` }} /></div>
                    </li>
                  ))}
                </ul>
              ) : <Skeleton className="h-40 w-full" />}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
