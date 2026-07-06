export const PROGRAMAS = [
  "Bancario",
  "No Bancario",
  "Canales",
  "Integracion",
] as const;

export const RGT = ["Run", "Grow", "Transform"] as const;

export const TIPOS_GASTO = ["OPEX", "CAPEX"] as const;

export const CATEGORIAS_OPEX = [
  "Planilla",
  "Licencias",
  "Cloud",
  "Capacitacion",
  "Soporte",
  "Consultoria",
  "Mantenimiento",
  "Servicios",
] as const;

export const CATEGORIAS_CAPEX = [
  "Implementacion tecnologica",
  "Infraestructura",
  "Servidores",
  "Equipamiento",
  "Software capitalizable",
  "Desarrollo de plataforma",
  "Integracion Core",
  "Modernizacion tecnologica",
] as const;

export type Programa = (typeof PROGRAMAS)[number];
export type Rgt = (typeof RGT)[number];
export type TipoGasto = (typeof TIPOS_GASTO)[number];
export type CategoriaOpex = (typeof CATEGORIAS_OPEX)[number];
export type CategoriaCapex = (typeof CATEGORIAS_CAPEX)[number];
export type CategoriaGasto = CategoriaOpex | CategoriaCapex;
export type NivelRiesgo = "EnControl" | "Atencion" | "AltoRiesgo" | "Critico";

export type Proyecto = {
  codigo: string;
  nombre: string;
  programa: Programa;
  rgt: Rgt;
  kr: string;
  descripcion: string;
  jefeProyecto: string;
  sponsor: string;
  fechaInicio: string;
  fechaFin: string;
  cantidadEquipo: number;
  presupuestoAprobado: number;
};

export type Gasto = {
  id: string;
  codigoProyecto: string;
  mes: string;
  tipoGasto: TipoGasto;
  categoria: CategoriaGasto;
  descripcion: string;
  monto: number;
  actualizadoEn: string;
  actualizadoPor: string;
};

export type FiltrosPortafolio = {
  programa: Programa | "Todos";
  jefeProyecto: string;
  rgt: Rgt | "Todos";
  kr: string;
  mesCorte: string;
  busqueda: string;
};

export type ProyectoCalculado = Proyecto & {
  ejecutadoAcumulado: number;
  capexAcumulado: number;
  opexAcumulado: number;
  promedioMensualEjecutado: number;
  mesesRestantes: number;
  forecast: number;
  variacion: number;
  nivelRiesgo: NivelRiesgo;
  ultimaActualizacion: string | null;
  actualizadoUltimoMesCerrado: boolean;
};

export type KpiPortafolio = {
  presupuestoAprobado: number;
  ejecutadoAcumulado: number;
  forecastCierre: number;
  desviacionProyectada: number;
};

export type RiesgoPorPrograma = {
  programa: Programa;
  enControl: number;
  atencion: number;
  altoRiesgo: number;
  critico: number;
};

export type GastoMensual = {
  mes: string;
  opex: number;
  capex: number;
  total: number;
};

export type PresupuestoPorPrograma = {
  programa: Programa;
  presupuesto: number;
  ejecutado: number;
  forecast: number;
  desviacion: number;
};

export type EvolucionPresupuestal = {
  mes: string;
  ejecutadoAcumulado: number;
  presupuestoReferencia: number;
  forecastReferencia: number;
};
