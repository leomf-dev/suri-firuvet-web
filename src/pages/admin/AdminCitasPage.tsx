import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { citaService } from "@services/cita.service";
import { catalogoService } from "@services/catalogo.service";
import { mascotaService } from "@services/mascota.service";
import { clienteService } from "@services/cliente.service";
import type { Cita, TipoCita, Mascota, Cliente, Clinica, CitaFormData } from "@appTypes";

type Modal = null | { mode: "create" } | { mode: "edit"; cita: Cita };

const emptyCreateForm: CitaFormData = { idTipoCita: 0, fecha: "", comentario: "", idMascota: 0, idCliente: 0, idClinica: 0 };

function AdminCitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [tipos, setTipos] = useState<TipoCita[]>([]);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [editForm, setEditForm] = useState({ idTipoCita: 0, fecha: "", comentario: "" });
  const [createForm, setCreateForm] = useState<CitaFormData>(emptyCreateForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      citaService.getAll(),
      catalogoService.getTiposCita(),
      catalogoService.getClinicas(),
      mascotaService.getAll(),
      clienteService.getAll(),
    ]).then(([c, t, cl, m, cli]) => {
      setCitas(c);
      setTipos(t.map(x => ({ ...x, id: Number(x.id) })));
      setClinicas(cl.map(x => ({ ...x, id: Number(x.id) })));
      setMascotas(m);
      setClientes(cli);
    }).finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setCreateForm(emptyCreateForm); setModal({ mode: "create" }); };
  const openEdit = (c: Cita) => {
    const tipo = tipos.find(t => t.nombre === c.nombreTipoCita);
    setEditForm({ idTipoCita: tipo?.id ?? 0, fecha: c.fecha ? c.fecha.slice(0, 16) : "", comentario: c.comentario || "" });
    setModal({ mode: "edit", cita: c });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal?.mode === "edit") {
        await citaService.update(modal.cita.idCita, {
          idTipoCita: editForm.idTipoCita,
          fecha: editForm.fecha,
          comentario: editForm.comentario,
          idMascota: modal.cita.idMascota,
          idCliente: modal.cita.idCliente,
          idClinica: modal.cita.idClinica,
        });
      } else if (modal?.mode === "create") {
        await citaService.create(createForm);
      }
      const updated = await citaService.getAll();
      setCitas(updated);
      setModal(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async (c: Cita) => {
    if (!confirm(`¿Eliminar cita #${c.idCita}?`)) return;
    setDeleting(c.idCita);
    try {
      await citaService.delete(c.idCita, c.idCliente);
      setCitas(prev => prev.filter(x => x.idCita !== c.idCita));
    } finally { setDeleting(null); }
  };

  // Mascotas filtradas por cliente seleccionado en create
  const mascotasDelCliente = mascotas.filter(m => m.idCliente === createForm.idCliente);

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Citas</h1>
          <p className="text-sm text-slate-500 mt-1">{citas.length} en total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus className="size-4" /> Nueva cita
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Mascota</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Clínica</th>
                <th className="px-4 py-3 text-left">Comentario</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {citas.map(c => (
                <tr key={c.idCita} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">#{c.idCita}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{c.nombreTipoCita}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap text-xs">
                    {new Date(c.fecha).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                    <span className="text-slate-400 ml-1">{new Date(c.fecha).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{c.nombreMascota}</td>
                  <td className="px-4 py-3 text-slate-600">{c.nombreCliente}</td>
                  <td className="px-4 py-3 text-slate-600">{c.nombreClinica}</td>
                  <td className="px-4 py-3 text-slate-400 truncate max-w-[140px]">{c.comentario || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil className="size-3.5" />
                      </button>
                      <button onClick={() => handleDelete(c)} disabled={deleting === c.idCita}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-800">
              {modal.mode === "create" ? "Nueva cita" : `Editar cita #${modal.cita.idCita}`}
            </h2>

            {modal.mode === "create" ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600">Cliente *</label>
                  <select value={createForm.idCliente} onChange={e => setCreateForm(f => ({ ...f, idCliente: Number(e.target.value), idMascota: 0 }))}
                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value={0}>Seleccionar...</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombCli} {c.apeCli}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Mascota *</label>
                  <select value={createForm.idMascota} onChange={e => setCreateForm(f => ({ ...f, idMascota: Number(e.target.value) }))}
                    disabled={!createForm.idCliente}
                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50">
                    <option value={0}>Seleccionar...</option>
                    {mascotasDelCliente.map(m => <option key={m.id} value={m.id}>{m.nombMas}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Tipo de cita *</label>
                  <select value={createForm.idTipoCita} onChange={e => setCreateForm(f => ({ ...f, idTipoCita: Number(e.target.value) }))}
                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value={0}>Seleccionar...</option>
                    {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Clínica *</label>
                  <select value={createForm.idClinica} onChange={e => setCreateForm(f => ({ ...f, idClinica: Number(e.target.value) }))}
                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value={0}>Seleccionar...</option>
                    {clinicas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Fecha y hora *</label>
                  <input type="datetime-local" value={createForm.fecha} onChange={e => setCreateForm(f => ({ ...f, fecha: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Comentario</label>
                  <textarea value={createForm.comentario} onChange={e => setCreateForm(f => ({ ...f, comentario: e.target.value }))} rows={2}
                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {modal.mode === "edit" && <p className="text-xs text-slate-500">Mascota: <strong>{modal.cita.nombreMascota}</strong> — Cliente: <strong>{modal.cita.nombreCliente}</strong></p>}
                <div>
                  <label className="text-xs font-medium text-slate-600">Tipo de cita</label>
                  <select value={editForm.idTipoCita} onChange={e => setEditForm(f => ({ ...f, idTipoCita: Number(e.target.value) }))}
                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value={0}>Seleccionar...</option>
                    {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Fecha y hora</label>
                  <input type="datetime-local" value={editForm.fecha} onChange={e => setEditForm(f => ({ ...f, fecha: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Comentario</label>
                  <textarea value={editForm.comentario} onChange={e => setEditForm(f => ({ ...f, comentario: e.target.value }))} rows={3}
                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar"}
              </button>
              <button onClick={() => setModal(null)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCitasPage;
