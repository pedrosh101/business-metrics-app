import { FileText, LayoutDashboard, Receipt, RefreshCw, Settings, TrendingUp, Truck, Users, Wallet, type LucideIcon } from "lucide-react";

export interface NavItem { href: string; label: string; icon: LucideIcon }

export const NAV: NavItem[] = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/revenue", label: "Revenue", icon: Wallet },
  { href: "/subscriptions", label: "Subscriptions", icon: RefreshCw },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/vendors", label: "Vendors", icon: Truck },
  { href: "/reports", label: "Reports", icon: FileText },
];
export const SETTINGS: NavItem = { href: "/settings", label: "Settings", icon: Settings };

export const MOBILE_PRIMARY = NAV.slice(0, 4);
export const MOBILE_MORE = [...NAV.slice(4), SETTINGS];
