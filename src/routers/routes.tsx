import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthPage, ClinicasPage, CitasPage, InicioPage, MascotasPage, ProfilePage } from "@pages/index";
import { AdminPage, AdminClientesPage, AdminMascotasPage, AdminCitasPage, AdminLogsPage } from "@pages/admin";
import { Layout } from "@components/layout";
import { AdminLayout } from "@components/admin";
import ProtectedRoute from "@auth/ProtectedRoute";
import AdminRoute from "@auth/AdminRoute";

export const routes: RouteObject[] = [
    // Redirect root to login
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },

    // Public route
    {
        path: "/login",
        element: <AuthPage />,
    },

    // Protected routes — usuario
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    { path: "/inicio",   element: <InicioPage /> },
                    { path: "/citas",    element: <CitasPage /> },
                    { path: "/mascotas", element: <MascotasPage /> },
                    { path: "/clinicas", element: <ClinicasPage /> },
                    { path: "/perfil",   element: <ProfilePage /> },
                ],
            },
        ],
    },

    // Protected routes — admin only
    {
        element: <AdminRoute />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { path: "/admin",           element: <AdminPage /> },
                    { path: "/admin/clientes",  element: <AdminClientesPage /> },
                    { path: "/admin/mascotas",  element: <AdminMascotasPage /> },
                    { path: "/admin/citas",     element: <AdminCitasPage /> },
                    { path: "/admin/logs",      element: <AdminLogsPage /> },
                ],
            },
        ],
    },
];
