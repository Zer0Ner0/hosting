// frontend/src/lib/format.ts
export function fmtDateMY(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Kuala_Lumpur", // avoid server/client TZ drift
  }).format(d);
}
