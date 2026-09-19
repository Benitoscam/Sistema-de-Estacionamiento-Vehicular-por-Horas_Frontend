import type { RegistroIngresoSalida } from "../types";
import { apiGet, apiPut } from "./client";

export const getSesionesActivas = (
  placa?: string,
): Promise<RegistroIngresoSalida[]> => {
  const query = placa ? `?placa=${encodeURIComponent(placa)}` : "";
  return apiGet<RegistroIngresoSalida[]>(`/api/sesiones/activas${query}`);
};

export const registrarSalida = (
  id: string,
  metodoPago?: string,
): Promise<RegistroIngresoSalida> =>
  apiPut<RegistroIngresoSalida>(
    `/api/salidas/${id}`,
    metodoPago ? { metodo_pago: metodoPago } : {},
  );
