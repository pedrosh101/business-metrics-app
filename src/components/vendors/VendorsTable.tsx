import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/StatusPill";
import type { Vendor, VendorStatus } from "@/lib/vendor-types";
import { currency } from "@/lib/format";
import { fmtDate } from "@/lib/date";

export const vendorTone = { active: "good", paused: "warn", ended: "neutral" } as const;
export const vendorLabel: Record<VendorStatus, string> = { active: "Active", paused: "Paused", ended: "Ended" };

export function contractText(v: Vendor) {
  if (v.contractEnd === null || v.daysToEnd === null) return "—";
  return `${fmtDate(v.contractEnd, { month: "short", day: "numeric", year: "numeric" })} · in ${v.daysToEnd}d`;
}
const soon = (v: Vendor) => v.status === "active" && v.daysToEnd !== null && v.daysToEnd <= 60;

interface Props { items: Vendor[]; loading: boolean; pageSize: number; onSelect: (v: Vendor) => void }

export function VendorsTable({ items, loading, pageSize, onSelect }: Props) {
  const first = loading && !items.length;
  return (
    <>
      <div className="hidden rounded-lg border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead><TableHead>Status</TableHead><TableHead>Contract ends</TableHead>
              <TableHead className="text-right">Per month</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={loading && !first ? "opacity-50 transition-opacity" : ""}>
            {first
              ? Array.from({ length: pageSize }, (_, i) => <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
              : items.map((v) => (
                  <TableRow key={v.id} tabIndex={0} onClick={() => onSelect(v)} onKeyDown={(e) => e.key === "Enter" && onSelect(v)} className="cursor-pointer">
                    <TableCell><p className="font-medium">{v.name}</p><p className="text-sm text-muted-foreground">{v.category}</p></TableCell>
                    <TableCell><StatusPill tone={vendorTone[v.status]}>{vendorLabel[v.status]}</StatusPill></TableCell>
                    <TableCell className={soon(v) ? "font-medium text-amber-700" : "text-muted-foreground"}>{contractText(v)}</TableCell>
                    <TableCell className="text-right font-medium">{currency(v.monthly)}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      <ul className="divide-y rounded-lg border bg-card md:hidden">
        {first
          ? Array.from({ length: 5 }, (_, i) => <li key={i} className="p-4"><Skeleton className="h-10 w-full" /></li>)
          : items.map((v) => (
              <li key={v.id}>
                <button onClick={() => onSelect(v)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{v.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{v.category}</p>
                  </div>
                  <div className="shrink-0 space-y-1 text-right">
                    <p className="text-sm font-medium">{currency(v.monthly)}<span className="text-muted-foreground">/mo</span></p>
                    <StatusPill tone={vendorTone[v.status]}>{vendorLabel[v.status]}</StatusPill>
                  </div>
                </button>
              </li>
            ))}
      </ul>
    </>
  );
}
