"use client";

import { useState } from "react";
import { Card } from "@/src/components/ui/Card";
import type { GastoMensual } from "@/src/types/portfolio";
import { formatCurrency } from "@/src/utils/currency";
import { nombreMes } from "@/src/utils/dates";

function pointsFor(data: GastoMensual[], key: "capex" | "opex", maxValue: number) {
  const width = 520;
  const height = 160;
  const left = 60;
  const top = 30;
  const denominator = Math.max(data.length - 1, 1);

  return data.map((item, index) => {
    const x = left + (index / denominator) * width;
    const y = top + height - (item[key] / maxValue) * height;
    return { x, y };
  });
}

function toPoints(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

export function MonthlySpendChart({ data }: { data: GastoMensual[] }) {
  const [tooltip, setTooltip] = useState<null | (GastoMensual & { x: number; y: number })>(null);
  const maxValue = Math.max(...data.map((item) => Math.max(item.capex, item.opex)), 1);
  const capexPoints = pointsFor(data, "capex", maxValue);
  const opexPoints = pointsFor(data, "opex", maxValue);

  return (
    <Card className="p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-sky-700">Evolucion mensual del gasto</p>
        <h2 className="text-lg font-semibold tracking-normal text-slate-950">Movimiento CAPEX / OPEX</h2>
      </div>
      <div className="relative h-72 w-full">
        <svg className="h-full w-full" viewBox="0 0 620 260" role="img" aria-label="Movimiento mensual CAPEX y OPEX">
          <defs>
            <linearGradient id="capexLineFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#123C69" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#123C69" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="opexLineFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#57B6D6" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#57B6D6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 0.5, 1].map((ratio) => {
            const y = 190 - 160 * ratio;
            return (
              <g key={ratio}>
                <line x1="60" x2="580" y1={y} y2={y} stroke="#e2e8f0" />
                <text x="8" y={y + 4} className="fill-slate-500 text-[11px]">
                  {formatCurrency(maxValue * ratio, { compact: true })}
                </text>
              </g>
            );
          })}
          <polygon points={`60,190 ${toPoints(capexPoints)} 580,190`} fill="url(#capexLineFill)" />
          <polygon points={`60,190 ${toPoints(opexPoints)} 580,190`} fill="url(#opexLineFill)" />
          <polyline points={toPoints(capexPoints)} fill="none" stroke="#123C69" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={toPoints(opexPoints)} fill="none" stroke="#57B6D6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {data.map((item, index) => {
            const x = 60 + (index / Math.max(data.length - 1, 1)) * 520;
            const y = 30 + 160 - (Math.max(item.capex, item.opex) / maxValue) * 160;

            return (
              <circle
                key={`${item.mes}-point`}
                cx={x}
                cy={y}
                r="9"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setTooltip({ ...item, x, y })}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
          {data.map((item, index) => {
            const showLabel = index === 0 || index === data.length - 1 || index % 3 === 0;
            const x = 60 + (index / Math.max(data.length - 1, 1)) * 520;

            return showLabel ? (
              <text key={item.mes} x={x} y="224" textAnchor="middle" className="fill-slate-500 text-[11px]">
                {nombreMes(item.mes)}
              </text>
            ) : null;
          })}
          <g transform="translate(410 12)">
            <rect width="10" height="10" rx="2" fill="#123C69" />
            <text x="16" y="10" className="fill-slate-500 text-[11px]">
              CAPEX
            </text>
            <rect x="82" width="10" height="10" rx="2" fill="#57B6D6" />
            <text x="98" y="10" className="fill-slate-500 text-[11px]">
              OPEX
            </text>
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
            <p className="text-slate-500">{nombreMes(tooltip.mes)}</p>
            <p className="mt-1 text-slate-950">CAPEX: {formatCurrency(tooltip.capex)}</p>
            <p className="text-slate-950">OPEX: {formatCurrency(tooltip.opex)}</p>
            <p className="text-slate-950">Total: {formatCurrency(tooltip.total)}</p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
