import { Activity, Banknote, ChartNoAxesCombined, TrendingUp } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import type { KpiPortafolio } from "@/src/types/portfolio";
import { formatCurrency } from "@/src/utils/currency";

const kpiConfig = [
  {
    key: "presupuestoAprobado",
    label: "Presupuesto aprobado",
    caption: "Linea base del portafolio",
    icon: Banknote,
  },
  {
    key: "ejecutadoAcumulado",
    label: "Ejecutado acumulado",
    caption: "Consumo al mes de corte",
    icon: ChartNoAxesCombined,
  },
  {
    key: "forecastCierre",
    label: "Forecast de cierre",
    caption: "Proyeccion estimada",
    icon: TrendingUp,
  },
  {
    key: "desviacionProyectada",
    label: "Desviacion proyectada",
    caption: "Forecast menos presupuesto",
    icon: Activity,
  },
] as const;

export function KpiGrid({ kpis }: { kpis: KpiPortafolio }) {
  const brandGradient = "linear-gradient(90deg, #D63384, #2F80ED, #00C2A8)";

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpiConfig.map((item) => {
        const Icon = item.icon;
        const value = formatCurrency(kpis[item.key], { compact: true });

        return (
          <Card key={item.key} className="relative overflow-hidden p-6">
            <div className="absolute left-0 top-0 h-1 w-full" style={{ background: brandGradient }} />
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-slate-600">{item.label}</p>
                <p className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">{value}</p>
                <p className="mt-2 text-xs font-medium text-slate-500">{item.caption}</p>
              </div>
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-[#2F80ED] shadow-sm">
                <Icon className="h-7 w-7" aria-hidden />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
