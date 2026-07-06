import type { FiltrosPortafolio, ProyectoCalculado } from "@/src/types/portfolio";
import { PROGRAMAS } from "@/src/types/portfolio";

export function filtrarProyectos(proyectos: ProyectoCalculado[], filtros: FiltrosPortafolio) {
  const busqueda = filtros.busqueda.trim().toLowerCase();

  return proyectos.filter((proyecto) => {
    const coincidePrograma = filtros.programa === "Todos" || proyecto.programa === filtros.programa;
    const coincideJefe = filtros.jefeProyecto === "Todos" || proyecto.jefeProyecto === filtros.jefeProyecto;
    const coincideRgt = filtros.rgt === "Todos" || proyecto.rgt === filtros.rgt;
    const coincideKr = filtros.kr === "Todos" || proyecto.kr === filtros.kr;
    const coincideBusqueda =
      busqueda.length === 0 ||
      [
        proyecto.codigo,
        proyecto.nombre,
        proyecto.programa,
        proyecto.jefeProyecto,
        proyecto.sponsor,
      ].some((value) => value.toLowerCase().includes(busqueda));

    return coincidePrograma && coincideJefe && coincideRgt && coincideKr && coincideBusqueda;
  });
}

export function intercalarProyectosPorPrograma(proyectos: ProyectoCalculado[]) {
  const grupos = PROGRAMAS.map((programa) => ({
    programa,
    proyectos: proyectos.filter((proyecto) => proyecto.programa === programa),
  }));
  const maxLength = Math.max(...grupos.map((grupo) => grupo.proyectos.length), 0);
  const intercalados: ProyectoCalculado[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    grupos.forEach((grupo) => {
      const proyecto = grupo.proyectos[index];
      if (proyecto) {
        intercalados.push(proyecto);
      }
    });
  }

  return intercalados;
}
