"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Stat } from "@/components/ui/Stat";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { RevenueVsExpensesChart } from "@/components/expenses/RevenueVsExpensesChart";
import { ExpensesTable } from "@/components/expenses/ExpensesTable";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { getExpenseSummary, getExpenses } from "@/services/expenses";
import { currency } from "@/lib/format";
import type { ExpensePeriod, ExpenseQuery } from "@/lib/expense-types";

const PAGE_SIZE = 8;
const CATEGORIES = ["Payroll", "Software", "Marketing", "Operations", "Services"];

export default function ExpensesPage() {
  const [period, setPeriod] = useState<ExpensePeriod>("12m");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ExpenseQuery["category"]>("all");
  const [page, setPage] = useState(1);

  const summary = useAsync(() => getExpenseSummary(period), period);
  const q: ExpenseQuery = { search: useDebounce(search), category, page, pageSize: PAGE_SIZE };
  const list = useAsync(() => getExpenses(q), JSON.stringify(q));
  const s = summary.data;
  const filtering = !!(q.search || category !== "all");
  const down = (s?.change ?? 0) < 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">Where the money goes, and how much of your revenue you keep.</p>
        </div>
        <Select value={period} onValueChange={(v) => v && setPeriod(v as ExpensePeriod)}>
          <SelectTrigger aria-label="Period" className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="6m">Last 6 months</SelectItem><SelectItem value="12m">Last 12 months</SelectItem></SelectContent>
        </Select>
      </header>

      {summary.status === "error" && !s ? (
        <ErrorState what="your expenses" onRetry={summary.refetch} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat label="Total expenses" value={s && currency(s.total)} loading={summary.status === "loading"}
              hint={s && <span className={down ? "text-emerald-700" : "text-red-700"}>{down ? "↓" : "↑"} {Math.abs(s.change).toFixed(1)}% vs. previous period</span>} />
            <Stat label="Net margin" value={s && `${s.margin.toFixed(1)}%`} hint="Share of revenue you keep" loading={summary.status === "loading"} />
            <Stat label="Largest category" value={s?.categories[0]?.name} hint={s && `${s.categories[0].share}% of monthly spend`} />
          </div>
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <section aria-labelledby="rve" className="rounded-lg border bg-card p-4 sm:p-5">
              <h2 id="rve" className="mb-4 text-base font-semibold">Revenue vs. expenses</h2>
              {s ? <RevenueVsExpensesChart data={s.series} /> : <Skeleton className="h-64 w-full sm:h-72" />}
            </section>
            <section aria-labelledby="cats" className="rounded-lg border bg-card p-4 sm:p-5">
              <h2 id="cats" className="mb-4 text-base font-semibold">Spend by category</h2>
              {s ? (
                <ul className="space-y-4">
                  {s.categories.map((c) => (
                    <li key={c.name}>
                      <div className="flex justify-between text-sm"><span>{c.name}</span><span className="font-semibold">{c.share}%</span></div>
                      <div className="mt-1.5 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${c.share}%` }} /></div>
                    </li>
                  ))}
                </ul>
              ) : <Skeleton className="h-40 w-full" />}
            </section>
          </div>
        </>
      )}

      <section aria-labelledby="tx" className="space-y-4">
        <h2 id="tx" className="text-base font-semibold">Transactions</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search expenses" placeholder="Search by vendor or description" className="pl-9" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={category} onValueChange={(v) => { if (v) { setCategory(v as ExpenseQuery["category"]); setPage(1); } }}>
            <SelectTrigger aria-label="Filter by category" className="w-full sm:w-44"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All categories</SelectItem>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {list.status === "error" && !list.data ? <ErrorState what="your transactions" onRetry={list.refetch} />
          : list.data && list.data.total === 0 ? (
            <EmptyState title={filtering ? "No expenses match these filters" : "No expenses yet"}
              body={filtering ? "Try a different search or category." : "Expenses show up here once you record them."}
              action={filtering && <Button variant="outline" onClick={() => { setSearch(""); setCategory("all"); setPage(1); }}>Clear filters</Button>} />
          ) : (
            <>
              <ExpensesTable items={list.data?.items ?? []} loading={list.status === "loading"} pageSize={PAGE_SIZE} />
              <Pagination page={page} total={list.data?.total ?? 0} pageSize={PAGE_SIZE} onPage={setPage} />
            </>
          )}
      </section>
    </div>
  );
}
