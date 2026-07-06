export function formatCurrency(value: number, options?: { compact?: boolean }) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
    notation: options?.compact ? "compact" : "standard",
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(value);
}
