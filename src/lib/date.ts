export const fmtDate = (iso: string, o: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) =>
  new Date(iso).toLocaleDateString("en-US", { ...o, timeZone: "UTC" });
