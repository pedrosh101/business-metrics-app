import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Customer } from "@/lib/customer-types";
import { currency } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

const fmt = (iso: string, o: Intl.DateTimeFormatOptions) => new Date(iso).toLocaleDateString("en-US", { ...o, timeZone: "UTC" });

export function CustomerSheet({ customer, onClose }: { customer: Customer | null; onClose: () => void }) {
  return (
    <Sheet open={!!customer} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {customer && (
          <>
            <SheetHeader>
              <SheetTitle>{customer.name}</SheetTitle>
              <SheetDescription>{customer.plan} customer since {fmt(customer.since, { month: "short", year: "numeric" })}</SheetDescription>
            </SheetHeader>
            <div className="space-y-6 px-4 pb-6">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Status</dt><dd className="mt-1"><StatusBadge status={customer.status} /></dd></div>
                <div><dt className="text-muted-foreground">Active subscriptions</dt><dd className="mt-1 font-medium">{customer.subscriptions}</dd></div>
                <div><dt className="text-muted-foreground">Total revenue</dt><dd className="mt-1 text-xl font-bold">{currency(customer.revenue)}</dd></div>
                <div><dt className="text-muted-foreground">Billing email</dt><dd className="mt-1 break-all">{customer.email}</dd></div>
              </dl>
              <section>
                <h3 className="mb-2 text-sm font-semibold">Activity</h3>
                <ul className="divide-y">
                  {customer.events.map((e, i) => (
                    <li key={i} className="flex items-center justify-between py-2.5 text-sm">
                      <span><span className="text-muted-foreground">{fmt(e.date, { month: "short", day: "numeric" })}</span>  {e.event}</span>
                      {e.amount > 0 && <span className="font-medium">{currency(e.amount)}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
