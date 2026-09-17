import type { Espacio } from "../types";
import { apiGet } from "./client";

export const getEspacios = (params?: {
  zona_id?: string;
  estado?: string;
}): Promise<Espacio[]> => {
  const query = new URLSearchParams();
  if (params?.zona_id) query.set("zona_id", params.zona_id);
  if (params?.estado) query.set("estado", params.estado);
  const qs = query.toString();
  return apiGet<Espacio[]>(`/api/espacios${qs ? `?${qs}` : ""}`);
};
