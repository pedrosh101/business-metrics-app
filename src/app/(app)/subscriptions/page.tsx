"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Stat } from "@/components/ui/Stat";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { SubscriptionsTable } from "@/components/subscriptions/SubscriptionsTable";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { getSubscriptionSummary, getSubscriptions } from "@/services/subscriptions";
import { currency } from "@/lib/format";
import type { SubSort, SubscriptionQuery } from "@/lib/subscription-types";

const PAGE_SIZE = 8;

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SubscriptionQuery["status"]>("all");
  const [cycle, setCycle] = useState<SubscriptionQuery["cycle"]>("all");
  const [sort, setSort] = useState<SubSort>("renewal");
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const summary = useAsync(getSubscriptionSummary, "summary");
  const q: SubscriptionQuery = { search: useDebounce(search), status, cycle, sort, dir, page, pageSize: PAGE_SIZE };
  const list = useAsync(() => getSubscriptions(q), JSON.stringify(q));
  const s = summary.data;
  const totalMrr = s?.plans.reduce((t, p) => t + p.mrr, 0) || 1;
  const filtering = !!(q.search || status !== "all" || cycle !== "all");

  const onSort = (k: SubSort) => {
    if (k === sort) setDir(dir === "asc" ? "desc" : "asc");
    else { setSort(k); setDir(k === "amount" ? "desc" : "asc"); }
    setPage(1);
  };
  const clear = () => { setSearch(""); setStatus("all"); setCycle("all"); setPage(1); };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Recurring revenue, upcoming renewals and the accounts that need attention.</p>
      </header>

      {summary.status === "error" && !s ? (
        <ErrorState what="your subscription summary" onRetry={summary.refetch} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Monthly recurring revenue" value={s && currency(s.mrr)} hint="From live subscriptions" />
            <Stat label="Active subscriptions" value={s?.active} hint="Paying and up to date" />
            <Stat label="Renewing in 30 days" value={s?.renewals30} hint={s && `${currency(s.renewals30Amount)} expected`} />
            <Stat label="Past due" value={s?.pastDue} hint={s && <span className="text-red-700">{currency(s.pastDueAmount)} at risk</span>} />
          </div>
          <section aria-labelledby="plans" className="rounded-lg border bg-card p-4 sm:p-5">
            <h2 id="plans" className="mb-4 text-base font-semibold">Recurring revenue by plan</h2>
            {s ? (
              <ul className="grid gap-5 sm:grid-cols-3">
                {s.plans.map((p) => (
                  <li key={p.plan}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium">{p.plan}</span>
                      <span className="text-muted-foreground">{p.count} subscriptions</span>
                    </div>
                    <p className="mt-1 text-lg font-bold">{currency(p.mrr)}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                    <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(p.mrr / totalMrr) * 100}%` }} /></div>
                  </li>
                ))}
              </ul>
            ) : <Skeleton className="h-20 w-full" />}
          </section>
        </>
      )}

      <section aria-labelledby="all-subs" className="space-y-4">
        <h2 id="all-subs" className="sr-only">All subscriptions</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search subscriptions" placeholder="Search by customer" className="pl-9" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={status} onValueChange={(v) => { if (v) { setStatus(v as SubscriptionQuery["status"]); setPage(1); } }}>
            <SelectTrigger aria-label="Filter by status" className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem>
              <SelectItem value="trialing">Trial</SelectItem><SelectItem value="past_due">Past due</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cycle} onValueChange={(v) => { if (v) { setCycle(v as SubscriptionQuery["cycle"]); setPage(1); } }}>
            <SelectTrigger aria-label="Filter by billing cycle" className="w-full sm:w-40"><SelectValue placeholder="Billing" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cycles</SelectItem><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {list.status === "error" && !list.data ? (
          <ErrorState what="your subscriptions" onRetry={list.refetch} />
        ) : list.data && list.data.total === 0 ? (
          <EmptyState
            title={filtering ? "No subscriptions match these filters" : "No subscriptions yet"}
            body={filtering ? "Try a different search or remove a filter." : "Subscriptions appear here once a customer signs up for a plan."}
            action={filtering && <Button variant="outline" onClick={clear}>Clear filters</Button>}
          />
        ) : (
          <>
            <SubscriptionsTable items={list.data?.items ?? []} loading={list.status === "loading"} pageSize={PAGE_SIZE} sort={sort} dir={dir} onSort={onSort} />
            <Pagination page={page} total={list.data?.total ?? 0} pageSize={PAGE_SIZE} onPage={setPage} />
          </>
        )}
      </section>
    </div>
  );
}
