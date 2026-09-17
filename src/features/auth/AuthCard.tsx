import type { ReactNode } from "react";
import { brand } from "../../config/brand";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <span className="text-lg font-bold tracking-tight">{brand.name}</span>
          <span className="text-xs text-slate-500">{brand.subtitle}</span>
        </div>
      </header>

      <main className="flex flex-grow flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[520px]">
          <div className="mb-6 text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
              Acceso seguro
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{subtitle}</p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-xl sm:p-8">
            {children}
            <div className="mt-6 rounded-lg bg-slate-100 p-3 text-center">
              <p className="text-xs font-bold uppercase tracking-wide">Conexión segura</p>
              <p className="text-xs text-slate-500">
                Tus datos están protegidos en cada acceso.
              </p>
            </div>
          </div>

          {footer && <div className="mt-4 text-center text-sm text-slate-500">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
