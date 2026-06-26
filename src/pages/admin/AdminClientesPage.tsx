import { useEffect, useState } from "react";
import { Shield, User, Pencil, Trash2 } from "lucide-react";
import { clienteService } from "@services/cliente.service";
import type { Cliente } from "@appTypes";

type Modal = null | { mode: "create" } | { mode: "edit"; cliente: Cliente };

const emptyForm = { nombCli: "", apeCli: "", fecNac: "" };

function AdminClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Modal>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [changingRol, setChangingRol] = useState<number | null>(null);

  const load = () => clienteService.getAll().then(setClientes).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setModal({ mode: "create" }); };
  const openEdit = (c: Cliente) => {
    setForm({ nombCli: c.nombCli, apeCli: c.apeCli, fecNac: c.fecNac || "" });
    setModal({ mode: "edit", cliente: c });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (modal?.mode === "edit") {
        const updated = await clienteService.update(modal.cliente.id, form);
        setClientes(prev => prev.map(c => c.id === updated.id ? updated : c));
      }
      setModal(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este cliente? Se perderán sus mascotas y citas.")) return;
    setDeleting(id);
    try {
      await clienteService.delete(id);
      setClientes(prev => prev.filter(c => c.id !== id));
    } finally { setDeleting(null); }
  };

  const handleToggleRol = async (c: Cliente) => {
    const nuevoRol: 1 | 2 = c.idRol === 2 ? 1 : 2;
    setChangingRol(c.id);
    try {
      const updated = await clienteService.cambiarRol(c.id, nuevoRol);
      setClientes(prev => prev.map(x => x.id === updated.id ? updated : x));
    } finally { setChangingRol(null); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-500">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
          <p className="text-sm text-slate-500 mt-1">{clientes.length} registrados</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Fecha nac.</th>
                <th className="px-4 py-3 text-left">UID</th>
                <th className="px-4 py-3 text-left">Rol</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientes.map(c => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-400">#{c.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{c.nombCli} {c.apeCli}</td>
                  <td className="px-4 py-3 text-slate-500">{c.fecNac || "—"}</td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs truncate max-w-[120px]">{c.uid || "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggleRol(c)} disabled={changingRol === c.id}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50 ${
                        c.idRol === 2 ? "bg-teal-100 text-teal-700 hover:bg-teal-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}>
                      {c.idRol === 2 ? <Shield className="size-3" /> : <User className="size-3" />}
                      {changingRol === c.id ? "..." : (c.rolNombre ?? (c.idRol === 2 ? "admin" : "usuario"))}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil className="size-3.5" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
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

      {/* Modal editar */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">
              {modal.mode === "create" ? "Nuevo cliente" : "Editar cliente"}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600">Nombre *</label>
                <input value={form.nombCli} onChange={e => setForm(f => ({ ...f, nombCli: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600">Apellido *</label>
                <input value={form.apeCli} onChange={e => setForm(f => ({ ...f, apeCli: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-600">Fecha nacimiento (dd/MM/yyyy)</label>
                <input value={form.fecNac} onChange={e => setForm(f => ({ ...f, fecNac: e.target.value }))}
                  placeholder="15/03/1990"
                  className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
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

export default AdminClientesPage;
