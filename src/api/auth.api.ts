import { apiGet, apiPost } from "./client";
import type { LoginData, User } from "../types";

export interface LoginPayload {
  correo: string;
  password: string;
}

export interface RegisterPayload {
  nombre: string;
  correo: string;
  password: string;
  telefono?: string;
}

export const login = (payload: LoginPayload): Promise<LoginData> =>
  apiPost<LoginData>("/api/auth/login", payload, false);

export const register = (payload: RegisterPayload): Promise<User> =>
  apiPost<User>("/api/auth/register", payload, false);

export const me = (): Promise<User> => apiGet<User>("/api/auth/me");
