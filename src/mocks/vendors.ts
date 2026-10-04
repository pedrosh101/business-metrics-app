import type { Vendor, VendorCategory, VendorStatus } from "@/lib/vendor-types";
import { TODAY } from "./subscriptions";

const DAY = 86400000;
const raw: [string, VendorCategory, VendorStatus, number, number | null][] = [
  ["Stackly Cloud", "Software", "active", 4200, 210], ["Pulse CRM", "Software", "active", 1800, 38], ["Docuflow", "Software", "active", 640, 300],
  ["Orbit Ads", "Marketing", "active", 6500, 95], ["Brand Lab", "Marketing", "paused", 3200, 150], ["Mailwave", "Marketing", "active", 980, 52],
  ["Nortec Logistics", "Operations", "active", 5400, 180], ["OfficeHub", "Operations", "active", 2800, 45], ["CleanCo", "Operations", "ended", 900, null],
  ["Barros & Lima Advisory", "Services", "active", 2400, 260], ["Faro Legal", "Services", "active", 1600, 120], ["Contabil+", "Services", "active", 1900, 365],
];

export const vendors: Vendor[] = raw.map(([name, category, status, monthly, days], i) => ({
  id: `v${i + 1}`, name, category, status, monthly,
  email: `contact@${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
  daysToEnd: days,
  contractEnd: days === null ? null : new Date(TODAY + days * DAY).toISOString().slice(0, 10),
}));
