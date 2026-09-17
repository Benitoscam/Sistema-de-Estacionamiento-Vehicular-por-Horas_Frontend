import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "../features/auth/RequireAuth";
import { Layout } from "../components/Layout";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { StaffLogin } from "../pages/StaffLogin";
import { Ocupacion } from "../pages/Ocupacion";
import { NotFound } from "../pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/personal" element={<StaffLogin />} />
      <Route
        path="/"
        element={
          <RequireAuth roles={["admin", "operador", "cliente"]}>
            <Layout>
              <Ocupacion />
            </Layout>
          </RequireAuth>
        }
      />
      <Route path="/ocupacion" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
