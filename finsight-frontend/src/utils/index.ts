/* ── Currency ─────────────────────────────────────────── */
export function formatCurrency(
  amount:   number,
  currency  = "INR",
  locale    = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style:                 "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ── Dates ────────────────────────────────────────────── */
export function formatDate(dateStr: string, style: "short" | "long" = "short"): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return style === "long"
      ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
      : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  } catch {
    return dateStr;
  }
}

/* ── Month/Year helpers ────────────────────────────────── */
export function currentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

export function monthLabel(month: number, year: number): string {
  return new Date(year, month - 1, 1)
    .toLocaleString("default", { month: "long", year: "numeric" });
}

/* ── Delta label ────────────────────────────────────────── */
export function deltaLabel(delta: number | null): string {
  if (delta === null) return "—";
  const sign = delta >= 0 ? "↑" : "↓";
  return `${sign} ${Math.abs(delta)}%`;
}

/* ── API error extractor ────────────────────────────────── */
export function extractApiError(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const e = err as { response?: { data?: { message?: string } } };
    return e.response?.data?.message ?? "Something went wrong";
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
