import { useAuth } from "../features/auth/useAuth";

export function Ocupacion() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-xl font-semibold">Ocupación</h1>
      <p className="mt-2 text-sm text-gray-600">
        Sesión activa como {user?.nombre} ({user?.rol}). El polling de ocupación (Fase 1)
        se conecta en el siguiente paso.
      </p>
    </div>
  );
}
