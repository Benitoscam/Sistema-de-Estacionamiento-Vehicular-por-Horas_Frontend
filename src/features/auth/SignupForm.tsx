import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ApiError } from "../../api/client";
import { register as registerRequest } from "../../api/auth.api";
import { useAuth } from "./useAuth";

function passwordScore(value: string): number {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}

const strengthLabel = ["", "Débil", "Moderada", "Buena", "Muy robusta"];

interface Props {
  onSuccess?: (user: { rol: string }) => void;
}

export function SignupForm({ onSuccess }: Props) {
  const { login } = useAuth();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const score = useMemo(() => passwordScore(password), [password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await registerRequest({
        nombre: nombre.trim(),
        correo: correo.trim().toLowerCase(),
        password,
        telefono: telefono.trim() || undefined,
      });
      const user = await login(correo.trim().toLowerCase(), password);
      onSuccess?.(user);
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "No se pudo conectar con el servidor.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Nombre completo
        <span className="relative flex items-center font-normal">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[20px] text-slate-400">
            badge
          </span>
          <input
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Sofía Morales Ruiz"
            autoComplete="name"
            className="h-12 w-full rounded-lg bg-white py-2 pl-11 pr-4 text-sm shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </span>
      </label>
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
            placeholder="sofia@correo.com"
            autoComplete="email"
            className="h-12 w-full rounded-lg bg-white py-2 pl-11 pr-4 text-sm shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </span>
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Teléfono móvil <span className="font-normal text-slate-400">(opcional)</span>
        <span className="relative flex items-center font-normal">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[20px] text-slate-400">
            smartphone
          </span>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="612 345 678"
            autoComplete="tel"
            className="h-12 w-full rounded-lg bg-white py-2 pl-11 pr-4 text-sm shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </span>
      </label>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-password"
          className="text-sm font-semibold"
        >
          Contraseña segura
        </label>
        <span className="relative flex items-center">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[20px] text-slate-400">
            lock
          </span>
          <input
            id="signup-password"
            type={showPwd ? "text" : "password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
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
        <div className="mt-1 grid h-1.5 grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-full rounded-full transition-colors ${
                password && score >= i ? "bg-primary" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>
            {password
              ? `Nivel: ${strengthLabel[score] || "Muy corta"}`
              : "Seguridad de la contraseña"}
          </span>
          <span>Usa mayúsculas, números y símbolos</span>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
      >
        {sending ? "Creando cuenta…" : "Crear mi cuenta de cliente"}
        <span className="material-symbols-outlined text-[18px]">verified_user</span>
      </button>
    </form>
  );
}
