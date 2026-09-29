"use client";
import { useCallback, useEffect, useState } from "react";
import type { DashboardMetrics, Filters } from "../lib/types";
import { getDashboardMetrics } from "../services/metrics";

type State =
  | { status: "loading"; data?: DashboardMetrics }
  | { status: "success"; data: DashboardMetrics }
  | { status: "error"; data?: DashboardMetrics };

export function useDashboardMetrics(filters: Filters) {
  const [state, setState] = useState<State>({ status: "loading" });
  const { period, channel } = filters;

  const load = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ status: "loading", data: s.data })); // keep old data visible while refetching
    getDashboardMetrics({ period, channel })
      .then((data) => !cancelled && setState({ status: "success", data }))
      .catch(() => !cancelled && setState((s) => ({ status: "error", data: s.data })));
    return () => { cancelled = true; };
  }, [period, channel]);

  useEffect(() => load(), [load]);
  return { ...state, refetch: load };
}
