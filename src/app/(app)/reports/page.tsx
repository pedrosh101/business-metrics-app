"use client";
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { reportTypes, scheduledReports } from "@/mocks/reports";
import { generateReport } from "@/services/reports";
import { downloadFile } from "@/lib/csv";
import type { ReportPeriod, ReportType, ScheduledReport } from "@/lib/report-types";

export default function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>("12m");
  const [busy, setBusy] = useState<ReportType | null>(null);
  const [failed, setFailed] = useState(false);
  const [scheduled, setScheduled] = useState<ScheduledReport[]>(scheduledReports);

  const download = async (type: ReportType) => {
    setBusy(type); setFailed(false);
    try { const r = await generateReport(type, period); downloadFile(r.filename, r.csv); }
    catch { setFailed(true); }
    finally { setBusy(null); }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">Download your numbers as CSV, or have them sent on a schedule.</p>
        </div>
        <Select value={period} onValueChange={(v) => v && setPeriod(v as ReportPeriod)}>
          <SelectTrigger aria-label="Period" className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="6m">Last 6 months</SelectItem><SelectItem value="12m">Last 12 months</SelectItem></SelectContent>
        </Select>
      </header>

      {failed && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">We couldn&apos;t prepare that report. Please try again.</p>}

      <section aria-labelledby="library" className="space-y-3">
        <h2 id="library" className="text-base font-semibold">Report library</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((r) => (
            <li key={r.id} className="flex flex-col justify-between gap-4 rounded-lg border bg-card p-4 sm:p-5">
              <div>
                <h3 className="font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">{r.usesPeriod ? "Uses the selected period" : "Includes all records"}</p>
              </div>
              <Button variant="outline" className="w-full sm:w-fit" disabled={busy !== null} onClick={() => download(r.id)}>
                <Download /> {busy === r.id ? "Preparing…" : "Download CSV"}
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="scheduled" className="space-y-3">
        <div>
          <h2 id="scheduled" className="text-base font-semibold">Scheduled reports</h2>
          <p className="text-sm text-muted-foreground">Preview only: schedules are saved on this page and no emails are sent yet.</p>
        </div>
        <ul className="divide-y rounded-lg border bg-card">
          {scheduled.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <Label htmlFor={s.id} className="font-medium">{s.name}</Label>
                <p className="mt-1 truncate text-sm text-muted-foreground">{s.frequency} · {s.recipients}</p>
              </div>
              <Switch id={s.id} checked={s.enabled} onCheckedChange={(v) => setScheduled(scheduled.map((x) => (x.id === s.id ? { ...x, enabled: v } : x)))} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
