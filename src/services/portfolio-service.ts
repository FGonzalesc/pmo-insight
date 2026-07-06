import type {
  EvolucionPresupuestal,
  Gasto,
  GastoMensual,
  KpiPortafolio,
  NivelRiesgo,
  PresupuestoPorPrograma,
  Programa,
  Proyecto,
  ProyectoCalculado,
  RiesgoPorPrograma,
} from "@/src/types/portfolio";
import { PROGRAMAS } from "@/src/types/portfolio";
import { diferenciaMesesDesdeCorte, mesDesdeFecha, mesesEntre } from "@/src/utils/dates";

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function gastosHastaMes(gastos: Gasto[], mesCorte: string) {
  return gastos.filter((gasto) => gasto.mes <= mesCorte);
}

function maxFecha(fechas: string[]) {
  if (fechas.length === 0) return null;
  return fechas.sort().at(-1) ?? null;
}

function calcularNivelRiesgo(params: {
  presupuestoAprobado: number;
  ejecutadoAcumulado: number;
  forecast: number;
  actualizadoUltimoMesCerrado: boolean;
}): NivelRiesgo {
  const consumo = params.ejecutadoAcumulado / params.presupuestoAprobado;

  if (!params.actualizadoUltimoMesCerrado || params.forecast > params.presupuestoAprobado) {
    return "Critico";
  }

  if (consumo > 0.9) {
    return "AltoRiesgo";
  }

  if (consumo > 0.75 || params.forecast / params.presupuestoAprobado >= 0.95) {
    return "Atencion";
  }

  return "EnControl";
}

export function calcularProyecto(
  proyecto: Proyecto,
  gastos: Gasto[],
  mesCorte: string,
): ProyectoCalculado {
  const gastosProyecto = gastosHastaMes(
    gastos.filter((gasto) => gasto.codigoProyecto === proyecto.codigo),
    mesCorte,
  );
  const ejecutadoAcumulado = sum(gastosProyecto.map((gasto) => gasto.monto));
  const capexAcumulado = sum(
    gastosProyecto.filter((gasto) => gasto.tipoGasto === "CAPEX").map((gasto) => gasto.monto),
  );
  const opexAcumulado = sum(
    gastosProyecto.filter((gasto) => gasto.tipoGasto === "OPEX").map((gasto) => gasto.monto),
  );
  const mesesConGasto = new Set(gastosProyecto.map((gasto) => gasto.mes)).size;
  const promedioMensualEjecutado = mesesConGasto === 0 ? 0 : ejecutadoAcumulado / mesesConGasto;
  const mesesRestantes = diferenciaMesesDesdeCorte(mesCorte, proyecto.fechaFin);
  const forecast = ejecutadoAcumulado + promedioMensualEjecutado * mesesRestantes;
  const variacion = forecast - proyecto.presupuestoAprobado;
  const ultimaActualizacion = maxFecha(gastosProyecto.map((gasto) => gasto.actualizadoEn));
  const cierreProyecto = mesDesdeFecha(proyecto.fechaFin);
  const requiereActualizacion = cierreProyecto >= mesCorte;
  const actualizadoUltimoMesCerrado =
    !requiereActualizacion || gastosProyecto.some((gasto) => gasto.mes === mesCorte);
  const nivelRiesgo = calcularNivelRiesgo({
    presupuestoAprobado: proyecto.presupuestoAprobado,
    ejecutadoAcumulado,
    forecast,
    actualizadoUltimoMesCerrado,
  });

  return {
    ...proyecto,
    ejecutadoAcumulado,
    capexAcumulado,
    opexAcumulado,
    promedioMensualEjecutado,
    mesesRestantes,
    forecast,
    variacion,
    nivelRiesgo,
    ultimaActualizacion,
    actualizadoUltimoMesCerrado,
  };
}

export function calcularPortafolio(proyectos: Proyecto[], gastos: Gasto[], mesCorte: string) {
  return proyectos.map((proyecto) => calcularProyecto(proyecto, gastos, mesCorte));
}

export function calcularKpis(proyectos: ProyectoCalculado[]): KpiPortafolio {
  const presupuestoAprobado = sum(proyectos.map((proyecto) => proyecto.presupuestoAprobado));
  const ejecutadoAcumulado = sum(proyectos.map((proyecto) => proyecto.ejecutadoAcumulado));
  const forecastCierre = sum(proyectos.map((proyecto) => proyecto.forecast));
  const desviacionProyectada = forecastCierre - presupuestoAprobado;

  return {
    presupuestoAprobado,
    ejecutadoAcumulado,
    forecastCierre,
    desviacionProyectada,
  };
}

