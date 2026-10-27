"use client";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/States";
import type { Profile } from "@/lib/profile-types";
import { useProfile } from "./ProfileProvider";
import { UserAvatar } from "./UserAvatar";

type Errors = Partial<Record<keyof Profile, string>>;

function validate(f: Profile): Errors {
  const e: Errors = {};
  if (f.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (f.phone && !/^[+()\d\s-]{8,}$/.test(f.phone.trim())) e.phone = "Enter a valid phone number.";
  return e;
}

function Field({ id, label, value, onChange, error, type = "text", autoComplete }: {
  id: string; label: string; value: string; onChange: (v: string) => void; error?: string; type?: string; autoComplete?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
      {error && <p id={`${id}-error`} className="text-sm text-red-700">{error}</p>}
    </div>
  );
}

function ProfileBody({ profile }: { profile: Profile }) {
  const { save } = useProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const set = (k: keyof Profile) => (v: string) => setForm({ ...form, [k]: v });

  const startEdit = () => { setForm(profile); setErrors({}); setState("idle"); setEditing(true); };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("saving");
    try {
      await save({ fullName: form.fullName.trim(), email: form.email.trim(), jobTitle: form.jobTitle.trim(), phone: form.phone.trim() });
      setEditing(false); setState("saved");
    } catch { setState("error"); }
  };

  if (editing)
    return (
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field id="p-name" label="Full name" value={form.fullName} onChange={set("fullName")} error={errors.fullName} autoComplete="name" />
        <Field id="p-email" label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
        <Field id="p-title" label="Job title" value={form.jobTitle} onChange={set("jobTitle")} autoComplete="organization-title" />
        <Field id="p-phone" label="Phone" type="tel" value={form.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
        {state === "error" && <p role="alert" className="text-sm text-red-700">Couldn't save your changes. Please try again.</p>}
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={() => setEditing(false)} disabled={state === "saving"}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={state === "saving"}>{state === "saving" ? "Saving…" : "Save changes"}</Button>
        </div>
      </form>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <UserAvatar name={profile.fullName} className="size-16 text-xl" />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{profile.fullName}</p>
          <p className="truncate text-sm text-muted-foreground">{profile.jobTitle || "No job title"}</p>
        </div>
      </div>
      <dl className="divide-y rounded-lg border bg-card text-sm">
        {([["Email", profile.email], ["Job title", profile.jobTitle], ["Phone", profile.phone]] as const).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="min-w-0 break-all text-right font-medium">{v || "—"}</dd>
          </div>
        ))}
      </dl>
      <p aria-live="polite" className="min-h-5 text-sm text-emerald-700">{state === "saved" && "Profile updated"}</p>
      <Button variant="outline" className="w-full" onClick={startEdit}><Pencil /> Edit profile</Button>
    </div>
  );
}

export function ProfileSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { profile, status, refetch } = useProfile();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your profile</SheetTitle>
          <SheetDescription>View and update your personal information.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">
          {profile ? <ProfileBody profile={profile} />
            : status === "error" ? <ErrorState what="your profile" onRetry={refetch} />
            : <div className="space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-36 w-full" /></div>}
        </div>
      </SheetContent>
    </Sheet>
  );
}
