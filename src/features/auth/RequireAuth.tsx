import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./useAuth";
import type { Rol } from "../../types";

interface Props {
  children: ReactNode;
  roles?: Rol[];
}

export function RequireAuth({ children, roles }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">Verificando sesión…</p>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && roles.length > 0 && !roles.includes(user.rol)) {
    return <p className="p-6 text-sm text-red-600">403 — rol no autorizado.</p>;
  }
  return <>{children}</>;
}
