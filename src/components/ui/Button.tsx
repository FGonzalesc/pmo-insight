import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#2F80ED]/30 hover:bg-[#2F80ED]/5 hover:text-[#2F80ED] disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
