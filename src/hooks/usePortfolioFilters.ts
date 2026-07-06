"use client";

import { useState } from "react";
import type { FiltrosPortafolio } from "@/src/types/portfolio";

export const DEFAULT_MES_CORTE = "2026-06";

export function usePortfolioFilters() {
  const [filtros, setFiltros] = useState<FiltrosPortafolio>({
    programa: "Todos",
    jefeProyecto: "Todos",
    rgt: "Todos",
    kr: "Todos",
    mesCorte: DEFAULT_MES_CORTE,
    busqueda: "",
  });

  return {
    filtros,
    setFiltros,
  };
}
