import { useNavigate } from "react-router-dom";
import { AuthCard } from "../features/auth/AuthCard";
import { SignupForm } from "../features/auth/SignupForm";
import { brand } from "../config/brand";

export function Register() {
  const navigate = useNavigate();
  return (
    <AuthCard title={brand.signupTitle} subtitle={brand.signupSubtitle}>
      <SignupForm onSuccess={() => navigate("/", { replace: true })} />
      <p className="mt-4 text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?
        <a href="/login" className="ml-1.5 font-semibold text-primary hover:underline">
          Iniciar sesión
        </a>
      </p>
    </AuthCard>
  );
}
