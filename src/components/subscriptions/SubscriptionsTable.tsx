"use client";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/StatusPill";
import type { SubSort, SubStatus, Subscription } from "@/lib/subscription-types";
import { currency } from "@/lib/format";
import { fmtDate } from "@/lib/date";

const tone = { active: "good", trialing: "warn", past_due: "bad", canceled: "neutral" } as const;
const label: Record<SubStatus, string> = { active: "Active", trialing: "Trial", past_due: "Past due", canceled: "Canceled" };

function renewalText(s: Subscription) {
  if (s.renewal === null || s.daysToRenewal === null) return "—";
  const d = s.daysToRenewal;
  if (d < 0) return `${-d} ${-d === 1 ? "day" : "days"} overdue`;
  return d === 0 ? "Today" : `${fmtDate(s.renewal, { month: "short", day: "numeric" })} · in ${d}d`;
}

interface Props { items: Subscription[]; loading: boolean; pageSize: number; sort: SubSort; dir: "asc" | "desc"; onSort: (k: SubSort) => void }

function Head({ text, k, right, sort, dir, onSort }: { text: string; k: SubSort; right?: boolean } & Pick<Props, "sort" | "dir" | "onSort">) {
  const Icon = sort !== k ? ChevronsUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead className={right ? "text-right" : ""} aria-sort={sort === k ? (dir === "asc" ? "ascending" : "descending") : "none"}>
      <button onClick={() => onSort(k)} className="inline-flex items-center gap-1 font-medium hover:text-foreground">{text} <Icon className="size-3.5 opacity-60" /></button>
    </TableHead>
  );
}

export function SubscriptionsTable({ items, loading, pageSize, sort, dir, onSort }: Props) {
  const first = loading && !items.length;
  return (
    <>
      <div className="hidden rounded-lg border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <Head text="Customer" k="customer" {...{ sort, dir, onSort }} />
              <TableHead>Plan</TableHead><TableHead>Status</TableHead>
              <Head text="Next renewal" k="renewal" {...{ sort, dir, onSort }} />
              <Head text="Per month" k="amount" right {...{ sort, dir, onSort }} />
            </TableRow>
          </TableHeader>
          <TableBody className={loading && !first ? "opacity-50 transition-opacity" : ""}>
            {first
              ? Array.from({ length: pageSize }, (_, i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
              : items.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.customer}</TableCell>
                    <TableCell>{s.plan} <span className="text-muted-foreground">· {s.cycle}</span></TableCell>
                    <TableCell><StatusPill tone={tone[s.status]}>{label[s.status]}</StatusPill></TableCell>
                    <TableCell className={s.status === "past_due" ? "font-medium text-red-700" : "text-muted-foreground"}>{renewalText(s)}</TableCell>
                    <TableCell className="text-right font-medium">{currency(s.monthly)}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      <ul className="divide-y rounded-lg border bg-card md:hidden">
        {first
          ? Array.from({ length: 5 }, (_, i) => <li key={i} className="p-4"><Skeleton className="h-10 w-full" /></li>)
          : items.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.customer}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.plan} · {renewalText(s)}</p>
                </div>
                <div className="shrink-0 space-y-1 text-right">
                  <p className="text-sm font-medium">{currency(s.monthly)}<span className="text-muted-foreground">/mo</span></p>
                  <StatusPill tone={tone[s.status]}>{label[s.status]}</StatusPill>
                </div>
              </li>
            ))}
      </ul>
    </>
  );
}
