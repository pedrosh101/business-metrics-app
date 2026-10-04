import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/StatusPill";
import type { Invoice, InvoiceStatus } from "@/lib/revenue-types";
import { currency } from "@/lib/format";
import { fmtDate } from "@/lib/date";

const tone = { paid: "good", pending: "warn", overdue: "bad" } as const;
const label: Record<InvoiceStatus, string> = { paid: "Paid", pending: "Pending", overdue: "Overdue" };

export function InvoicesTable({ items, loading, pageSize }: { items: Invoice[]; loading: boolean; pageSize: number }) {
  const first = loading && !items.length;
  return (
    <>
      <div className="hidden rounded-lg border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead><TableHead>Customer</TableHead><TableHead>Issued</TableHead>
              <TableHead>Due</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={loading && !first ? "opacity-50 transition-opacity" : ""}>
            {first
              ? Array.from({ length: pageSize }, (_, i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
              : items.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.id}</TableCell>
                    <TableCell>{i.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{fmtDate(i.issued)}</TableCell>
                    <TableCell className="text-muted-foreground">{fmtDate(i.due)}</TableCell>
                    <TableCell><StatusPill tone={tone[i.status]}>{label[i.status]}</StatusPill></TableCell>
                    <TableCell className="text-right font-medium">{currency(i.amount)}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      <ul className="divide-y rounded-lg border bg-card md:hidden">
        {first
          ? Array.from({ length: 5 }, (_, i) => <li key={i} className="p-4"><Skeleton className="h-10 w-full" /></li>)
          : items.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{i.customer}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{i.id} · due {fmtDate(i.due, { month: "short", day: "numeric" })}</p>
                </div>
                <div className="shrink-0 space-y-1 text-right">
                  <p className="text-sm font-medium">{currency(i.amount)}</p>
                  <StatusPill tone={tone[i.status]}>{label[i.status]}</StatusPill>
                </div>
              </li>
            ))}
      </ul>
    </>
  );
}
