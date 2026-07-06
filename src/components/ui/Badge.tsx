import type { NivelRiesgo } from "@/src/types/portfolio";

const riskStyles: Record<NivelRiesgo, string> = {
  EnControl: "border-[#8EDBCB]/60 bg-[#F2FBF9] text-[#087B6D] shadow-slate-100",
  Atencion: "border-[#D9C179]/60 bg-[#FCF8E9] text-[#836A15] shadow-slate-100",
  AltoRiesgo: "border-[#D6A16F]/60 bg-[#FCF3EA] text-[#8A551E] shadow-slate-100",
  Critico: "border-[#C96B7B]/60 bg-[#FCF0F2] text-[#933A49] shadow-slate-100",
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
