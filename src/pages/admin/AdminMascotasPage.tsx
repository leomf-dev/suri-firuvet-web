import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { mascotaService } from "@services/mascota.service";
import { catalogoService } from "@services/catalogo.service";
import { clienteService } from "@services/cliente.service";
import type { Mascota, TipoMascota, Cliente } from "@appTypes";

type Modal = null | { mode: "create" } | { mode: "edit"; mascota: Mascota };

const emptyForm = { nombMas: "", idTipoMascota: 0, idCliente: 0, apodos: "", alergias: "" };

function AdminMascotasPage() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [tipos, setTipos] = useState<TipoMascota[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      mascotaService.getAll(),
      catalogoService.getTiposMascota(),
      clienteService.getAll(),
    ]).then(([m, t, c]) => {
      setMascotas(m);
      setTipos(t.map(x => ({ ...x, id: Number(x.id) })));
      setClientes(c);
    }).finally(() => setLoading(false));
  }, []);

  const openCreate = () => { setForm(emptyForm); setModal({ mode: "create" }); };
  const openEdit = (m: Mascota) => {
    setForm({ nombMas: m.nombMas, idTipoMascota: m.idTipoMascota, idCliente: m.idCliente, apodos: m.apodos ?? "", alergias: m.alergias ?? "" });
    setModal({ mode: "edit", mascota: m });
  };

  const handleSave = async () => {
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.mode === "create") {
        const nueva = await mascotaService.registrar(form);
        if (nueva) {
          const all = await mascotaService.getAll();
          setMascotas(all);
        }
      } else {
        const updated = await mascotaService.update(modal.mascota.id, { ...form });
        setMascotas(prev => prev.map(m => m.id === updated.id ? updated : m));
      }
      setModal(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async (m: Mascota) => {
    if (!confirm(`¿Eliminar a ${m.nombMas}?`)) return;
    setDeleting(m.id);
    try {
      await mascotaService.delete(m.id, m.idCliente);
      setMascotas(prev => prev.filter(x => x.id !== m.id));
    } finally { setDeleting(null); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mascotas</h1>
          <p className="text-sm text-slate-500 mt-1">{mascotas.length} registradas</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus className="size-4" /> Nueva mascota
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Apodos</th>
                <th className="px-4 py-3 text-left">Alergias</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mascotas.map(m => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">#{m.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{m.nombMas}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">{m.nombreTipo}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">#{m.idCliente}</td>
                  <td className="px-4 py-3 text-slate-500 italic">{m.apodos || "—"}</td>
                  <td className="px-4 py-3">
                    {m.alergias
                      ? <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs">{m.alergias}</span>
                      : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(m)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil className="size-3.5" />
                      </button>
                      <button onClick={() => handleDelete(m)} disabled={deleting === m.id}
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">
              {modal.mode === "create" ? "Nueva mascota" : `Editar mascota #${modal.mascota.id}`}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600">Nombre *</label>
                <input value={form.nombMas} onChange={e => setForm(f => ({ ...f, nombMas: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Tipo *</label>
                <select value={form.idTipoMascota} onChange={e => setForm(f => ({ ...f, idTipoMascota: Number(e.target.value) }))}
                  className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value={0}>Seleccionar...</option>
                  {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
              </div>
              {modal.mode === "create" && (
                <div>
                  <label className="text-xs font-medium text-slate-600">Cliente *</label>
                  <select value={form.idCliente} onChange={e => setForm(f => ({ ...f, idCliente: Number(e.target.value) }))}
                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value={0}>Seleccionar...</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombCli} {c.apeCli} (#{c.id})</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-600">Apodos</label>
                <input value={form.apodos} onChange={e => setForm(f => ({ ...f, apodos: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Alergias</label>
                <textarea value={form.alergias} onChange={e => setForm(f => ({ ...f, alergias: e.target.value }))} rows={2}
                  className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
              </div>
            </div>
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

export default AdminMascotasPage;
