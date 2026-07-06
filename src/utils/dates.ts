const MESES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Oct",
  "Nov",
  "Dic",
];

export function parseMes(mes: string) {
  const [year, month] = mes.split("-").map(Number);
  return { year, month };
}

export function mesDesdeFecha(fecha: string) {
  return fecha.slice(0, 7);
}

export function nombreMes(mes: string) {
  const { year, month } = parseMes(mes);
  return `${MESES[month - 1]} ${year}`;
}

export function mesesEntre(inicio: string, fin: string) {
  const meses: string[] = [];
  const start = parseMes(inicio);
  const end = parseMes(fin);
  let cursor = new Date(Date.UTC(start.year, start.month - 1, 1));
  const limit = new Date(Date.UTC(end.year, end.month - 1, 1));

  while (cursor <= limit) {
    meses.push(`${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}`);
    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1));
  }

  return meses;
}

export function diferenciaMesesDesdeCorte(mesCorte: string, fechaFin: string) {
  const corte = parseMes(mesCorte);
  const fin = parseMes(mesDesdeFecha(fechaFin));
  const diff = (fin.year - corte.year) * 12 + (fin.month - corte.month);

  return Math.max(diff, 0);
}

export function fechaCorta(fecha: string | null) {
  if (!fecha) return "Sin registro";
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
}
