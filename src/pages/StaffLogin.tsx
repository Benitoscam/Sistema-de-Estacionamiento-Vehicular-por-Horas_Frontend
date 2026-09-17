import { useNavigate } from "react-router-dom";
import { AuthCard } from "../features/auth/AuthCard";
import { SigninForm } from "../features/auth/SigninForm";

export function StaffLogin() {
  const navigate = useNavigate();
  return (
    <AuthCard
      title="Acceso de personal"
      subtitle="Usa la cuenta entregada por el administrador. El registro público es solo para clientes."
    >
      <SigninForm
        onSuccess={() => navigate("/", { replace: true })}
        submitLabel="Ingresar"
      />
      <p className="mt-4 text-center text-sm text-slate-500">
        ¿Eres cliente?
        <a href="/login" className="ml-1.5 font-semibold text-primary hover:underline">
          Ir al acceso de clientes
        </a>
      </p>
    </AuthCard>
  );
}
