import type { Ocupacion } from "../types";
import { apiGet } from "./client";

export const getOcupacion = (zonaId?: string): Promise<Ocupacion> => {
  const params = zonaId ? `?zona_id=${zonaId}` : "";
  return apiGet<Ocupacion>(`/api/ocupacion${params}`);
};
