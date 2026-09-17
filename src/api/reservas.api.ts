import type { Reserva } from "../types";
import { apiPost } from "./client";

export const createReserva = (data: {
  espacio_id: string;
  hora_inicio_planeada: string;
  hora_fin_planeada: string;
  placa: string;
}): Promise<Reserva> => apiPost<Reserva>("/api/reservas", data);
