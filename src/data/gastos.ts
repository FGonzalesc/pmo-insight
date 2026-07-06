import { CATEGORIAS_CAPEX, CATEGORIAS_OPEX } from "@/src/types/portfolio";
import type { CategoriaGasto, Gasto, Proyecto, TipoGasto } from "@/src/types/portfolio";
import { proyectos } from "./proyectos";

const proyectosSinActualizacionJunio = new Set(["BAN-002", "NOB-005", "CAN-006", "INT-001"]);
const proyectosConRiesgoPresupuestal = new Set([
  "BAN-001",
  "BAN-004",
  "NOB-005",
  "NOB-010",
  "CAN-001",
  "INT-001",
  "INT-002",
  "INT-005",
]);
const proyectosConConsumoMayor90 = new Set(["BAN-006", "NOB-006", "CAN-003", "CAN-004", "INT-007"]);
const proyectosEnAtencion = new Set(["BAN-003", "NOB-003", "INT-011"]);

const multiplicadoresConsumoAlto: Record<string, number> = {
  "BAN-006": 1.6,
  "NOB-006": 2,
  "CAN-003": 1.52,
  "CAN-004": 2,
  "INT-007": 1.25,
};

function parseMes(mes: string) {
  const [year, month] = mes.split("-").map(Number);
  return { year, month };
}

function toMes(year: number, month: number) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function addMonths(mes: string, increment: number) {
  const { year, month } = parseMes(mes);
  const date = new Date(Date.UTC(year, month - 1 + increment, 1));
  return toMes(date.getUTCFullYear(), date.getUTCMonth() + 1);
}

function mesDesdeFecha(fecha: string) {
  return fecha.slice(0, 7);
}

function mesesEntre(inicio: string, fin: string) {
  const meses: string[] = [];
  let cursor = inicio;

  while (cursor <= fin) {
    meses.push(cursor);
    cursor = addMonths(cursor, 1);
  }

  return meses;
}

function hash(texto: string) {
  return texto.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function roundToThousand(value: number) {
  return Math.round(value / 1000) * 1000;
}

function gastoDelMes(proyecto: Proyecto, mes: string, indiceMes: number) {
  const base = proyecto.presupuestoAprobado / 16;
  const factorPrograma = {
    Bancario: 1.04,
    "No Bancario": 0.92,
    Canales: 0.98,
    Integracion: 1.08,
  }[proyecto.programa];
  const factorRgt = {
    Run: 0.78,
    Grow: 0.95,
    Transform: 1.12,
  }[proyecto.rgt];
  const variacion = 0.82 + ((hash(`${proyecto.codigo}-${mes}`) % 17) / 100);
  const tensionPresupuestal = proyectosConRiesgoPresupuestal.has(proyecto.codigo) ? 1.32 : 1;
  const consumoAlto = proyectosConConsumoMayor90.has(proyecto.codigo)
    ? multiplicadoresConsumoAlto[proyecto.codigo]
    : 1;
  const atencion = proyectosEnAtencion.has(proyecto.codigo) ? 1.18 : 1;
  const arranque = indiceMes < 2 ? 0.7 : 1;

  return roundToThousand(
    base * factorPrograma * factorRgt * variacion * tensionPresupuestal * consumoAlto * atencion * arranque,
  );
}

function crearGasto(
  proyecto: Proyecto,
  mes: string,
  indiceMes: number,
  indiceRegistro: number,
  monto: number,
  tipoGasto: TipoGasto,
): Gasto {
  const categorias = tipoGasto === "OPEX" ? CATEGORIAS_OPEX : CATEGORIAS_CAPEX;
  const categoria = categorias[(hash(`${proyecto.codigo}-${mes}-${indiceRegistro}`) + indiceRegistro) % categorias.length];
  const dia = 8 + ((hash(`${mes}-${proyecto.codigo}-${indiceRegistro}`) + indiceMes) % 17);

  return {
    id: `${proyecto.codigo}-${mes}-${indiceRegistro + 1}`,
    codigoProyecto: proyecto.codigo,
    mes,
    tipoGasto,
    categoria: categoria as CategoriaGasto,
    descripcion:
      tipoGasto === "OPEX"
        ? `Gasto operativo de ${categoria.toLowerCase()}`
        : `Inversion en ${categoria.toLowerCase()}`,
    monto,
    actualizadoEn: `${mes}-${String(dia).padStart(2, "0")}`,
    actualizadoPor: proyecto.jefeProyecto,
  };
}

function distribuirGastoMensual(proyecto: Proyecto, mes: string, indiceMes: number) {
  const cantidadRegistros = 2 + (hash(`${proyecto.codigo}-${mes}`) % 4);
  const totalMes = gastoDelMes(proyecto, mes, indiceMes);
  const capexRatio = proyecto.rgt === "Run" ? 0.38 : proyecto.rgt === "Grow" ? 0.52 : 0.64;
  const gastos: Gasto[] = [];

  for (let index = 0; index < cantidadRegistros; index += 1) {
    const tipoGasto: TipoGasto = index / cantidadRegistros < capexRatio ? "CAPEX" : "OPEX";
    const peso = 1 + ((hash(`${proyecto.codigo}-${mes}-${index}`) % 5) / 10);
    const montoBase = totalMes / cantidadRegistros;
    const monto = index === cantidadRegistros - 1
      ? totalMes - gastos.reduce((sum, gasto) => sum + gasto.monto, 0)
      : roundToThousand(montoBase * peso);

    gastos.push(crearGasto(proyecto, mes, indiceMes, index, monto, tipoGasto));
  }

  return gastos;
}

function crearGastosProyecto(proyecto: Proyecto) {
  const inicio = mesDesdeFecha(proyecto.fechaInicio);
  const cierre = mesDesdeFecha(proyecto.fechaFin);
  const ultimoMesDatos = proyectosSinActualizacionJunio.has(proyecto.codigo) ? "2026-05" : "2026-06";
  const fin = cierre < ultimoMesDatos ? cierre : ultimoMesDatos;

  return mesesEntre(inicio, fin).flatMap((mes, indiceMes) =>
    distribuirGastoMensual(proyecto, mes, indiceMes),
  );
}

export const gastos: Gasto[] = proyectos.flatMap(crearGastosProyecto);
