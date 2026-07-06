import { AlertCircle, CircleDollarSign, Clock3, ShieldAlert } from "lucide-react";
import { Card } from "@/src/components/ui/Card";
import type { ProyectoCalculado } from "@/src/types/portfolio";
import { calcularProgramaMayorRiesgo } from "@/src/services/portfolio-service";
import { formatCurrency } from "@/src/utils/currency";

export function AttentionPanel({ proyectos }: { proyectos: ProyectoCalculado[] }) {
  const brandGradient = "linear-gradient(90deg, #D63384, #2F80ED, #00C2A8)";
  const sinActualizar = proyectos.filter((proyecto) => !proyecto.actualizadoUltimoMesCerrado);
  const sobrePresupuesto = proyectos.filter((proyecto) => proyecto.forecast > proyecto.presupuestoAprobado);
  const consumoSuperior90 = proyectos.filter(
    (proyecto) => proyecto.ejecutadoAcumulado / proyecto.presupuestoAprobado > 0.9,
  );
  const programaMayorDesviacion = calcularProgramaMayorRiesgo(proyectos);
  const variacionTotal = sobrePresupuesto.reduce((total, proyecto) => total + Math.max(proyecto.variacion, 0), 0);

  const alerts = [
    {
      label: "Sin actualizacion",
      value: sinActualizar.length,
      detail: sinActualizar.slice(0, 2).map((proyecto) => proyecto.codigo).join(", ") || "Sin brechas",
      icon: Clock3,
    },
    {
      label: "Forecast sobre presupuesto",
      value: sobrePresupuesto.length,
      detail: formatCurrency(variacionTotal, { compact: true }),
      icon: CircleDollarSign,
    },
    {
      label: "Consumo superior al 90 %",
      value: consumoSuperior90.length,
      detail: consumoSuperior90.slice(0, 2).map((proyecto) => proyecto.codigo).join(", ") || "Controlado",
      icon: AlertCircle,
    },
    {
      label: "Mayor desviacion proyectada",
      value: programaMayorDesviacion,
      detail: "Prioridad de seguimiento",
      icon: ShieldAlert,
    },
  ];

  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute left-0 top-0 h-1 w-full" style={{ background: brandGradient }} />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-[#2F80ED] shadow-sm">
            Atencion requerida
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-normal text-slate-950">
            Prioridades de seguimiento presupuestal para el mes de corte.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Enfocate en proyectos sin actualizacion, desviaciones proyectadas y consumos cercanos al limite aprobado.
          </p>
        </div>
        <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {alerts.map((alert) => {
            const Icon = alert.icon;

            return (
              <div key={alert.label} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold leading-5 text-slate-600">{alert.label}</p>
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#2F80ED]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <p className={`mt-4 font-semibold text-slate-950 ${typeof alert.value === "string" ? "text-2xl" : "text-3xl"}`}>
                  {alert.value}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">{alert.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
