import { useNavigate } from "react-router-dom";
import { AuthCard } from "../features/auth/AuthCard";
import { SigninForm } from "../features/auth/SigninForm";
import { brand } from "../config/brand";
import { destinoPorRol } from "../config/rutas-por-rol";

export function Login() {
  const navigate = useNavigate();
  return (
    <AuthCard title={brand.signinTitle} subtitle={brand.signinSubtitle}>
      <SigninForm
        onSuccess={(user) =>
          navigate(destinoPorRol(user.rol), { replace: true })
        }
      />
      <p className="mt-4 text-center text-sm text-slate-500">
        ¿No tienes una cuenta?
        <a
          href="/register"
          className="ml-1.5 font-semibold text-primary hover:underline"
        >
          Crear cuenta
        </a>
      </p>
    </AuthCard>
  );
}
