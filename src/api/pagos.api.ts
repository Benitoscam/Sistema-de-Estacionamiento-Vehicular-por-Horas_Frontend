import type { Pago } from "../types";
import { apiGet, apiPost } from "./client";

export const createCheckout = (reservaId: string): Promise<Pago> =>
  apiPost<Pago>("/api/pagos/checkout", { reserva_id: reservaId });

export const fakeConfirmarPago = (pagoId: string): Promise<Pago> =>
  apiPost<Pago>("/api/pagos/fake-confirmar", { pago_id: pagoId });

export const getMisPagos = (): Promise<Pago[]> =>
  apiGet<Pago[]>("/api/pagos/mios");
