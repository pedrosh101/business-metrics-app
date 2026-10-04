import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill } from "@/components/ui/StatusPill";
import { useAsync } from "@/hooks/useAsync";
import { getVendorExpenses } from "@/services/vendors";
import type { Vendor } from "@/lib/vendor-types";
import { currency } from "@/lib/format";
import { fmtDate } from "@/lib/date";
import { contractText, vendorLabel, vendorTone } from "./VendorsTable";

export function VendorSheet({ vendor, onClose }: { vendor: Vendor | null; onClose: () => void }) {
  const recent = useAsync(() => (vendor ? getVendorExpenses(vendor.name) : Promise.resolve([])), vendor?.id ?? "none");
  return (
    <Sheet open={!!vendor} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {vendor && (
          <>
            <SheetHeader>
              <SheetTitle>{vendor.name}</SheetTitle>
              <SheetDescription>{vendor.category} vendor</SheetDescription>
            </SheetHeader>
            <div className="space-y-6 px-4 pb-6">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div><dt className="text-muted-foreground">Status</dt><dd className="mt-1"><StatusPill tone={vendorTone[vendor.status]}>{vendorLabel[vendor.status]}</StatusPill></dd></div>
                <div><dt className="text-muted-foreground">Monthly spend</dt><dd className="mt-1 text-xl font-bold">{currency(vendor.monthly)}</dd></div>
                <div><dt className="text-muted-foreground">Contract ends</dt><dd className="mt-1">{contractText(vendor)}</dd></div>
                <div><dt className="text-muted-foreground">Contact</dt><dd className="mt-1 break-all">{vendor.email}</dd></div>
              </dl>
              <section>
                <h3 className="mb-2 text-sm font-semibold">Recent payments</h3>
                {recent.data ? (
                  recent.data.length ? (
                    <ul className="divide-y">
                      {recent.data.map((e) => (
                        <li key={e.id} className="flex justify-between py-2.5 text-sm">
                          <span><span className="text-muted-foreground">{fmtDate(e.date, { month: "short", day: "numeric" })}</span>  {e.description}</span>
                          <span className="font-medium">{currency(e.amount)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
                ) : <Skeleton className="h-24 w-full" />}
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
