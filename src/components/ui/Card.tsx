import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <section className={`rounded-xl border border-white/80 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.07)] ring-1 ring-slate-900/[0.03] ${className}`}>
      {children}
    </section>
  );
}
