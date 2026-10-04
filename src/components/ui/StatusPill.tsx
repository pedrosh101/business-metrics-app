import { Badge } from "@/components/ui/badge";

const tones = {
  good: "bg-emerald-100 text-emerald-800",
  warn: "bg-amber-100 text-amber-800",
  bad: "bg-red-100 text-red-800",
  neutral: "bg-slate-200 text-slate-700",
};
export function StatusPill({ tone, children }: { tone: keyof typeof tones; children: React.ReactNode }) {
  return <Badge variant="secondary" className={`border-0 ${tones[tone]}`}>{children}</Badge>;
}
