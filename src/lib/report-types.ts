export type ReportType = "monthly" | "revenue" | "customers" | "subscriptions" | "expenses";
export type ReportPeriod = "6m" | "12m";
export interface ReportMeta { id: ReportType; title: string; description: string; usesPeriod: boolean }
export interface ScheduledReport { id: string; name: string; frequency: string; recipients: string; enabled: boolean }
