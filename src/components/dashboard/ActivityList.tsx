"use client";

import type { Activity } from "../../lib/types";
import { currency } from "../../lib/format";
import { Activity as ActivityIcon } from "lucide-react";

export function ActivityList({ items }: { items: Activity[] }) {
  if (!items.length) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <ActivityIcon className="h-5 w-5 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-foreground">No activity yet</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Payments, upgrades and new subscriptions will show up here as they happen.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {items.map((a) => (
        <li key={a.id} className="flex items-center justify-between py-3.5 transition-colors hover:bg-muted/30 px-2 rounded-lg -mx-2">
          <div>
            <p className="text-sm font-medium text-foreground">{a.customer}</p>
            <p className="text-xs text-muted-foreground">{a.event}</p>
          </div>
          
          {a.amount !== 0 && (
            <span
              className={`text-sm font-semibold tracking-tight ${
                a.amount > 0
                  ? "text-emerald-600 dark:text-emerald-500"
                  : "text-destructive"
              }`}
            >
              {a.amount > 0 ? "+" : ""}
              {currency(a.amount)}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
