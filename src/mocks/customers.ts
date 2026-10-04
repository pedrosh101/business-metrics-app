import type { Customer, CustomerStatus, Plan } from "@/lib/customer-types";

const names = ["Acme Inc.","Studio Djavan","Nova Labs","Brisa Café","Orbita Log","Vértice Tech","Casa Aurora","Pixel & Co.","Mercado Sul","Lumen Films","Atlas Bikes","Jardim Verde","Chico Dog Foods","Onda Digital","Farol Cursos","Almir Lima Construtora","Alma Yoga","Sextante","Bossa Design","Trilha Viagens","Norte Seguros","Cobalto Labs","Vila Pães","Ipê Móveis","Raiz Orgânicos","Maré Surf","Quintal Kids"];
const plans: Plan[] = ["Starter", "Pro", "Business"];
const statuses: CustomerStatus[] = ["active", "active", "active", "trial", "overdue", "active", "canceled"];
const pad = (n: number) => String(n).padStart(2, "0");

export const customers: Customer[] = names.map((name, i) => {
  const plan = plans[i % 3];
  const status = statuses[i % statuses.length];
  const revenue = status === "trial" ? 0 : [1200, 8240, 12400][i % 3] + ((i * 373) % 2900);
  const monthly = Math.round(revenue / 12);
  return {
    id: `c${i + 1}`,
    name,
    email: `billing@${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    plan, status, revenue,
    since: `2025-${pad((i * 5) % 12 + 1)}-${pad((i * 7) % 27 + 1)}`,
    subscriptions: plan === "Business" ? 3 : plan === "Pro" ? 2 : 1,
    events: [
      { date: "2026-09-28", event: "Payment received", amount: monthly },
      { date: "2026-09-10", event: "Invoice sent", amount: monthly },
      { date: "2026-08-31", event: "Subscription renewed", amount: monthly },
      { date: "2026-08-12", event: status === "overdue" ? "Invoice overdue" : "Plan reviewed", amount: 0 },
    ],
  };
});
