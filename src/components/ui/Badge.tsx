import type { NivelRiesgo } from "@/src/types/portfolio";

const riskStyles: Record<NivelRiesgo, string> = {
  EnControl: "border-emerald-200/70 bg-emerald-50 text-emerald-700 shadow-emerald-100",
  Atencion: "border-amber-200/70 bg-amber-50 text-amber-700 shadow-amber-100",
  AltoRiesgo: "border-orange-200/70 bg-orange-50 text-orange-700 shadow-orange-100",
  Critico: "border-rose-200/70 bg-rose-50 text-rose-700 shadow-rose-100",
};

export function RiskBadge({ nivel }: { nivel: NivelRiesgo }) {
  const label: Record<NivelRiesgo, string> = {
    EnControl: "En control",
    Atencion: "Atencion",
    AltoRiesgo: "Alto riesgo",
    Critico: "Critico",
  };

  return (
    <span className={`inline-flex min-w-24 items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm ${riskStyles[nivel]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {label[nivel]}
    </span>
  );
}
