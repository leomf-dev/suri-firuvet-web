import { useEffect, useState } from "react";
import { eventoLogService } from "@services/evento-log.service";
import type { EventoLog } from "@appTypes";

const TIPO_COLORS: Record<string, string> = {
  CREACIÓN:       "bg-green-100 text-green-700",
  ACTUALIZACIÓN:  "bg-blue-100 text-blue-700",
  ELIMINACIÓN:    "bg-red-100 text-red-700",
  CLIENTE_CREADO:    "bg-green-100 text-green-700",
  CLIENTE_MODIFICADO:"bg-blue-100 text-blue-700",
  CLIENTE_ELIMINADO: "bg-red-100 text-red-700",
};

function getBadge(tipo: string) {
  const cls = TIPO_COLORS[tipo] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {tipo}
    </span>
  );
}

function AdminLogsPage() {
  const [logs, setLogs] = useState<EventoLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    eventoLogService.getAll().then(setLogs).finally(() => setLoading(false));
  }, []);

  const filtered = filtro
    ? logs.filter(l =>
        l.modulo?.toLowerCase().includes(filtro.toLowerCase()) ||
        l.tipoEvento?.toLowerCase().includes(filtro.toLowerCase()) ||
        l.uid?.toLowerCase().includes(filtro.toLowerCase()) ||
        l.descripcion?.toLowerCase().includes(filtro.toLowerCase())
      )
    : logs;

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Auditoría</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} eventos</p>
        </div>
        <input
          type="text"
          placeholder="Buscar por módulo, tipo, uid..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Módulo</th>
                <th className="px-4 py-3 text-left">Acción</th>
                <th className="px-4 py-3 text-left">Entidad / ID</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-left">UID</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    Sin registros
                  </td>
                </tr>
              ) : (
                filtered.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-xs">#{log.id}</td>
                    <td className="px-4 py-3">{getBadge(log.tipoEvento)}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{log.modulo}</td>
                    <td className="px-4 py-3 text-slate-600">{log.accion}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {log.entidad} #{log.idRegistro}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate" title={log.descripcion}>
                      {log.descripcion}
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono text-xs truncate max-w-[100px]" title={log.uid}>
                      {log.uid || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {log.creadoEn
                        ? new Date(log.creadoEn).toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        log.estado === "Activo" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {log.estado}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminLogsPage;