export function calcularRiesgoPorPrograma(proyectos: ProyectoCalculado[]): RiesgoPorPrograma[] {
  return PROGRAMAS.map((programa) => {
    const proyectosPrograma = proyectos.filter((proyecto) => proyecto.programa === programa);

    return {
      programa,
      enControl: proyectosPrograma.filter((proyecto) => proyecto.nivelRiesgo === "EnControl").length,
      atencion: proyectosPrograma.filter((proyecto) => proyecto.nivelRiesgo === "Atencion").length,
      altoRiesgo: proyectosPrograma.filter((proyecto) => proyecto.nivelRiesgo === "AltoRiesgo").length,
      critico: proyectosPrograma.filter((proyecto) => proyecto.nivelRiesgo === "Critico").length,
    };
  });
}

export function calcularGastoMensual(gastos: Gasto[], proyectos: ProyectoCalculado[], mesCorte: string) {
  const codigos = new Set(proyectos.map((proyecto) => proyecto.codigo));
  const gastosFiltrados = gastos.filter((gasto) => codigos.has(gasto.codigoProyecto) && gasto.mes <= mesCorte);
  const meses = mesesEntre("2025-06", mesCorte);

  return meses.map<GastoMensual>((mes) => {
    const gastosMes = gastosFiltrados.filter((gasto) => gasto.mes === mes);
    const capex = sum(gastosMes.filter((gasto) => gasto.tipoGasto === "CAPEX").map((gasto) => gasto.monto));
    const opex = sum(gastosMes.filter((gasto) => gasto.tipoGasto === "OPEX").map((gasto) => gasto.monto));

    return {
      mes,
      capex,
      opex,
      total: capex + opex,
    };
  });
}

export function calcularResumenPresupuesto(proyectos: ProyectoCalculado[]) {
  return PROGRAMAS.map<PresupuestoPorPrograma>((programa) => {
    const proyectosPrograma = proyectos.filter((proyecto) => proyecto.programa === programa);
    const presupuesto = sum(proyectosPrograma.map((proyecto) => proyecto.presupuestoAprobado));
    const ejecutado = sum(proyectosPrograma.map((proyecto) => proyecto.ejecutadoAcumulado));
    const forecast = sum(proyectosPrograma.map((proyecto) => proyecto.forecast));

    return {
      programa,
      presupuesto,
      ejecutado,
      forecast,
      desviacion: forecast - presupuesto,
    };
  });
}

export function calcularEvolucionPresupuestal(
  gastos: Gasto[],
  proyectos: ProyectoCalculado[],
  mesCorte: string,
) {
  const codigos = new Set(proyectos.map((proyecto) => proyecto.codigo));
  const gastosFiltrados = gastos.filter((gasto) => codigos.has(gasto.codigoProyecto) && gasto.mes <= mesCorte);
  const meses = mesesEntre("2025-06", mesCorte);
  const presupuestoReferencia = sum(proyectos.map((proyecto) => proyecto.presupuestoAprobado));
  const forecastReferencia = sum(proyectos.map((proyecto) => proyecto.forecast));
  let acumulado = 0;

  return meses.map<EvolucionPresupuestal>((mes) => {
    acumulado += sum(gastosFiltrados.filter((gasto) => gasto.mes === mes).map((gasto) => gasto.monto));

    return {
      mes,
      ejecutadoAcumulado: acumulado,
      presupuestoReferencia,
      forecastReferencia,
    };
  });
}

export function calcularProgramaMayorRiesgo(proyectos: ProyectoCalculado[]) {
  const desviacionPorPrograma = PROGRAMAS.map((programa) => {
    const proyectosPrograma = proyectos.filter((proyecto) => proyecto.programa === programa);
    const presupuesto = sum(proyectosPrograma.map((proyecto) => proyecto.presupuestoAprobado));
    const forecast = sum(proyectosPrograma.map((proyecto) => proyecto.forecast));

    return { programa, desviacion: forecast - presupuesto };
  });

  return desviacionPorPrograma.sort((a, b) => b.desviacion - a.desviacion)[0]?.programa as Programa;
}
