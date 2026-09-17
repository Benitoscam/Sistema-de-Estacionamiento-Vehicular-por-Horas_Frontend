import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOcupacion } from "../hooks/useOcupacion";
import { createReserva } from "../api/reservas.api";
import { useAuth } from "../features/auth/useAuth";
import { EspacioCard } from "../components/client/EspacioCard";
import { BookingModal } from "../components/client/BookingModal";
import type { Espacio } from "../types";

export function Buscar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>(null);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState<Espacio | null>(null);

  const { data: ocupacion, isLoading, error } = useOcupacion();

  const reservaMutation = useMutation({
    mutationFn: createReserva,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ocupacion"] });
      setEspacioSeleccionado(null);
      alert("Reserva creada exitosamente");
    },
    onError: (err: Error) => {
      alert(`Error: ${err.message}`);
    },
  });

  const espaciosFiltrados = (ocupacion?.espacios ?? []).filter((e) => {
    if (zonaSeleccionada && e.zona_nombre !== zonaSeleccionada) return false;
    return true;
  });

  const disponibles = espaciosFiltrados.filter((e) => e.estado === "disponible");

  const getTarifa = (zonaNombre: string | null): string => {
    if (!zonaNombre || !ocupacion?.por_zona) return "0";
    const zona = ocupacion.por_zona.find((z) => z.zona_nombre === zonaNombre);
    return zona?.tarifa_por_hora ?? "0";
  };

  const totalDisponibles = ocupacion?.por_zona
    ? ocupacion.por_zona.reduce((sum, z) => sum + z.disponibles, 0)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Hola, {user?.nombre}
        </h1>
        <p className="text-gray-600 mt-2">Busca tu espacio de estacionamiento ideal</p>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-gray-500">Cargando espacios...</div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          Error al cargar ocupación
        </div>
      )}

      {ocupacion && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Ocupación Total</span>
              <span className="text-sm text-gray-500">
                {totalDisponibles} de {ocupacion.total} disponibles
              </span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((ocupacion.total - totalDisponibles) / Math.max(ocupacion.total, 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              type="button"
              onClick={() => setZonaSeleccionada(null)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                zonaSeleccionada === null
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos ({ocupacion.total})
            </button>
            {ocupacion.por_zona.map((z) => (
              <button
                key={z.zona_id}
                type="button"
                onClick={() => setZonaSeleccionada(z.zona_nombre)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors capitalize cursor-pointer ${
                  zonaSeleccionada === z.zona_nombre
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {z.zona_nombre} ({z.disponibles}/{z.total})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {disponibles.map((e) => (
              <EspacioCard
                key={e.id}
                espacio={e}
                tarifaPorHora={getTarifa(e.zona_nombre)}
                onReservar={setEspacioSeleccionado}
              />
            ))}
          </div>

          {disponibles.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">
                {zonaSeleccionada
                  ? `No hay espacios disponibles en zona ${zonaSeleccionada}`
                  : "No hay espacios disponibles en este momento"}
              </p>
            </div>
          )}
        </>
      )}

      {espacioSeleccionado && (
        <BookingModal
          espacio={espacioSeleccionado}
          tarifaPorHora={getTarifa(espacioSeleccionado.zona_nombre)}
          onClose={() => setEspacioSeleccionado(null)}
          onConfirm={(data) => reservaMutation.mutate(data)}
          isPending={reservaMutation.isPending}
        />
      )}
    </div>
  );
}
