import type { RegistroIngresoSalida } from "../types";
import { apiPost } from "./client";

export const registrarIngreso = (data: {
  espacio_id: string;
  placa: string;
}): Promise<RegistroIngresoSalida> =>
  apiPost<RegistroIngresoSalida>("/api/ingresos", data);
