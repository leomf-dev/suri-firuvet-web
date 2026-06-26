import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@components/ui";
import { StatCard, QuickAccessCard, HistorialItem } from "@components/inicio";
import { LoadingOverlay } from "@components/common";
import { useAuth } from "@auth/index";
import { mascotaService, citaService, catalogoService } from "@services/index";
import type { Mascota, Cita, Clinica } from "@appTypes";
import MascotasIcon from "@assets/MASCOTAS.svg";
import CitasIcon from "@assets/CITAS.svg";
import ClinicasIcon from "@assets/CLINICAS.svg";
import DashboardIcon from "@assets/DASHBOARD.svg";

function InicioPage() {
  const navigate = useNavigate();
  const { cliente, idCliente, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idCliente) { setLoading(false); return; }

    // REST primero — controla el loading state
    Promise.all([
      mascotaService.getByCliente(idCliente).catch(() => [] as Mascota[]),
      citaService.getByCliente(idCliente).catch(() => [] as Cita[]),
    ]).then(([m, c]) => {
      setMascotas(m);
      setCitas(c);
    }).finally(() => setLoading(false));

    // SOAP en segundo plano — el conteo de clínicas no bloquea
    catalogoService.getClinicas()
      .then(setClinicas)
      .catch(() => {});
  }, [idCliente]);

  if (loading) return <LoadingOverlay fullScreen message="Cargando..." />;

  const stats = [
    {
      title: "Mis Mascotas",
      value: mascotas.length,
      icon: <img src={MascotasIcon} alt="Mascotas" className="h-10 w-10" />,
      statusLabel: "Registradas",
      statusColor: "green" as const,
      progress: Math.min(mascotas.length * 20, 100),
      backgroundClass: "bg-[#59b8ae]",
    },
    {
      title: "Citas\nagendadas",
      value: citas.length,
      icon: <img src={CitasIcon} alt="Citas" className="h-10 w-10" />,
      statusLabel: "Programadas",
      statusColor: "green" as const,
      progress: Math.min(citas.length * 20, 100),
      backgroundClass: "bg-[#4fb9d0]",
    },
    {
      title: "Clínicas",
      value: clinicas.length,
      icon: <img src={ClinicasIcon} alt="Clínicas" className="h-10 w-10" />,
      statusLabel: "Disponibles",
      statusColor: "green" as const,
      progress: Math.min(clinicas.length * 10, 100),
      backgroundClass: "bg-[#EBB771]",
    },
  ];

  const historial = citas.slice(0, 5).map((cita) => {
    const date = new Date(cita.fecha);
    return {
      titulo: cita.nombreTipoCita || "Consulta",
      hora: date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
      fecha: date.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" }),
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-slate-900">
            <span className="text-[#2db5a3]">¡Hola,</span>{" "}
            <span className="text-[#f97365]">{cliente?.nombCli ?? "User"}</span>
            <span className="text-[#2db5a3]">!</span>
          </h1>
          <p className="max-w-xl text-slate-500">
            Nuevo día cuidando las vidas de los engreídos de casa.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Profile dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex items-center gap-2 h-12 pl-1 pr-3 rounded-full bg-[#2db5a3] text-white shadow-sm hover:bg-[#259a8c] transition-colors"
              aria-label="Menú de usuario"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <User className="size-5" />
              </div>
              <ChevronDown className={`size-4 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-14 w-44 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 animate-[fadeSlideUp_0.15s_ease]">
                <button
                  onClick={() => { setMenuOpen(false); navigate("/perfil"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="size-4 text-[#2db5a3]" />
                  Ver perfil
                </button>
                <div className="h-px bg-slate-100 mx-2" />
                <button
                  onClick={async () => { setMenuOpen(false); await logout(); navigate("/login"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            statusLabel={stat.statusLabel}
            statusColor={stat.statusColor}
            progress={stat.progress}
            backgroundClass={stat.backgroundClass}
            delay={i * 100}
          />
        ))}
      </div>

      {/* Bottom section: acceso rápido + historial side by side on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        <section className="xl:col-span-2 space-y-4">
          <p className="text-[22px] font-bold uppercase tracking-[0.20em] text-[#2db5a3]">Acceso rápido</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <QuickAccessCard label="Dashboard" icon={<img src={DashboardIcon} alt="Dashboard" className="h-14 w-14" />} onClick={() => navigate("/inicio")} delay={0} />
            <QuickAccessCard label="Registrar Mascotas" icon={<img src={MascotasIcon} alt="Mascotas" className="h-14 w-14" />} onClick={() => navigate("/mascotas")} delay={80} />
            <QuickAccessCard label="Registrar Citas" icon={<img src={CitasIcon} alt="Citas" className="h-14 w-14" />} onClick={() => navigate("/citas")} delay={160} />
            <QuickAccessCard label="Ubicación" icon={<img src={ClinicasIcon} alt="Ubicación" className="h-14 w-14" />} onClick={() => navigate("/clinicas")} delay={240} />
          </div>
        </section>

        <Card className="xl:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between gap-4 bg-slate-50 px-6 py-4">
            <CardTitle className="text-[#2db5a3]">Historial de atención</CardTitle>
            <Button variant="link" className="text-[#2db5a3] p-0 h-auto text-sm ml-auto" onClick={() => navigate("/citas")}>
              Ver todas
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historial.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">Sin citas registradas aún.</p>
              ) : (
                historial.map((item, i) => (
                  <HistorialItem key={item.titulo + item.fecha} titulo={item.titulo} hora={item.hora} fecha={item.fecha} delay={i * 80} />
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default InicioPage;
