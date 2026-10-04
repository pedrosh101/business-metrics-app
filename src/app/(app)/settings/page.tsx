"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/States";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { useAsync } from "@/hooks/useAsync";
import { getSettings } from "@/services/settings";

export default function SettingsPage() {
  const { status, data, refetch } = useAsync(getSettings, "settings");
  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Workspace preferences and notifications.</p>
      </header>
      {status === "error" && !data ? <ErrorState what="your settings" onRetry={refetch} />
        : data ? <SettingsForm initial={data} />
        : <div className="space-y-4"><Skeleton className="h-56 w-full" /><Skeleton className="h-48 w-full" /></div>}
    </div>
  );
}
