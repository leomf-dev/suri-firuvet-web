import { useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/Card";
import { Button } from "@components/ui/Button";
import { StatCard, QuickAccessCard, HistorialItem } from "@components/inicio";
import { clientes, mascotas, citas, clinicas, tipoCitas } from "@services";
import MascotasIcon from "@assets/MASCOTAS.svg";
import CitasIcon from "@assets/CITAS.svg";
import ClinicasIcon from "@assets/CLINICAS.svg";
import DashboardIcon from "@assets/DASHBOARD.svg";

const stats = [
  {
    title: "Clientes",
    value: clientes.length,
    icon: <img src={DashboardIcon} alt="Clientes" className="h-10 w-10" />,
    statusLabel: "Registrados",
    statusColor: "green" as const,
    progress: Math.round((clientes.length / 10) * 100),
    backgroundClass: "bg-[#ED6E5C]",
  },
  {
    title: "Mascotas",
    value: mascotas.length,
    icon: <img src={MascotasIcon} alt="Mascotas" className="h-10 w-10" />,
    statusLabel: "Registradas",
    statusColor: "green" as const,
    progress: Math.round((mascotas.length / 10) * 100),
    backgroundClass: "bg-[#59b8ae]",
  },
  {
    title: "Citas\nagendadas",
    value: citas.length,
    icon: <img src={CitasIcon} alt="Citas" className="h-10 w-10" />,
    statusLabel: "Proceso",
    statusColor: "green" as const,
    progress: Math.round((citas.length / 10) * 100),
    backgroundClass: "bg-[#4fb9d0]",
  },
  {
    title: "Clínicas",
    value: clinicas.length,
    icon: <img src={ClinicasIcon} alt="Clínicas" className="h-10 w-10" />,
    statusLabel: "Disponibles",
    statusColor: "green" as const,
    progress: Math.round((clinicas.length / 10) * 100),
    backgroundClass: "bg-[#EBB771]",
  },
];

const historial = citas.map((cita) => {
  const tipo = tipoCitas.find((t) => t.id === cita.tipocita);
  const date = new Date(cita.fecha);
  return {
    titulo: tipo?.nombre ?? "Consulta",
    hora: date.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" }),
    fecha: date.toLocaleDateString("es-VE", { day: "numeric", month: "long", year: "numeric" }),
  };
});

function InicioPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-slate-900">
            <span className="text-[#2db5a3]">¡Hola,</span> <span className="text-[#f97365]">User</span><span className="text-[#2db5a3]">!</span>
          </h1>
          <p className="max-w-xl text-slate-500">
            Nuevo día cuidando las vidas de los engreídos de casa.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar"
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 shadow-sm focus:border-[#2db5a3] focus:outline-none"
            />
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2db5a3] text-white shadow-sm">
            <User className="size-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            statusLabel={stat.statusLabel}
            statusColor={stat.statusColor}
            progress={stat.progress}
            backgroundClass={stat.backgroundClass}
          />
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[24px] font-bold uppercase tracking-[0.20em] text-[#2db5a3]"> Acceso rápido</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <QuickAccessCard
            label="Dashboard"
            icon={<img src={DashboardIcon} alt="Dashboard" className="h-14 w-14" />}
            onClick={() => navigate("/inicio")}
          />
          <QuickAccessCard
            label="Registrar Mascotas"
            icon={<img src={MascotasIcon} alt="Mascotas" className="h-14 w-14" />}
            onClick={() => navigate("/mascotas")}
          />
          <QuickAccessCard
            label="Registrar Citas"
            icon={<img src={CitasIcon} alt="Citas" className="h-14 w-14" />}
            onClick={() => navigate("/citas")}
          />
          <QuickAccessCard
            label="Ubicación"
            icon={<img src={ClinicasIcon} alt="Ubicación" className="h-14 w-14" />}
            onClick={() => navigate("/clinicas")}
          />
        </div>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 bg-slate-50 px-6 py-4">
          <CardTitle className="text-[#2db5a3]">Historial de atención</CardTitle>
            <Button 
              variant="link" 
              className="text-[#2db5a3] p-0 h-auto text-sm ml-auto"
              onClick={() => navigate("/citas")}
            >
              Ver todas
            </Button>        
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {historial.map((item) => (
              <HistorialItem
                key={item.titulo + item.fecha}
                titulo={item.titulo}
                hora={item.hora}
                fecha={item.fecha}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InicioPage;
