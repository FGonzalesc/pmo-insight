"use client";

import { Search } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { PROGRAMAS, RGT } from "@/src/types/portfolio";
import type { FiltrosPortafolio, ProyectoCalculado } from "@/src/types/portfolio";
import { Field, Input, Select } from "@/src/components/ui/FormControls";

type DashboardFiltersProps = {
  filtros: FiltrosPortafolio;
  setFiltros: Dispatch<SetStateAction<FiltrosPortafolio>>;
  proyectos: ProyectoCalculado[];
};

export function DashboardFilters({ filtros, setFiltros, proyectos }: DashboardFiltersProps) {
  const jefesProyecto = Array.from(new Set(proyectos.map((proyecto) => proyecto.jefeProyecto))).sort();
  const krs = Array.from(new Set(proyectos.map((proyecto) => proyecto.kr))).sort();
  const mesesCorte = [
    "2025-12",
    "2026-01",
    "2026-02",
    "2026-03",
    "2026-04",
    "2026-05",
    "2026-06",
  ];

  return (
    <section className="grid gap-3 border-b border-slate-200/80 bg-white/95 px-5 py-5 shadow-sm backdrop-blur sm:px-8 xl:grid-cols-[repeat(5,minmax(0,1fr))_1.5fr]">
      <Field label="Programa">
        <Select
          value={filtros.programa}
          onChange={(event) => setFiltros((current) => ({ ...current, programa: event.target.value as FiltrosPortafolio["programa"] }))}
        >
          <option>Todos</option>
          {PROGRAMAS.map((programa) => (
            <option key={programa}>{programa}</option>
          ))}
        </Select>
      </Field>
      <Field label="Project Manager">
        <Select
          value={filtros.jefeProyecto}
          onChange={(event) => setFiltros((current) => ({ ...current, jefeProyecto: event.target.value }))}
        >
          <option>Todos</option>
          {jefesProyecto.map((jefe) => (
            <option key={jefe}>{jefe}</option>
          ))}
        </Select>
      </Field>
      <Field label="RGT">
        <Select
          value={filtros.rgt}
          onChange={(event) => setFiltros((current) => ({ ...current, rgt: event.target.value as FiltrosPortafolio["rgt"] }))}
        >
          <option>Todos</option>
          {RGT.map((rgt) => (
            <option key={rgt}>{rgt}</option>
          ))}
        </Select>
      </Field>
      <Field label="KR Banco">
        <Select
          value={filtros.kr}
          onChange={(event) => setFiltros((current) => ({ ...current, kr: event.target.value }))}
        >
          <option>Todos</option>
          {krs.map((kr) => (
            <option key={kr}>{kr}</option>
          ))}
        </Select>
      </Field>
      <Field label="Mes de corte">
        <Select
          value={filtros.mesCorte}
          onChange={(event) => setFiltros((current) => ({ ...current, mesCorte: event.target.value }))}
        >
          {mesesCorte.map((mes) => (
            <option key={mes}>{mes}</option>
          ))}
        </Select>
      </Field>
      <Field label="Buscador">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" aria-hidden />
          <Input
            className="w-full pl-9"
            placeholder="Codigo, proyecto, sponsor"
            value={filtros.busqueda}
            onChange={(event) => setFiltros((current) => ({ ...current, busqueda: event.target.value }))}
          />
        </div>
      </Field>
    </section>
  );
}
