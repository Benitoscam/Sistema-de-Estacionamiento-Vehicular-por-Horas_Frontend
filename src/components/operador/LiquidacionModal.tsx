import { useState } from "react";
import type { RegistroIngresoSalida } from "../../types";

interface LiquidacionModalProps {
  sesion: RegistroIngresoSalida;
  tarifaPorHora: string;
  onClose: () => void;
  onConfirm: (metodoPago: string) => void;
  isPending: boolean;
}

export function LiquidacionModal({
  sesion,
  tarifaPorHora,
  onClose,
  onConfirm,
  isPending,
}: LiquidacionModalProps) {
  const [metodo, setMetodo] = useState<"efectivo" | "linea">("efectivo");

  const [horas] = useState(() =>
    Math.max(
      1,
      Math.ceil(
        (Date.now() - new Date(sesion.hora_entrada).getTime()) / 3_600_000,
      ),
    ),
  );
  const total = (horas * Number(tarifaPorHora)).toFixed(2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900">Liquidar salida</h3>
        <p className="text-sm text-gray-500 mt-1">
          {sesion.placa} · {sesion.espacio_codigo}
        </p>

        <div className="mt-4 rounded-lg bg-primary/5 border border-primary/10 p-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Horas cobradas</span>
            <span className="font-medium">
              {horas} {horas === 1 ? "hora" : "horas"}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>Tarifa</span>
            <span className="font-medium">Bs {tarifaPorHora}/h</span>
          </div>
          <div className="flex justify-between font-bold text-primary mt-2 pt-2 border-t border-primary/10 text-lg">
            <span>Total</span>
            <span>Bs {total}</span>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Método de pago
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMetodo("efectivo")}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                metodo === "efectivo"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              Efectivo
            </button>
            <button
              type="button"
              onClick={() => setMetodo("linea")}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                metodo === "linea"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-300 text-gray-600"
              }`}
            >
              En línea
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(metodo === "efectivo" ? "efectivo" : "")}
            disabled={isPending}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Procesando..." : "Confirmar salida"}
          </button>
        </div>
      </div>
    </div>
  );
}
