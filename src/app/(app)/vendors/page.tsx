"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stat } from "@/components/ui/Stat";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { VendorsTable } from "@/components/vendors/VendorsTable";
import { VendorSheet } from "@/components/vendors/VendorSheet";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { getVendorSummary, getVendors } from "@/services/vendors";
import { currency } from "@/lib/format";
import type { Vendor, VendorQuery } from "@/lib/vendor-types";

const PAGE_SIZE = 8;

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<VendorQuery["category"]>("all");
  const [status, setStatus] = useState<VendorQuery["status"]>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Vendor | null>(null);

  const summary = useAsync(getVendorSummary, "summary");
  const q: VendorQuery = { search: useDebounce(search), category, status, page, pageSize: PAGE_SIZE };
  const list = useAsync(() => getVendors(q), JSON.stringify(q));
  const s = summary.data;
  const filtering = !!(q.search || category !== "all" || status !== "all");
  const clear = () => { setSearch(""); setCategory("all"); setStatus("all"); setPage(1); };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Vendors</h1>
        <p className="mt-1 text-sm text-muted-foreground">Suppliers, what you pay them, and when contracts end.</p>
      </header>

      {summary.status === "error" && !s ? (
        <ErrorState what="your vendor summary" onRetry={summary.refetch} />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Active vendors" value={s?.active} hint="Currently under contract" />
          <Stat label="Monthly spend" value={s && currency(s.monthly)} hint="Across all vendors" />
          <Stat label="Contracts ending soon" value={s?.endingSoon} hint="Within 60 days. Review before they renew." />
          <Stat label="Paused" value={s?.paused} hint="Not billing right now" />
        </div>
      )}

      <section aria-labelledby="all-vendors" className="space-y-4">
        <h2 id="all-vendors" className="sr-only">All vendors</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search vendors" placeholder="Search by vendor name" className="pl-9" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={category} onValueChange={(v) => { if (v) { setCategory(v as VendorQuery["category"]); setPage(1); } }}>
            <SelectTrigger aria-label="Filter by category" className="w-full sm:w-44"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem><SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem><SelectItem value="Operations">Operations</SelectItem><SelectItem value="Services">Services</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { if (v) { setStatus(v as VendorQuery["status"]); setPage(1); } }}>
            <SelectTrigger aria-label="Filter by status" className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem><SelectItem value="ended">Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {list.status === "error" && !list.data ? <ErrorState what="your vendors" onRetry={list.refetch} />
          : list.data && list.data.total === 0 ? (
            <EmptyState title={filtering ? "No vendors match these filters" : "No vendors yet"}
              body={filtering ? "Try a different search or remove a filter." : "Vendors you pay will be listed here with their contracts."}
              action={filtering && <Button variant="outline" onClick={clear}>Clear filters</Button>} />
          ) : (
            <>
              <VendorsTable items={list.data?.items ?? []} loading={list.status === "loading"} pageSize={PAGE_SIZE} onSelect={setSelected} />
              <Pagination page={page} total={list.data?.total ?? 0} pageSize={PAGE_SIZE} onPage={setPage} />
            </>
          )}
      </section>
      <VendorSheet vendor={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
