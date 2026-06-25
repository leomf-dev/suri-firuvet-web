import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthPage, ClinicasPage, CitasPage, InicioPage, MascotasPage } from "@pages/index";
import { Layout } from "@components/layout";

export const routes: RouteObject[] = [
    // ─── REDIRECT: "/" siempre va a /login ─────────────────────
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },

    // ─── RUTAS PÚBLICAS ────────────────────────────────────────
    {
        path: "/login",
        element: <AuthPage />,
    },

    // ─── RUTAS PROTEGIDAS (DashboardLayout) ────────────────────
    {
        element: <Layout />,
        children: [
            {
                path: "/inicio",
                element: <InicioPage />,
            },
            {
                path: "/citas",
                element: <CitasPage />,
            },
            {
                path: "/mascotas",
                element: <MascotasPage />,
            },
            {
                path: "/clinicas",
                element: <ClinicasPage />,
            },
        ],
    },
];
