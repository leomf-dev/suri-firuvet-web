import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@auth/index";
import { LoadingOverlay } from "@components/common";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingOverlay fullScreen message="Cargando..." />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
