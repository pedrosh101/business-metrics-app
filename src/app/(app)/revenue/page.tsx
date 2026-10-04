"use client";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Stat } from "@/components/ui/Stat";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { RevenueByPlanChart } from "@/components/revenue/RevenueByPlanChart";
import { InvoicesTable } from "@/components/revenue/InvoicesTable";
import { useAsync } from "@/hooks/useAsync";
import { getInvoices, getRevenueSummary } from "@/services/revenue";
import { currency } from "@/lib/format";
import type { InvoiceQuery, RevenuePeriod } from "@/lib/revenue-types";

const PAGE_SIZE = 8;

export default function RevenuePage() {
  const [period, setPeriod] = useState<RevenuePeriod>("12m");
  const [invStatus, setInvStatus] = useState<InvoiceQuery["status"]>("all");
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getRevenueSummary(period), period);
  const q: InvoiceQuery = { status: invStatus, page, pageSize: PAGE_SIZE };
  const invoices = useAsync(() => getInvoices(q), JSON.stringify(q));
  const s = summary.data;
  const up = (s?.change ?? 0) > 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenue</h1>
          <p className="mt-1 text-sm text-muted-foreground">What came in, from which plans, and what is still unpaid.</p>
        </div>
        <Select value={period} onValueChange={(v) => v && setPeriod(v as RevenuePeriod)}>
          <SelectTrigger aria-label="Period" className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="6m">Last 6 months</SelectItem><SelectItem value="12m">Last 12 months</SelectItem></SelectContent>
        </Select>
      </header>

      {summary.status === "error" && !s ? (
        <ErrorState what="your revenue" onRetry={summary.refetch} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Total revenue" loading={summary.status === "loading"}
              value={s && currency(s.total)}
              hint={s && <span className={up ? "text-emerald-700" : "text-red-700"}>{up ? "↑" : "↓"} {Math.abs(s.change).toFixed(1)}% vs. previous period</span>} />
            <Stat label="Revenue per customer" value={s && currency(s.perCustomer)} hint="Average this month" loading={summary.status === "loading"} />
            <Stat label="Outstanding" value={s && currency(s.outstanding)} loading={summary.status === "loading"}
              hint={s && (s.overdueCount ? <span className="text-red-700">{s.overdueCount} overdue invoices</span> : "Nothing overdue")} />
          </div>
          {/*Chart*/}
          <section aria-labelledby="by-plan" className="rounded-lg border bg-card p-4 sm:p-5">
            <h2 id="by-plan" className="mb-4 text-base font-semibold">Revenue by plan</h2>
            {s ? <RevenueByPlanChart data={s.series} /> : <Skeleton className="h-64 w-full sm:h-80" />}
          </section>
        </>
      )}

      <section aria-labelledby="invoices" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="invoices" className="text-base font-semibold">Invoices</h2>
          <Tabs value={invStatus} onValueChange={(v) => { setInvStatus(v as InvoiceQuery["status"]); setPage(1); }}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger><TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {invoices.status === "error" && !invoices.data ? (
          <ErrorState what="your invoices" onRetry={invoices.refetch} />
        ) : invoices.data && invoices.data.total === 0 ? (
          <EmptyState title="No invoices here" body="Invoices with this status will appear as soon as you have any." />
        ) : (
          <>
            <InvoicesTable items={invoices.data?.items ?? []} loading={invoices.status === "loading"} pageSize={PAGE_SIZE} />
            <Pagination page={page} total={invoices.data?.total ?? 0} pageSize={PAGE_SIZE} onPage={setPage} />
          </>
        )}
      </section>
    </div>
  );
}
