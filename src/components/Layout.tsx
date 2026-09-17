import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between border-b bg-white px-6 py-3">
        <span className="font-semibold">Parqueo por Horas</span>
        {user && (
          <div className="flex items-center gap-3 text-sm">
            <span>
              {user.nombre} · {user.rol}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded border px-2 py-1 hover:bg-gray-100"
            >
              Salir
            </button>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-3xl p-6">{children}</main>
    </div>
  );
}
