export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded bg-line ${className}`} />;
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-line px-6 py-14 text-center">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ what, onRetry }: { what: string; onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-bad/30 bg-bad/5 px-6 py-8">
      <h2 className="text-base font-semibold text-bad">We couldn't load {what}</h2>
      <p className="mt-1 text-sm text-muted">Check your connection and try again. Your data is safe.</p>
      <button onClick={onRetry} className="mt-4 rounded-md bg-pine px-4 py-2 text-sm font-semibold text-white hover:bg-pine-soft">
        Try again
      </button>
    </div>
  );
}
