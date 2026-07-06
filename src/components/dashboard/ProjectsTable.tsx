"use client";

import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { RiskBadge } from "@/src/components/ui/Badge";
import { Card } from "@/src/components/ui/Card";
import type { ProyectoCalculado } from "@/src/types/portfolio";
import { formatCurrency } from "@/src/utils/currency";
import { fechaCorta } from "@/src/utils/dates";

const PAGE_SIZE = 5;

export function ProjectsTable({ proyectos }: { proyectos: ProyectoCalculado[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(Math.ceil(proyectos.length / PAGE_SIZE), 1);
  const activePage = Math.min(page, totalPages);
  const start = (activePage - 1) * PAGE_SIZE;
  const visibleProjects = useMemo(
    () => proyectos.slice(start, start + PAGE_SIZE),
    [proyectos, start],
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-200/80 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-sky-700">Tabla de proyectos</p>
          <h2 className="text-xl font-semibold tracking-normal text-slate-950">Detalle presupuestal de proyectos</h2>
        </div>
        <div className="text-sm font-medium text-slate-500">
          {proyectos.length} proyectos filtrados
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1360px] w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50/80 text-[11px] uppercase tracking-normal text-slate-500">
            <tr>
              {[
                "Codigo",
                "Proyecto",
                "Programa",
                "Project Manager",
                "RGT",
                "KR Banco",
                "Presupuesto aprobado",
                "Ejecutado",
                "Forecast",
                "Desviacion proyectada",
                "Estado presupuestal",
                "Ultima actualizacion",
                "Accion",
              ].map((header) => (
                <th key={header} className="border-b border-slate-200/80 px-4 py-4 font-bold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {visibleProjects.map((proyecto) => (
              <tr key={proyecto.codigo} className="transition hover:bg-sky-50/40">
                <td className="px-4 py-5 font-semibold text-slate-800">{proyecto.codigo}</td>
                <td className="max-w-72 px-4 py-4">
                  <p className="font-medium text-slate-900">{proyecto.nombre}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{proyecto.descripcion}</p>
                </td>
                <td className="px-4 py-4 text-slate-600">{proyecto.programa}</td>
                <td className="px-4 py-4 text-slate-600">{proyecto.jefeProyecto}</td>
                <td className="px-4 py-4 text-slate-600">{proyecto.rgt}</td>
                <td className="max-w-48 px-4 py-4 text-slate-600">{proyecto.kr}</td>
                <td className="px-4 py-4 text-slate-700">{formatCurrency(proyecto.presupuestoAprobado)}</td>
                <td className="px-4 py-4 text-slate-700">{formatCurrency(proyecto.ejecutadoAcumulado)}</td>
                <td className="px-4 py-4 text-slate-700">{formatCurrency(proyecto.forecast)}</td>
                <td className={`px-4 py-4 font-medium ${proyecto.variacion > 0 ? "text-rose-700" : "text-emerald-700"}`}>
                  {formatCurrency(proyecto.variacion)}
                </td>
                <td className="px-4 py-4">
                  <RiskBadge nivel={proyecto.nivelRiesgo} />
                </td>
                <td className="px-4 py-4 text-slate-600">{fechaCorta(proyecto.ultimaActualizacion)}</td>
                <td className="px-4 py-4">
                  <Button aria-label={`Editar gastos de ${proyecto.codigo}`} title="Editar gastos">
                    <Pencil className="h-4 w-4" aria-hidden />
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200/80 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">
          Mostrando {proyectos.length === 0 ? 0 : start + 1}-{Math.min(start + PAGE_SIZE, proyectos.length)} de {proyectos.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            className="h-9 w-9 px-0"
            disabled={activePage === 1}
            aria-label="Pagina anterior"
            onClick={() => setPage((current) => Math.max(Math.min(current, totalPages) - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Button>
          <span className="min-w-20 text-center text-sm font-semibold text-slate-600">
            {activePage} / {totalPages}
          </span>
          <Button
            className="h-9 w-9 px-0"
            disabled={activePage === totalPages}
            aria-label="Pagina siguiente"
            onClick={() => setPage((current) => Math.min(Math.min(current, totalPages) + 1, totalPages))}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </Card>
  );
}
