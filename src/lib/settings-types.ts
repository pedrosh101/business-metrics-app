export interface Settings {
  workspaceName: string;
  currency: "BRL" | "USD" | "EUR";
  fiscalStart: string; // "1".."12"
  notifyWeekly: boolean;
  notifyOverdue: boolean;
  notifyRenewals: boolean;
}
