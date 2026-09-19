import type { Disponibilidad } from "../types";
import { apiGet } from "./client";

export const getDisponibilidad = (
  inicio: string,
  fin: string,
  zonaId?: string
): Promise<Disponibilidad> => {
  const params = new URLSearchParams({ inicio, fin });
  if (zonaId) params.set("zona_id", zonaId);
  return apiGet<Disponibilidad>(`/api/disponibilidad?${params.toString()}`);
};
