import { useState } from "react";
import type { Espacio } from "../../types";

const PLACA_RE = /^\d{3,4}[A-Z]{3}$/;

interface IngresoFormProps {
  espaciosDisponibles: Espacio[];
  onConfirm: (data: { espacio_id: string; placa: string }) => void;
  isPending: boolean;
  error?: string | null;
}

export function IngresoForm({
  espaciosDisponibles,
  onConfirm,
  isPending,
  error,
}: IngresoFormProps) {
  const [espacioId, setEspacioId] = useState("");
  const [placa, setPlaca] = useState("");

  const placaLimpia = placa.trim().toUpperCase().replace(/\s/g, "");
  const invalido = !espacioId || !PLACA_RE.test(placaLimpia);

  const handleSubmit = () => {
    if (invalido) return;
    onConfirm({ espacio_id: espacioId, placa: placaLimpia });
    setPlaca("");
    setEspacioId("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
        Registro de ingreso
      </p>
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Vehículo sin reserva
      </h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio
          </label>
          <select
            value={espacioId}
            onChange={(e) => setEspacioId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">Selecciona un espacio disponible</option>
            {espaciosDisponibles.map((e) => (
              <option key={e.id} value={e.id}>
                {e.codigo} · {e.zona_nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Placa del vehículo
          </label>
          <input
            type="text"
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            placeholder="Ej: 1234ABC"
            maxLength={7}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase tracking-wide focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-gray-400 mt-1">
            4 números seguidos de 3 letras (ej: 1234ABC)
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={invalido || isPending}
        className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isPending ? "Registrando..." : "Registrar ingreso"}
      </button>
    </div>
  );
}
