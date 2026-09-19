import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getReserva } from "../api/reservas.api";
import { createCheckout, fakeConfirmarPago } from "../api/pagos.api";

export function ReservaDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: reserva,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reserva", id],
    queryFn: () => getReserva(id!),
    enabled: !!id,
  });

  const checkoutMutation = useMutation({
    mutationFn: createCheckout,
    onSuccess: (pago) => {
      fakeConfirmarMutation.mutate(pago.id);
    },
    onError: (err: Error) => {
      alert(`Error al iniciar pago: ${err.message}`);
    },
  });

  const fakeConfirmarMutation = useMutation({
    mutationFn: fakeConfirmarPago,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reserva", id] });
      queryClient.invalidateQueries({ queryKey: ["misReservas"] });
    },
    onError: (err: Error) => {
      alert(`Error al confirmar pago: ${err.message}`);
    },
  });

  const isPaying =
    checkoutMutation.isPending || fakeConfirmarMutation.isPending;
  const puedePagar = reserva?.estado === "confirmada" && !reserva?.monto_pagado;

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-500">
        Cargando reserva...
      </div>
    );
  }

  if (error || !reserva) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
          No se pudo cargar la reserva
        </div>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-primary hover:underline cursor-pointer"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const inicio = new Date(reserva.hora_inicio_planeada ?? "");
  const fin = new Date(reserva.hora_fin_planeada ?? "");
  const duracionHoras = Math.ceil(
    (fin.getTime() - inicio.getTime()) / 3_600_000,
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        Volver
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-primary/5 border-b border-primary/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                Reserva
              </p>
              <h1 className="text-lg font-bold text-gray-900 mt-0.5">
                Espacio {reserva.espacio_codigo ?? "N/A"}
              </h1>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                reserva.estado === "confirmada"
                  ? "bg-emerald-50 text-emerald-700"
                  : reserva.estado === "cancelada"
                    ? "bg-red-50 text-red-700"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
            </span>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Entrada</p>
              <p className="text-sm font-semibold text-gray-900">
                {inicio.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600">
                {inicio.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Salida</p>
              <p className="text-sm font-semibold text-gray-900">
                {fin.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600">
                {fin.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Placa</span>
              <span className="font-semibold text-gray-900">
                {reserva.placa ?? "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Duracion estimada</span>
              <span className="font-semibold text-gray-900">
                {duracionHoras}h
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-end">
              <span className="text-sm text-gray-500">
                {reserva.monto_pagado ? "Monto pagado" : "Monto estimado"}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                Bs. {reserva.monto_pagado ?? reserva.monto_estimado ?? "0.00"}
              </span>
            </div>
          </div>
        </div>

        {puedePagar && (
          <div className="px-6 pb-6">
            <button
              type="button"
              onClick={() => checkoutMutation.mutate(reserva.id)}
              disabled={isPaying}
              className="w-full py-3 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPaying ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  Procesando pago...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    credit_card
                  </span>
                  Pagar ahora
                </>
              )}
            </button>
          </div>
        )}

        {reserva.monto_pagado && (
          <div className="px-6 pb-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">
                check_circle
              </span>
              <span className="text-sm font-medium text-emerald-700">
                Pago confirmado
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
