import { useEffect, useState } from "react";
import { Users, PawPrint, Calendar, Building2 } from "lucide-react";
import { clienteService } from "@services/cliente.service";
import { mascotaService } from "@services/mascota.service";
import { citaService } from "@services/cita.service";
import { catalogoService } from "@services/catalogo.service";
import type { Cliente, Mascota, Cita, Clinica } from "@appTypes";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
        <Icon className="size-6 text-white" />
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function AdminPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      clienteService.getAll().catch(() => [] as Cliente[]),
      mascotaService.getAll().catch(() => [] as Mascota[]),
      citaService.getAll().catch(() => [] as Cita[]),
      catalogoService.getClinicas().catch(() => [] as Clinica[]),
    ]).then(([c, m, ci, cl]) => {
      setClientes(c);
      setMascotas(m);
      setCitas(ci);
      setClinicas(cl);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500">Cargando...</div>;

  const proximasCitas = [...citas]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Panel de Administración</h1>
        <p className="text-sm text-slate-500 mt-1">Visión general del sistema Suri Firuvet</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Clientes registrados" value={clientes.length} icon={Users}     color="bg-teal-500" />
        <StatCard label="Mascotas"              value={mascotas.length} icon={PawPrint}  color="bg-orange-400" />
        <StatCard label="Citas totales"         value={citas.length}    icon={Calendar}  color="bg-blue-500" />
        <StatCard label="Clínicas"              value={clinicas.length} icon={Building2} color="bg-violet-500" />
      </div>

      {/* Últimas citas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-700">Últimas citas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Tipo</th>
                <th className="px-6 py-3 text-left">Mascota</th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Clínica</th>
                <th className="px-6 py-3 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {proximasCitas.map((cita) => (
                <tr key={cita.idCita} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-slate-400">#{cita.idCita}</td>
                  <td className="px-6 py-3 font-medium text-slate-700">{cita.nombreTipoCita}</td>
                  <td className="px-6 py-3 text-slate-600">{cita.nombreMascota}</td>
                  <td className="px-6 py-3 text-slate-600">{cita.nombreCliente}</td>
                  <td className="px-6 py-3 text-slate-600">{cita.nombreClinica}</td>
                  <td className="px-6 py-3 text-slate-500">
                    {new Date(cita.fecha).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
              {proximasCitas.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">Sin citas registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
