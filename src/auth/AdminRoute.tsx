import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@auth/index";
import { LoadingOverlay } from "@components/common";

export default function AdminRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <LoadingOverlay fullScreen message="Verificando acceso..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/inicio" replace />;
  return <Outlet />;
}
