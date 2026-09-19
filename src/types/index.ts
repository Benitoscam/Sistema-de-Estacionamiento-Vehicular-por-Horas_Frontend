export type Rol = "admin" | "operador" | "cliente";
export type ZonaNombre = "cubierto" | "descubierto" | "motos";
export type EspacioEstado =
  | "disponible"
  | "reservado"
  | "ocupado"
  | "mantenimiento";

export interface User {
  id: string;
  nombre: string;
  correo: string;
  telefono: string | null;
  rol: Rol;
  created_at: string | null;
}

export interface LoginData {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  user: User;
}

export interface Zona {
  id: string;
  nombre: ZonaNombre;
  descripcion: string | null;
  tarifa_por_hora: string;
}

export interface Espacio {
  id: string;
  codigo: string;
  estado: EspacioEstado;
  zona_id: string;
  zona_nombre: string | null;
}

export interface OcupacionPorZona {
  zona_id: string;
  zona_nombre: string;
  tarifa_por_hora: string;
  total: number;
  disponibles: number;
}

export interface Ocupacion {
  total: number;
  por_estado: Record<EspacioEstado, number>;
  por_zona: OcupacionPorZona[];
  espacios: Espacio[];
}

export interface Reserva {
  id: string;
  espacio_id: string;
  espacio_codigo: string | null;
  usuario_id: string;
  placa: string | null;
  fecha: string | null;
  hora_inicio_planeada: string | null;
  hora_fin_planeada: string | null;
  monto_pagado: string | null;
  monto_estimado: string | null;
  estado: string;
}

export interface DisponibilidadEspacio {
  id: string;
  codigo: string;
  zona_id: string;
  zona_nombre: string | null;
  tarifa_por_hora: string;
}

export interface DisponibilidadPorZona {
  zona_id: string;
  zona_nombre: string;
  tarifa_por_hora: string;
  disponibles: number;
}

export interface Disponibilidad {
  inicio: string;
  fin: string;
  total_disponibles: number;
  por_zona: DisponibilidadPorZona[];
  espacios: DisponibilidadEspacio[];
}

export interface Pago {
  id: string;
  reserva_id: string | null;
  registro_ingreso_id: string | null;
  referencia_transaccion: string;
  monto: string;
  metodo: string;
  estado: string;
  reserva_codigo: string | null;
  checkout_url?: string;
}

export interface ApiOk<T> {
  data: T;
}

export interface ApiErr {
  error: string;
  code?: string;
  detail?: string;
}
