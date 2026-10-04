"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { saveSettings } from "@/services/settings";
import type { Settings } from "@/lib/settings-types";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const TOGGLES: { key: "notifyWeekly" | "notifyOverdue" | "notifyRenewals"; label: string; hint: string }[] = [
  { key: "notifyWeekly", label: "Weekly summary", hint: "A short recap of revenue and churn every Monday." },
  { key: "notifyOverdue", label: "Overdue invoices", hint: "Get alerted when an invoice passes its due date." },
  { key: "notifyRenewals", label: "Upcoming renewals", hint: "A heads-up 7 days before a subscription renews." },
];

export function SettingsForm({ initial }: { initial: Settings }) {
  const [saved, setSaved] = useState(initial);
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => { setForm({ ...form, [k]: v }); setState("idle"); };

  const onSave = async () => {
    setState("saving");
    try { const s = await saveSettings(form); setSaved(s); setForm(s); setState("saved"); }
    catch { setState("error"); }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Workspace</CardTitle><CardDescription>How your business appears across the app and in reports.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Workspace name</Label>
            <Input id="name" value={form.workspaceName} onChange={(e) => set("workspaceName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={form.currency} onValueChange={(v) => v && set("currency", v as Settings["currency"])}>
              <SelectTrigger id="currency" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="BRL">Brazilian real (R$)</SelectItem><SelectItem value="USD">US dollar ($)</SelectItem><SelectItem value="EUR">Euro (€)</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fiscal">Fiscal year starts in</Label>
            <Select value={form.fiscalStart} onValueChange={(v) => v && set("fiscalStart", v)}>
              <SelectTrigger id="fiscal" className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{MONTHS.map((m, i) => <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Notifications</CardTitle><CardDescription>Choose what is worth an email.</CardDescription></CardHeader>
        <CardContent className="divide-y">
          {TOGGLES.map((t) => (
            <div key={t.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div><Label htmlFor={t.key}>{t.label}</Label><p className="text-sm text-muted-foreground">{t.hint}</p></div>
              <Switch id={t.key} checked={form[t.key]} onCheckedChange={(v) => set(t.key, v)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <span aria-live="polite" className={`text-sm ${state === "error" ? "text-red-700" : "text-muted-foreground"}`}>
          {state === "saved" && "Changes saved"}{state === "error" && "Couldn't save. Try again."}
        </span>
        <Button onClick={onSave} disabled={!dirty || state === "saving"}>{state === "saving" ? "Saving…" : "Save changes"}</Button>
      </div>
    </div>
  );
}
