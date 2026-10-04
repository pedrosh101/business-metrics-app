"use client";
import { useEffect, useRef, useState } from "react";

/** Generic loader. `key` must change whenever the request inputs change. Keeps the previous data while refetching. */
export function useAsync<T>(fn: () => Promise<T>, key: string) {
  const [state, setState] = useState<{ status: "loading" | "success" | "error"; data?: T }>({ status: "loading" });
  const [tick, setTick] = useState(0);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ status: "loading", data: s.data }));
    fnRef.current()
      .then((data) => !cancelled && setState({ status: "success", data }))
      .catch(() => !cancelled && setState((s) => ({ status: "error", data: s.data })));
    return () => { cancelled = true; };
  }, [key, tick]);

  return { ...state, refetch: () => setTick((t) => t + 1) };
}
