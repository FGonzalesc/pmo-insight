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
    tone: "text-emerald-700 bg-emerald-100",
    surface: "from-emerald-50 to-white",
  },
  {
    key: "ejecutadoAcumulado",
    label: "Ejecutado acumulado",
    caption: "Consumo al mes de corte",
    icon: ChartNoAxesCombined,
    tone: "text-amber-700 bg-amber-100",
    surface: "from-amber-50 to-white",
  },
  {
    key: "forecastCierre",
    label: "Forecast de cierre",
    caption: "Proyeccion estimada",
    icon: TrendingUp,
    tone: "text-sky-700 bg-sky-100",
    surface: "from-sky-50 to-white",
  },
  {
    key: "desviacionProyectada",
    label: "Desviacion proyectada",
    caption: "Forecast menos presupuesto",
    icon: Activity,
    tone: "text-orange-700 bg-orange-100",
    surface: "from-orange-50 to-white",
  },
] as const;

export function KpiGrid({ kpis }: { kpis: KpiPortafolio }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {kpiConfig.map((item) => {
        const Icon = item.icon;
        const value = formatCurrency(kpis[item.key], { compact: true });

        return (
          <Card key={item.key} className={`overflow-hidden bg-gradient-to-br ${item.surface} p-6`}>
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-slate-600">{item.label}</p>
                <p className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">{value}</p>
                <p className="mt-2 text-xs font-medium text-slate-500">{item.caption}</p>
              </div>
              <span className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-white/70 ${item.tone}`}>
                <Icon className="h-7 w-7" aria-hidden />
              </span>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
