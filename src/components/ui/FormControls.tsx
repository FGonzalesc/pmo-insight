import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

type FieldProps = {
  label: string;
  children: ReactNode;
};

export function Field({ label, children }: FieldProps) {
  return (
    <label className="group grid gap-2 text-[11px] font-semibold uppercase text-slate-500">
      <span className="tracking-normal">{label}</span>
      {children}
    </label>
  );
}

export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`h-11 min-w-0 rounded-lg border border-slate-200/80 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition hover:border-[#2F80ED]/40 focus:border-[#2F80ED] focus:bg-white focus:ring-4 focus:ring-[#2F80ED]/10 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-11 min-w-0 rounded-lg border border-slate-200/80 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-[#2F80ED]/40 focus:border-[#2F80ED] focus:bg-white focus:ring-4 focus:ring-[#2F80ED]/10 ${className}`}
      {...props}
    />
  );
}
