import { useState } from "react";
import type { Espacio } from "../../types";

interface BookingModalProps {
  espacio: Espacio;
  tarifaPorHora: string;
  onClose: () => void;
  onConfirm: (data: {
    espacio_id: string;
    hora_inicio_planeada: string;
    hora_fin_planeada: string;
    placa: string;
  }) => void;
  isPending: boolean;
}

const PLACA_RE = /^\d{3,4}[A-Z]{3}$/;

function toLocalDatetime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function horasEntre(inicio: string, fin: string): number {
  const diff = new Date(fin).getTime() - new Date(inicio).getTime();
  return Math.max(0, diff / 3_600_000);
}

export function BookingModal({
  espacio,
  tarifaPorHora,
  onClose,
  onConfirm,
  isPending,
}: BookingModalProps) {
  const now = new Date();
  const defaultInicio = toLocalDatetime(new Date(now.getTime() + 60_000));

  const [inicio, setInicio] = useState(defaultInicio);
  const [fin, setFin] = useState(defaultInicio);
  const [placa, setPlaca] = useState("");

  const handleInicioChange = (valor: string) => {
    setInicio(valor);
    if (valor && fin <= valor) {
      setFin(valor);
    }
  };

  const horas = horasEntre(inicio, fin);
  const horasCobradas = Math.ceil(horas); // se cobra por hora completa, sin fracciones
  const estimado = horasCobradas * Number(tarifaPorHora);
  const placaLimpia = placa.trim().toUpperCase().replace(/\s/g, "");
  const placaValida = PLACA_RE.test(placaLimpia);
  const invalido = horas <= 0 || !inicio || !fin || !placaValida;

  const handleConfirm = () => {
    if (invalido) return;
    onConfirm({
      espacio_id: espacio.id,
      hora_inicio_planeada: new Date(inicio).toISOString(),
      hora_fin_planeada: new Date(fin).toISOString(),
      placa: placaLimpia,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900">Confirmar Reserva</h3>
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-sm text-gray-500">Espacio</p>
            <p className="font-semibold text-gray-900">{espacio.codigo}</p>
            {espacio.zona_nombre && (
              <p className="text-xs text-gray-500 capitalize">
                {espacio.zona_nombre}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entrada
            </label>
            <input
              type="datetime-local"
              value={inicio}
              min={toLocalDatetime(now)}
              onChange={(e) => handleInicioChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salida
            </label>
            <input
              type="datetime-local"
              value={fin}
              min={inicio || toLocalDatetime(now)}
              onChange={(e) => setFin(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            />
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

          {horas > 0 && (
            <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Duración</span>
                <span className="font-medium">
                  {horasCobradas} {horasCobradas === 1 ? "hora" : "horas"}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Tarifa</span>
                <span className="font-medium">Bs {tarifaPorHora}/h</span>
              </div>
              <div className="flex justify-between font-bold text-primary mt-2 pt-2 border-t border-primary/10">
                <span>Estimado</span>
                <span>Bs {estimado.toFixed(2)}</span>
              </div>
            </div>
          )}
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
            onClick={handleConfirm}
            disabled={invalido || isPending}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Reservando..." : "Confirmar Reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}
