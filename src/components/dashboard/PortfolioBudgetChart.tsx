"use client";

import { useState } from "react";
import { Card } from "@/src/components/ui/Card";
import type { PresupuestoPorPrograma } from "@/src/types/portfolio";
import { formatCurrency } from "@/src/utils/currency";

type Tooltip = {
  programa: string;
  presupuesto: number;
  ejecutado: number;
  forecast: number;
  desviacion: number;
  x: number;
  y: number;
};

export function PortfolioBudgetChart({ data }: { data: PresupuestoPorPrograma[] }) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const maxValue = Math.max(...data.flatMap((item) => [item.presupuesto, item.forecast]), 1);
  const chartHeight = 210;
  const baseline = 236;
  const groupWidth = 160;

  return (
    <Card className="p-5">
      <div className="mb-5">
        <p className="text-xs font-semibold text-[#2F80ED]">Grafico principal</p>
        <h2 className="text-base font-semibold tracking-normal text-slate-950">
          Presupuesto aprobado vs forecast por programa
        </h2>
      </div>
      <div className="relative h-80 w-full">
        <svg className="h-full w-full" viewBox="0 0 760 300" role="img" aria-label="Presupuesto aprobado vs forecast por programa">
          <defs>
            <linearGradient id="budgetGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="forecastGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4DE0D0" />
              <stop offset="100%" stopColor="#00C2A8" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = baseline - chartHeight * ratio;
            return (
              <g key={ratio}>
                <line x1="72" x2="720" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray={ratio === 0 ? "0" : "4 8"} />
                <text x="16" y={y + 4} className="fill-slate-500 text-[11px]">
                  {formatCurrency(maxValue * ratio, { compact: true })}
                </text>
              </g>
            );
          })}
          {data.map((item, index) => {
            const x = 100 + index * groupWidth;
            const budgetHeight = (item.presupuesto / maxValue) * chartHeight;
            const forecastHeight = (item.forecast / maxValue) * chartHeight;
            const budgetY = baseline - budgetHeight;
            const forecastY = baseline - forecastHeight;

            return (
              <g key={item.programa}>
                <rect
                  x={x}
                  y={budgetY}
                  width="46"
                  height={budgetHeight}
                  rx="8"
                  fill="url(#budgetGradient)"
                  className="cursor-pointer"
                  onMouseEnter={() => setTooltip({ ...item, x: x + 23, y: Math.min(budgetY, forecastY) })}
                  onMouseLeave={() => setTooltip(null)}
                />
                <rect
                  x={x + 54}
                  y={forecastY}
                  width="46"
                  height={forecastHeight}
                  rx="8"
                  fill="url(#forecastGradient)"
                  className="cursor-pointer"
                  onMouseEnter={() => setTooltip({ ...item, x: x + 77, y: Math.min(budgetY, forecastY) })}
                  onMouseLeave={() => setTooltip(null)}
                />
                <text x={x + 50} y="270" textAnchor="middle" className="fill-slate-600 text-[12px]">
                  {item.programa}
                </text>
              </g>
            );
          })}
          <g transform="translate(500 14)">
            <rect width="10" height="10" rx="2" fill="#94A3B8" />
            <text x="16" y="10" className="fill-slate-500 text-[11px]">Presupuesto</text>
            <rect x="104" width="10" height="10" rx="2" fill="#00C2A8" />
            <text x="120" y="10" className="fill-slate-500 text-[11px]">Forecast</text>
          </g>
        </svg>
        {tooltip ? (
          <div
            className="pointer-events-none absolute rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-xl"
            style={{
              left: `${(tooltip.x / 760) * 100}%`,
              top: `${(tooltip.y / 300) * 100}%`,
              transform: "translate(-50%, -115%)",
            }}
          >
            <p className="text-slate-500">{tooltip.programa}</p>
            <p className="mt-1 text-slate-950">Presupuesto: {formatCurrency(tooltip.presupuesto)}</p>
            <p className="text-slate-950">Ejecutado: {formatCurrency(tooltip.ejecutado)}</p>
            <p className="text-slate-950">Forecast: {formatCurrency(tooltip.forecast)}</p>
            <p className={tooltip.desviacion > 0 ? "text-slate-950" : "text-[#00C2A8]"}>
              Desviacion: {formatCurrency(tooltip.desviacion)}
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
