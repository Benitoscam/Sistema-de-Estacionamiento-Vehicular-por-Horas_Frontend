import { createContext } from "react";
import type { Rol, User } from "../../types";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (correo: string, password: string) => Promise<User>;
  logout: () => void;
  hasRole: (...roles: Rol[]) => boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
