"use client";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Customer, CustomerSort } from "@/lib/customer-types";
import { currency } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

interface Props {
  items: Customer[]; loading: boolean;
  sort: CustomerSort; dir: "asc" | "desc"; onSort: (k: CustomerSort) => void;
  onSelect: (c: Customer) => void; pageSize: number;
}
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function SortHead({ label, k, sort, dir, onSort, align = "left" }: { label: string; k: CustomerSort; sort: CustomerSort; dir: string; onSort: (k: CustomerSort) => void; align?: "left" | "right" }) {
  const Icon = sort !== k ? ChevronsUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead aria-sort={sort === k ? (dir === "asc" ? "ascending" : "descending") : "none"} className={align === "right" ? "text-right" : ""}>
      <button onClick={() => onSort(k)} className="inline-flex items-center gap-1 font-medium hover:text-foreground">
        {label} <Icon className="size-3.5 opacity-60" />
      </button>
    </TableHead>
  );
}

export function CustomersTable({ items, loading, sort, dir, onSort, onSelect, pageSize }: Props) {
  const rows = loading && !items.length;
  return (
    <>
      {/* md and up: full table */}
      <div className="hidden rounded-lg border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <SortHead label="Customer" k="name" {...{ sort, dir, onSort }} />
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <SortHead label="Customer since" k="since" {...{ sort, dir, onSort }} />
              <SortHead label="Revenue" k="revenue" align="right" {...{ sort, dir, onSort }} />
            </TableRow>
          </TableHeader>
          <TableBody className={loading && !rows ? "opacity-50 transition-opacity" : ""}>
            {rows
              ? Array.from({ length: pageSize }, (_, i) => (
                  <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ))
              : items.map((c) => (
                  <TableRow key={c.id} tabIndex={0} onClick={() => onSelect(c)}
                    onKeyDown={(e) => e.key === "Enter" && onSelect(c)} className="cursor-pointer">
                    <TableCell><p className="font-medium">{c.name}</p><p className="text-sm text-muted-foreground">{c.email}</p></TableCell>
                    <TableCell>{c.plan}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{fmtDate(c.since)}</TableCell>
                    <TableCell className="text-right font-medium">{currency(c.revenue)}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* below md: stacked list, the columns that matter most */}
      <ul className="divide-y rounded-lg border bg-card md:hidden">
        {rows
          ? Array.from({ length: 5 }, (_, i) => <li key={i} className="p-4"><Skeleton className="h-10 w-full" /></li>)
          : items.map((c) => (
              <li key={c.id}>
                <button onClick={() => onSelect(c)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">{c.plan} <StatusBadge status={c.status} /></p>
                  </div>
                  <span className="shrink-0 text-sm font-medium">{currency(c.revenue)}</span>
                </button>
              </li>
            ))}
      </ul>
    </>
  );
}
