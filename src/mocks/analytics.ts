import type { Metric } from "@/lib/analytics-types";

export const MONTHS = ["Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep"];

export const analyticsMock: Record<Metric, {
  format: "currency" | "number" | "percent"; current: number[]; prevFactor: number;
  goodWhenDown?: boolean; total: "sum" | "last"; insight: string;
  breakdownTitle: string; breakdown: { name: string; share: number }[];
}> = {
  revenue: {
    format: "currency", total: "sum", prevFactor: 0.88,
    current: [61,64,70,68,77,83,80,91,96,104,112,128].map((n) => n * 1000),
    insight: "Business plans drove most of the growth, helped by 18 new subscriptions.",
    breakdownTitle: "Revenue by plan",
    breakdown: [{ name: "Business", share: 42 }, { name: "Pro", share: 31 }, { name: "Starter", share: 18 }, { name: "Add-ons", share: 9 }],
  },
  customers: {
    format: "number", total: "last", prevFactor: 0.9,
    current: [820,850,880,905,940,985,1020,1070,1120,1170,1230,1284],
    insight: "Growth is steady. Referrals brought in the largest share of new customers.",
    breakdownTitle: "Customers by region",
    breakdown: [{ name: "Southeast", share: 46 }, { name: "South", share: 24 }, { name: "Northeast", share: 18 }, { name: "Other", share: 12 }],
  },
  subscriptions: {
    format: "number", total: "last", prevFactor: 0.9,
    current: [310,322,335,341,360,378,390,412,431,455,478,502],
    insight: "Annual plans are growing faster than monthly ones.",
    breakdownTitle: "Subscriptions by billing cycle",
    breakdown: [{ name: "Monthly", share: 58 }, { name: "Annual", share: 34 }, { name: "Quarterly", share: 8 }],
  },
  churn: {
    format: "percent", total: "last", prevFactor: 1.15, goodWhenDown: true,
    current: [3.6,3.5,3.4,3.5,3.3,3.1,3.0,2.9,2.8,2.7,2.6,2.4],
    insight: "Churn has fallen for six months in a row. Price is still the top reason to cancel.",
    breakdownTitle: "Why customers cancel",
    breakdown: [{ name: "Price", share: 38 }, { name: "Missing feature", share: 27 }, { name: "Switched tool", share: 21 }, { name: "Other", share: 14 }],
  },
};
