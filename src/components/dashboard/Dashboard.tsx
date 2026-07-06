"use client";

import { useMemo } from "react";
import { DashboardFilters } from "@/src/components/dashboard/DashboardFilters";
import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { KpiGrid } from "@/src/components/dashboard/KpiGrid";
import { AttentionPanel } from "@/src/components/dashboard/AttentionPanel";
import { MonthlySpendChart } from "@/src/components/dashboard/MonthlySpendChart";
import { PortfolioBudgetChart } from "@/src/components/dashboard/PortfolioBudgetChart";
import { ProgramRiskChart } from "@/src/components/dashboard/ProgramRiskChart";
import { ProjectsTable } from "@/src/components/dashboard/ProjectsTable";
import { gastos } from "@/src/data/gastos";
import { proyectos } from "@/src/data/proyectos";
import { usePortfolioFilters } from "@/src/hooks/usePortfolioFilters";
import {
  calcularGastoMensual,
  calcularKpis,
  calcularPortafolio,
  calcularResumenPresupuesto,
  calcularRiesgoPorPrograma,
} from "@/src/services/portfolio-service";
import { filtrarProyectos, intercalarProyectosPorPrograma } from "@/src/utils/filters";

export function Dashboard() {
  const { filtros, setFiltros } = usePortfolioFilters();

  const proyectosCalculados = useMemo(
    () => calcularPortafolio(proyectos, gastos, filtros.mesCorte),
    [filtros.mesCorte],
  );
  const proyectosFiltrados = useMemo(
    () => filtrarProyectos(proyectosCalculados, filtros),
    [proyectosCalculados, filtros],
  );
  const kpis = useMemo(() => calcularKpis(proyectosFiltrados), [proyectosFiltrados]);
  const resumenPresupuesto = useMemo(
    () => calcularResumenPresupuesto(proyectosFiltrados),
    [proyectosFiltrados],
  );
  const riesgoPorPrograma = useMemo(
    () => calcularRiesgoPorPrograma(proyectosFiltrados),
    [proyectosFiltrados],
  );
  const gastoMensual = useMemo(
    () => calcularGastoMensual(gastos, proyectosFiltrados, filtros.mesCorte),
    [proyectosFiltrados, filtros.mesCorte],
  );
  const proyectosTabla = useMemo(
    () => intercalarProyectosPorPrograma(proyectosFiltrados),
    [proyectosFiltrados],
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <DashboardHeader mesCorte={filtros.mesCorte} />
      <DashboardFilters filtros={filtros} setFiltros={setFiltros} proyectos={proyectosCalculados} />
      <main className="mx-auto grid w-full max-w-[1600px] gap-6 px-5 py-7 sm:px-8">
        <KpiGrid kpis={kpis} />
        <AttentionPanel proyectos={proyectosFiltrados} />
        <PortfolioBudgetChart data={resumenPresupuesto} />
        <section className="grid gap-5 xl:grid-cols-2">
          <ProgramRiskChart data={riesgoPorPrograma} />
          <MonthlySpendChart data={gastoMensual} />
        </section>
        <ProjectsTable proyectos={proyectosTabla} />
      </main>
    </div>
  );
}
