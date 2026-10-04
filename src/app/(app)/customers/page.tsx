"use client";
import { useState } from "react";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomersTable } from "@/components/customers/CustomersTable";
import { CustomerSheet } from "@/components/customers/CustomerSheet";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { getCustomers } from "@/services/customers";
import type { Customer, CustomerQuery, CustomerSort } from "@/lib/customer-types";

const PAGE_SIZE = 8;

function downloadCsv(rows: Customer[]) {
  const head = "name,email,plan,status,revenue,since";
  const body = rows.map((c) => [c.name, c.email, c.plan, c.status, c.revenue, c.since].map((v) => `"${v}"`).join(","));
  const url = URL.createObjectURL(new Blob([[head, ...body].join("\n")], { type: "text/csv" }));
  Object.assign(document.createElement("a"), { href: url, download: "customers.csv" }).click();
  URL.revokeObjectURL(url);
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CustomerQuery["status"]>("all");
  const [plan, setPlan] = useState<CustomerQuery["plan"]>("all");
  const [sort, setSort] = useState<CustomerSort>("revenue");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Customer | null>(null);

  const debounced = useDebounce(search);
  const query: CustomerQuery = { search: debounced, status: statusFilter, plan, sort, dir, page, pageSize: PAGE_SIZE };
  const { status, data, refetch } = useAsync(() => getCustomers(query), JSON.stringify(query));

  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtering = !!(debounced || statusFilter !== "all" || plan !== "all");

  const onSort = (k: CustomerSort) => {
    if (k === sort) setDir(dir === "asc" ? "desc" : "asc");
    else { setSort(k); setDir(k === "name" ? "asc" : "desc"); }
    setPage(1);
  };
  const clear = () => { setSearch(""); setStatusFilter("all"); setPlan("all"); setPage(1); };
  const exportAll = async () => downloadCsv((await getCustomers({ ...query, page: 1, pageSize: 9999 })).items);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data ? `${total} ${total === 1 ? "customer" : "customers"}` : "Loading customers…"}</p>
        </div>
        <Button variant="outline" onClick={exportAll} disabled={!total}><Download /> Export CSV</Button>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Search customers" placeholder="Search by name or email" className="pl-9"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { if (v) { setStatusFilter(v as CustomerQuery["status"]); setPage(1); } }}>
          <SelectTrigger aria-label="Filter by status" className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem><SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={plan} onValueChange={(v) => { if (v) { setPlan(v as CustomerQuery["plan"]); setPage(1); } }}>
          <SelectTrigger aria-label="Filter by plan" className="w-full sm:w-40"><SelectValue placeholder="Plan" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem><SelectItem value="Starter">Starter</SelectItem>
            <SelectItem value="Pro">Pro</SelectItem><SelectItem value="Business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {status === "error" && !data ? (
        <ErrorState what="your customers" onRetry={refetch} />
      ) : data && total === 0 ? (
        <EmptyState
          title={filtering ? "No customers match these filters" : "No customers yet"}
          body={filtering ? "Try a different search or remove a filter." : "Once customers subscribe, they'll show up here with their revenue and activity."}
          action={filtering && <Button variant="outline" onClick={clear}>Clear filters</Button>}
        />
      ) : (
        <>
          <CustomersTable items={data?.items ?? []} loading={status === "loading"} sort={sort} dir={dir} onSort={onSort} onSelect={setSelected} pageSize={PAGE_SIZE} />
          {total > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </>
      )}
      <CustomerSheet customer={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
