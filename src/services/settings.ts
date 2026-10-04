import type { Settings } from "@/lib/settings-types";

let stored: Settings = {
  workspaceName: "My Company", currency: "BRL", fiscalStart: "1",
  notifyWeekly: true, notifyOverdue: true, notifyRenewals: false,
};

/** Swap for GET/PUT /api/settings when the backend exists. */
export async function getSettings(): Promise<Settings> {
  await new Promise((r) => setTimeout(r, 400));
  return { ...stored };
}
export async function saveSettings(next: Settings): Promise<Settings> {
  await new Promise((r) => setTimeout(r, 600));
  stored = { ...next };
  return { ...stored };
}
