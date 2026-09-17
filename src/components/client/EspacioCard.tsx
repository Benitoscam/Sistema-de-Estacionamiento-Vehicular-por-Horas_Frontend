import type { Espacio } from "../../types";

const badgeColor: Record<string, string> = {
  disponible: "bg-green-100 text-green-700",
  reservado: "bg-amber-100 text-amber-700",
  ocupado: "bg-red-100 text-red-700",
  mantenimiento: "bg-gray-200 text-gray-600",
};

interface EspacioCardProps {
  espacio: Espacio;
  tarifaPorHora: string;
  onReservar: (espacio: Espacio) => void;
}

export function EspacioCard({ espacio, tarifaPorHora, onReservar }: EspacioCardProps) {
  const disponible = espacio.estado === "disponible";
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">Espacio</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeColor[espacio.estado] ?? "bg-gray-100 text-gray-600"}`}>
          {espacio.estado}
        </span>
      </div>
      <p className="text-xl font-bold text-gray-900">{espacio.codigo}</p>
      {espacio.zona_nombre && (
        <p className="text-sm text-gray-500 capitalize">{espacio.zona_nombre}</p>
      )}
      <p className="text-sm font-semibold text-primary mt-1">Bs {tarifaPorHora}/h</p>
      {disponible && (
        <button
          type="button"
          onClick={() => onReservar(espacio)}
          className="mt-2 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors cursor-pointer"
        >
          Reservar Espacio
        </button>
      )}
    </div>
  );
}
