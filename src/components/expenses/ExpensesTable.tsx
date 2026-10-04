import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Expense } from "@/lib/expense-types";
import { currency } from "@/lib/format";
import { fmtDate } from "@/lib/date";

export function ExpensesTable({ items, loading, pageSize }: { items: Expense[]; loading: boolean; pageSize: number }) {
  const first = loading && !items.length;
  return (
    <>
      <div className="hidden rounded-lg border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead><TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={loading && !first ? "opacity-50 transition-opacity" : ""}>
            {first
              ? Array.from({ length: pageSize }, (_, i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
              : items.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-muted-foreground">{fmtDate(e.date)}</TableCell>
                    <TableCell>{e.description}</TableCell>
                    <TableCell className="font-medium">{e.vendor}</TableCell>
                    <TableCell className="text-muted-foreground">{e.category}</TableCell>
                    <TableCell className="text-right font-medium">{currency(e.amount)}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      <ul className="divide-y rounded-lg border bg-card md:hidden">
        {first
          ? Array.from({ length: 5 }, (_, i) => <li key={i} className="p-4"><Skeleton className="h-10 w-full" /></li>)
          : items.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{e.vendor}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.category} · {fmtDate(e.date, { month: "short", day: "numeric" })}</p>
                </div>
                <span className="shrink-0 text-sm font-medium">{currency(e.amount)}</span>
              </li>
            ))}
      </ul>
    </>
  );
}
