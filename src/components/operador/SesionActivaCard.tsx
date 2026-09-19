import type { RegistroIngresoSalida } from "../../types";

function tiempoTranscurrido(horaEntrada: string, ahora: Date): string {
  const ms = ahora.getTime() - new Date(horaEntrada).getTime();
  const horas = Math.floor(ms / 3_600_000);
  const minutos = Math.floor((ms % 3_600_000) / 60_000);
  return horas > 0 ? `${horas}h ${minutos}m` : `${minutos}m`;
}

interface SesionActivaCardProps {
  sesion: RegistroIngresoSalida;
  ahora: Date;
  onRegistrarSalida: (sesion: RegistroIngresoSalida) => void;
}

export function SesionActivaCard({
  sesion,
  ahora,
  onRegistrarSalida,
}: SesionActivaCardProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
      <div>
        <p className="font-semibold text-gray-900 text-sm">
          {sesion.placa}{" "}
          <span className="text-gray-500 font-normal">
            · {sesion.espacio_codigo}
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Ingresó{" "}
          {new Date(sesion.hora_entrada).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" · "}
          {tiempoTranscurrido(sesion.hora_entrada, ahora)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onRegistrarSalida(sesion)}
        className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 transition-colors cursor-pointer"
      >
        Registrar salida
      </button>
    </div>
  );
}
