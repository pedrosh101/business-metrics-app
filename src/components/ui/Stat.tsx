import { Skeleton } from "@/components/ui/skeleton";

export function Stat({ label, value, hint, loading }: { label: string; value?: React.ReactNode; hint?: React.ReactNode; loading?: boolean }) {
  return (
    <div className="rounded-lg border bg-card p-4 sm:p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      {value === undefined ? (
        <div className="mt-2 space-y-2"><Skeleton className="h-8 w-28" /><Skeleton className="h-4 w-32" /></div>
      ) : (
        <>
          <p className={`mt-1 text-xl font-bold tracking-tight sm:text-2xl ${loading ? "opacity-40" : ""}`}>{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
        </>
      )}
    </div>
  );
}
