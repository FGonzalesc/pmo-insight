import { CalendarDays, SlidersHorizontal } from "lucide-react";
import { nombreMes } from "@/src/utils/dates";

export function DashboardHeader({ mesCorte }: { mesCorte: string }) {
  return (
    <header className="flex flex-col gap-5 border-b border-slate-200/80 bg-white px-5 py-6 sm:px-8 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
          Control Presupuestal del Portafolio TI
        </h1>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Seguimiento ejecutivo del presupuesto aprobado, ejecucion acumulada, desviaciones y forecast de proyectos TI.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm">
          <CalendarDays className="h-4 w-4 text-sky-700" aria-hidden />
          Mes de corte: {nombreMes(mesCorte)}
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm">
          <SlidersHorizontal className="h-4 w-4 text-sky-700" aria-hidden />
          Filtros
        </button>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Última actualización: 01/07/2026 09:30 AM
        </div>
      </div>
    </header>
  );
}
