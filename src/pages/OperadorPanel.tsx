import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useOcupacion } from "../hooks/useOcupacion";
import { useAhora } from "../hooks/useAhora";
import { getSesionesActivas, registrarSalida } from "../api/sesiones.api";
import { registrarIngreso } from "../api/ingresos.api";
import { IngresoForm } from "../components/operador/IngresoForm";
import { SesionActivaCard } from "../components/operador/SesionActivaCard";
import { LiquidacionModal } from "../components/operador/LiquidacionModal";
import type { RegistroIngresoSalida } from "../types";

export function OperadorPanel() {
  const queryClient = useQueryClient();
  const ahora = useAhora();

  const [busquedaPlaca, setBusquedaPlaca] = useState("");
  const [sesionSeleccionada, setSesionSeleccionada] =
    useState<RegistroIngresoSalida | null>(null);

  const { data: ocupacion } = useOcupacion();

  const { data: sesiones, isLoading: sesionesLoading } = useQuery({
    queryKey: ["sesionesActivas", busquedaPlaca],
    queryFn: () => getSesionesActivas(busquedaPlaca || undefined),
    refetchInterval: 8000,
  });

  const ingresoMutation = useMutation({
    mutationFn: registrarIngreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ocupacion"] });
      queryClient.invalidateQueries({ queryKey: ["sesionesActivas"] });
    },
  });

  const salidaMutation = useMutation({
    mutationFn: ({ id, metodo }: { id: string; metodo: string }) =>
      registrarSalida(id, metodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ocupacion"] });
      queryClient.invalidateQueries({ queryKey: ["sesionesActivas"] });
      setSesionSeleccionada(null);
    },
    onError: (err: Error) => alert(`Error al registrar salida: ${err.message}`),
  });

  const espaciosDisponibles = (ocupacion?.espacios ?? []).filter(
    (e) => e.estado === "disponible",
  );

  const getTarifaDeEspacio = (espacioId: string): string => {
    const espacio = ocupacion?.espacios.find((e) => e.id === espacioId);
    if (!espacio?.zona_nombre) return "0";
    const zona = ocupacion?.por_zona.find(
      (z) => z.zona_nombre === espacio.zona_nombre,
    );
    return zona?.tarifa_por_hora ?? "0";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Panel de operador
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IngresoForm
          espaciosDisponibles={espaciosDisponibles}
          onConfirm={(data) => ingresoMutation.mutate(data)}
          isPending={ingresoMutation.isPending}
          error={ingresoMutation.error?.message}
        />

        <div className="bg-white rounded-xl shadow-sm p-6">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
            Sesiones activas
          </p>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Buscar por placa
          </h2>

          <input
            type="text"
            value={busquedaPlaca}
            onChange={(e) => setBusquedaPlaca(e.target.value.toUpperCase())}
            placeholder="Buscar placa..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-4 focus:border-primary focus:ring-1 focus:ring-primary"
          />

          {sesionesLoading && (
            <p className="text-sm text-gray-500">Cargando sesiones...</p>
          )}

          <div className="space-y-2">
            {(sesiones ?? []).map((s) => (
              <SesionActivaCard
                key={s.id}
                sesion={s}
                ahora={ahora}
                onRegistrarSalida={setSesionSeleccionada}
              />
            ))}
            {!sesionesLoading && (sesiones ?? []).length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">
                No hay sesiones activas
              </p>
            )}
          </div>
        </div>
      </div>

      {sesionSeleccionada && (
        <LiquidacionModal
          sesion={sesionSeleccionada}
          tarifaPorHora={getTarifaDeEspacio(sesionSeleccionada.espacio_id)}
          onClose={() => setSesionSeleccionada(null)}
          onConfirm={(metodo) =>
            salidaMutation.mutate({ id: sesionSeleccionada.id, metodo })
          }
          isPending={salidaMutation.isPending}
        />
      )}
    </div>
  );
}
