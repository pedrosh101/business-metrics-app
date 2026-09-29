import type { Kpi } from "../../lib/types";
import { formatKpi } from "../../lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function Change({ kpi }: { kpi: Kpi }) {
  const up = kpi.change > 0;
  const good = kpi.goodWhenDown ? !up : up;

  return (
    <span
      className={`text-sm font-semibold flex items-center gap-0.5 ${
        good 
          ? "text-emerald-600 dark:text-emerald-500" 
          : "text-destructive"
      }`}
    >
      {up ? "↑" : "↓"} {Math.abs(kpi.change).toFixed(1)}%
      <span className="sr-only"> versus previous period</span>
    </span>
  );
}

export function KpiStrip({ kpis, loading }: { kpis?: Kpi[]; loading: boolean }) {
  const items: (Kpi | undefined)[] = kpis ?? [undefined, undefined, undefined, undefined];

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((k, i) => (
        <Card 
          key={k?.id ?? i} 
          className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
        >
          <CardContent className="p-6">
            {k ? (
              <>
                <dt className="text-sm font-medium text-muted-foreground">
                  {k.label}
                </dt>
                
                <dd className="mt-2 flex items-baseline gap-3">
                  <span 
                    className={`text-3xl font-bold tracking-tight transition-opacity duration-200 ${
                      loading ? "opacity-40" : ""
                    }`}
                  >
                    {formatKpi(k)}
                  </span>
                  <Change kpi={k} />
                </dd>
                
                <p className="mt-2 text-xs text-muted-foreground leading-normal">
                  {k.insight}
                </p>
              </>
            ) : (
              <div className="space-y-3">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-8 w-36 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </dl>
  );
}
