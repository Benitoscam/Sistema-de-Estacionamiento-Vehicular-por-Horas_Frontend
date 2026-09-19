import { useState } from "react";
import type { FormEvent } from "react";
import { ApiError } from "../../api/client";
import { useAuth } from "./useAuth";
import type { User } from "../../types";

interface Props {
  onSuccess?: (user: User) => void;
  submitLabel?: string;
}

export function SigninForm({
  onSuccess,
  submitLabel = "Iniciar sesión",
}: Props) {
  const { login } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const user = await login(correo.trim().toLowerCase(), password);
      onSuccess?.(user);
    } catch (err: unknown) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo conectar con el servidor.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Correo electrónico
        <span className="relative flex items-center font-normal">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[20px] text-slate-400">
            mail
          </span>
          <input
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="nombre@correo.com"
            autoComplete="email"
            className="h-12 w-full rounded-lg bg-white py-2 pl-11 pr-4 text-sm shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </span>
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Contraseña
        <span className="relative flex items-center font-normal">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[20px] text-slate-400">
            key
          </span>
          <input
            type={showPwd ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            className="h-12 w-full rounded-lg bg-white py-2 pl-11 pr-11 text-sm shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            aria-label="Mostrar u ocultar contraseña"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 rounded p-1 text-slate-500 hover:text-slate-900"
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPwd ? "visibility_off" : "visibility"}
            </span>
          </button>
        </span>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
      >
        {sending ? "Ingresando…" : submitLabel}
        <span className="material-symbols-outlined text-[18px]">
          arrow_forward
        </span>
      </button>
    </form>
  );
}
