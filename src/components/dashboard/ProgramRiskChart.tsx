"use client";

import { useState } from "react";
import { Card } from "@/src/components/ui/Card";
import type { RiesgoPorPrograma } from "@/src/types/portfolio";

const riskSeries = [
  { key: "enControl", label: "En control", color: "#8EDBCB" },
  { key: "atencion", label: "Atencion", color: "#D9C179" },
  { key: "altoRiesgo", label: "Alto riesgo", color: "#D6A16F" },
  { key: "critico", label: "Critico", color: "#C96B7B" },
] as const;

export function ProgramRiskChart({ data }: { data: RiesgoPorPrograma[] }) {
  const [tooltip, setTooltip] = useState<null | { label: string; value: number; x: number; y: number }>(null);
  const maxTotal = Math.max(...data.map((item) => item.enControl + item.atencion + item.altoRiesgo + item.critico), 1);
  const baseline = 210;
  const height = 170;

  return (
    <Card className="p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold text-[#2F80ED]">Estado presupuestal por programa</p>
        <h2 className="text-base font-semibold tracking-normal text-slate-950">Proyectos por estado presupuestal</h2>
      </div>
      <div className="relative h-72 w-full">
        <svg className="h-full w-full" viewBox="0 0 620 260" role="img" aria-label="Proyectos por estado presupuestal">
          {[0, 0.5, 1].map((ratio) => {
            const y = baseline - height * ratio;
            return <line key={ratio} x1="50" x2="590" y1={y} y2={y} stroke="#e2e8f0" />;
          })}
          {data.map((programa, index) => {
            const x = 78 + index * 132;
            let cursor = baseline;

            return (
              <g key={programa.programa}>
                {riskSeries.map((serie) => {
                  const value = programa[serie.key];
                  const segmentHeight = (value / maxTotal) * height;
                  cursor -= segmentHeight;

                  return (
                    <rect
                      key={serie.key}
                      x={x}
                      y={cursor}
                      width="62"
                      height={segmentHeight}
                      fill={serie.color}
                      rx={serie.key === "critico" ? 5 : 0}
                      className="cursor-pointer transition-opacity hover:opacity-80"
                      onMouseEnter={() =>
                        setTooltip({
                          label: `${programa.programa} · ${serie.label}`,
                          value,
                          x: x + 31,
                          y: cursor,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
                <text x={x + 31} y="238" textAnchor="middle" className="fill-slate-600 text-[12px]">
                  {programa.programa}
                </text>
              </g>
            );
          })}
          <g transform="translate(300 12)">
            {riskSeries.map((serie, index) => (
              <g key={serie.key} transform={`translate(${index * 78} 0)`}>
                <rect width="10" height="10" rx="2" fill={serie.color} />
                <text x="14" y="10" className="fill-slate-500 text-[10px]">
                  {serie.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
        {tooltip ? (
          <div
            className="pointer-events-none absolute rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-xl"
            style={{
              left: `${(tooltip.x / 620) * 100}%`,
              top: `${(tooltip.y / 260) * 100}%`,
              transform: "translate(-50%, -115%)",
            }}
          >
            <p className="text-slate-500">{tooltip.label}</p>
            <p className="mt-1 text-sm text-slate-950">{tooltip.value} proyectos</p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
