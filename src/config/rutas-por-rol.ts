import type { Rol } from "../types";

export function destinoPorRol(rol: Rol): string {
  if (rol === "admin" || rol === "operador") return "/operador";
  return "/";
}
