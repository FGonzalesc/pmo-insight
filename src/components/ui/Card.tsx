import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <section className={`rounded-xl border border-slate-200/70 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.045)] ring-1 ring-slate-900/[0.02] ${className}`}>
      {children}
    </section>
  );
}
