import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { clearToken, getToken, setToken } from "../../api/client";
import { login as loginRequest, me as meRequest } from "../../api/auth.api";
import type { User } from "../../types";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(() => getToken() !== null);

  useEffect(() => {
    if (!getToken()) return;
    let cancelled = false;
    meRequest()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) {
          clearToken();
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (correo: string, password: string) => {
    const data = await loginRequest({ correo, password });
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: User["rol"][]) => (user ? roles.includes(user.rol) : false),
    [user],
  );

  const value = useMemo(
    () => ({ user, loading, login, logout, hasRole }),
    [user, loading, login, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
