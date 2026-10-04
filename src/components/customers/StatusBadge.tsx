import { Badge } from "@/components/ui/badge";
import type { CustomerStatus } from "@/lib/customer-types";

const styles: Record<CustomerStatus, string> = {
  active: "bg-emerald-100 text-emerald-800",
  trial: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-red-800",
  canceled: "bg-slate-200 text-slate-700",
};
const labels: Record<CustomerStatus, string> = { active: "Active", trial: "Trial", overdue: "Overdue", canceled: "Canceled" };

export function StatusBadge({ status }: { status: CustomerStatus }) {
  return <Badge variant="secondary" className={`border-0 ${styles[status]}`}>{labels[status]}</Badge>;
}
