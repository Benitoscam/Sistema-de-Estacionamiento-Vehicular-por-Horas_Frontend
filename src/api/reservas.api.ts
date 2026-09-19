import type { Reserva } from "../types";
import { apiGet, apiPost } from "./client";

export const getReserva = (id: string): Promise<Reserva> =>
  apiGet<Reserva>(`/api/reservas/${id}`);

export const createReserva = (data: {
  espacio_id: string;
  hora_inicio_planeada: string;
  hora_fin_planeada: string;
  placa: string;
}): Promise<Reserva> => apiPost<Reserva>("/api/reservas", data);
