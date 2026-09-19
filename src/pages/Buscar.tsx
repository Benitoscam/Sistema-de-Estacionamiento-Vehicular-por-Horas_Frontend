import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useOcupacion } from "../hooks/useOcupacion";
import { getDisponibilidad } from "../api/disponibilidad.api";
import { createReserva } from "../api/reservas.api";
import { EspacioCard } from "../components/client/EspacioCard";
import { BookingModal } from "../components/client/BookingModal";
import type { Espacio } from "../types";

function toLocalDatetime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatFechaISO(d: Date): string {
  return d.toISOString().replace("Z", "+00:00");
}

export function Buscar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>(null);
  const [espacioSeleccionado, setEspacioSeleccionado] =
    useState<Espacio | null>(null);

  const now = new Date();
  const [fechaEntrada, setFechaEntrada] = useState(() =>
    toLocalDatetime(new Date(now.getTime() + 60_000)),
  );
  const [fechaSalida, setFechaSalida] = useState(() =>
    toLocalDatetime(new Date(now.getTime() + 60_000)),
  );
  const [usandoFiltro, setUsandoFiltro] = useState(false);

  const {
    data: ocupacion,
    isLoading: ocupacionLoading,
    error: ocupacionError,
  } = useOcupacion();

  const {
    data: disponibilidad,
    isLoading: disponibilidadLoading,
    error: disponibilidadError,
  } = useQuery({
    queryKey: [
      "disponibilidad",
      fechaEntrada,
      fechaSalida,
      zonaSeleccionada ?? "all",
    ],
    queryFn: () =>
      getDisponibilidad(
        formatFechaISO(new Date(fechaEntrada)),
        formatFechaISO(new Date(fechaSalida)),
        zonaSeleccionada ?? undefined,
      ),
    enabled: usandoFiltro && new Date(fechaSalida) > new Date(fechaEntrada),
  });

  const reservaMutation = useMutation({
    mutationFn: createReserva,
    onSuccess: (reserva) => {
      queryClient.invalidateQueries({ queryKey: ["ocupacion"] });
      queryClient.invalidateQueries({ queryKey: ["disponibilidad"] });
      setEspacioSeleccionado(null);
      navigate(`/reservas/${reserva.id}`);
    },
    onError: (err: Error) => {
      alert(`Error: ${err.message}`);
    },
  });

  const isLoading = usandoFiltro ? disponibilidadLoading : ocupacionLoading;
  const error = usandoFiltro ? disponibilidadError : ocupacionError;

  const espaciosDisponibles = usandoFiltro
    ? (disponibilidad?.espacios ?? []).map((e) => ({
        ...e,
        estado: "disponible" as const,
      }))
    : (ocupacion?.espacios ?? []).filter((e) => e.estado === "disponible");

  const espaciosFiltrados = espaciosDisponibles.filter((e) => {
    if (zonaSeleccionada && e.zona_id !== zonaSeleccionada) return false; // antes: e.zona_nombre !== zonaSeleccionada
    return true;
  });

  const getTarifa = (zonaNombre: string | null): string => {
    if (!zonaNombre) return "0";
    const zonas = usandoFiltro ? disponibilidad?.por_zona : ocupacion?.por_zona;
    const zona = zonas?.find((z) => z.zona_nombre === zonaNombre);
    return zona?.tarifa_por_hora ?? "0";
  };

  const totalDisponibles = usandoFiltro
    ? (disponibilidad?.total_disponibles ?? 0)
    : (ocupacion?.por_zona?.reduce((sum, z) => sum + z.disponibles, 0) ?? 0);

  const totalEspacios = ocupacion?.total ?? 0;

  const handleBuscar = () => {
    if (new Date(fechaSalida) <= new Date(fechaEntrada)) {
      alert("La hora de salida debe ser posterior a la de entrada");
      return;
    }
    setUsandoFiltro(true);
  };

  const handleLimpiarFiltro = () => {
    setUsandoFiltro(false);
    setZonaSeleccionada(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
        <div className="lg:col-span-7 bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-blue-50 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
              Disponibilidad en vivo
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Encuentra y Reserva tu Espacio
            </h1>
            <p className="text-gray-500 max-w-xl">
              Verifica disponibilidad en tiempo real o accede al instante
              directamente en la entrada.
            </p>
          </div>
          <div className="mt-4 pt-4 bg-gray-50 rounded-lg p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px]">
                verified_user
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Reserva Segura
              </p>
              <p className="text-xs text-gray-500">Confirmación inmediata</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-gradient-to-br from-white via-gray-50 to-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">
                  bolt
                </span>{" "}
                ACCESO RÁPIDO
              </span>
              <span className="text-sm font-semibold text-primary">
                Sin Reserva
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              ¿Llegaste directo?
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Preséntate en la entrada y el operador registrará tu ingreso.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center text-xs text-gray-400">
            El registro lo realiza el operador en caseta
          </div>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">
                calendar_today
              </span>
              Fecha
            </label>
            <input
              type="date"
              value={fechaEntrada.split("T")[0]}
              onChange={(e) => {
                const t = fechaEntrada.split("T")[1] || "09:00";
                setFechaEntrada(`${e.target.value}T${t}`);
                setFechaSalida(`${e.target.value}T${t}`);
              }}
              className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">
                schedule
              </span>
              Hora Entrada
            </label>
            <input
              type="time"
              value={fechaEntrada.split("T")[1] || "09:00"}
              onChange={(e) => {
                const d = fechaEntrada.split("T")[0];
                setFechaEntrada(`${d}T${e.target.value}`);
              }}
              className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">
                timelapse
              </span>
              Hora Salida
            </label>
            <input
              type="time"
              value={fechaSalida.split("T")[1] || "13:00"}
              onChange={(e) => {
                const d = fechaSalida.split("T")[0];
                setFechaSalida(`${d}T${e.target.value}`);
              }}
              className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex flex-col justify-end gap-2">
            <button
              type="button"
              onClick={handleBuscar}
              className="w-full h-[46px] rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                search
              </span>
              Buscar
            </button>
            {usandoFiltro && (
              <button
                type="button"
                onClick={handleLimpiarFiltro}
                className="w-full h-[36px] rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold transition-all cursor-pointer"
              >
                Ver ocupacion actual
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setZonaSeleccionada(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              zonaSeleccionada === null
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">apps</span>
            Todos ({totalDisponibles})
          </button>
          {(usandoFiltro ? disponibilidad?.por_zona : ocupacion?.por_zona)?.map(
            (z) => (
              <button
                key={z.zona_id}
                type="button"
                onClick={() => setZonaSeleccionada(z.zona_id)} // antes: z.zona_nombre
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 capitalize cursor-pointer ${
                  zonaSeleccionada === z.zona_id // antes: z.zona_nombre
                    ? "bg-primary text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {z.zona_nombre} ({z.disponibles})
              </button>
            ),
          )}
        </div>
      </section>

      {!usandoFiltro && totalEspacios > 0 && (
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <div>
              <span className="text-sm font-semibold text-gray-900">
                Ocupacion actual: {totalDisponibles} de {totalEspacios}{" "}
                disponibles
              </span>
            </div>
          </div>
          <div className="flex-1 mx-6 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${((totalEspacios - totalDisponibles) / Math.max(totalEspacios, 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {usandoFiltro && disponibilidad && (
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(0,74,198,0.5)]" />
          <span className="text-sm font-semibold text-gray-900">
            Disponibles en el rango: {disponibilidad.total_disponibles} espacios
          </span>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12 text-gray-500">
          Cargando espacios...
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          Error al cargar disponibilidad
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {espaciosFiltrados.map((e) => (
            <EspacioCard
              key={e.id}
              espacio={e as Espacio}
              tarifaPorHora={getTarifa(e.zona_nombre)}
              onReservar={setEspacioSeleccionado}
            />
          ))}
        </div>
      )}

      {!isLoading && espaciosFiltrados.length === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">
            {zonaSeleccionada
              ? `No hay espacios disponibles en zona ${zonaSeleccionada}`
              : usandoFiltro
                ? "No hay espacios disponibles en ese horario"
                : "No hay espacios disponibles en este momento"}
          </p>
        </div>
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
