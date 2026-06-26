import { useState, useEffect } from "react";
import { Button, Input, Label } from "@components/ui";
import { Save, X } from "lucide-react";
import type { Mascota, TipoMascota, MascotaFormData } from "@appTypes";

interface EditarMascotaFormProps {
  mascota: Mascota;
  tiposMascota: TipoMascota[];
  onSubmit: (data: MascotaFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

function EditarMascotaForm({ mascota, tiposMascota, onSubmit, onCancel, loading = false }: EditarMascotaFormProps) {
  const [form, setForm] = useState<MascotaFormData>({
    nombMas: mascota.nombMas,
    idTipoMascota: mascota.idTipoMascota,
    idCliente: mascota.idCliente,
    apodos: mascota.apodos ?? "",
    alergias: mascota.alergias ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm({
      nombMas: mascota.nombMas,
      idTipoMascota: mascota.idTipoMascota,
      idCliente: mascota.idCliente,
      apodos: mascota.apodos ?? "",
      alergias: mascota.alergias ?? "",
    });
  }, [mascota]);

  const set = (field: keyof MascotaFormData, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.nombMas.trim()) e.nombMas = "El nombre es requerido";
    if (!form.idTipoMascota) e.idTipoMascota = "El tipo es requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-nombMas">Nombre *</Label>
          <Input id="edit-nombMas" value={form.nombMas} onChange={e => set("nombMas", e.target.value)}
            className={errors.nombMas ? "border-red-500" : ""} maxLength={25} />
          {errors.nombMas && <p className="text-red-500 text-xs mt-1">{errors.nombMas}</p>}
        </div>
        <div>
          <Label htmlFor="edit-tipo">Tipo *</Label>
          <select id="edit-tipo" value={form.idTipoMascota}
            onChange={e => set("idTipoMascota", Number(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#079f92] ${errors.idTipoMascota ? "border-red-500" : "border-gray-300"}`}
          >
            <option value={0}>Seleccionar tipo</option>
            {tiposMascota.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
          {errors.idTipoMascota && <p className="text-red-500 text-xs mt-1">{errors.idTipoMascota}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="edit-apodos">Apodos <span className="text-gray-400 font-normal">(opcional)</span></Label>
        <Input id="edit-apodos" value={form.apodos ?? ""} onChange={e => set("apodos", e.target.value)} maxLength={100} />
      </div>

      <div>
        <Label htmlFor="edit-alergias">Alergias / condiciones médicas <span className="text-gray-400 font-normal">(opcional)</span></Label>
        <textarea id="edit-alergias" value={form.alergias ?? ""} onChange={e => set("alergias", e.target.value)}
          rows={3} maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#079f92] resize-none" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button type="submit" disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold flex-1 sm:flex-initial">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Actualizando...
            </div>
          ) : (
            <div className="flex items-center gap-2"><Save className="size-4" /> Actualizar</div>
          )}
        </Button>
        <Button type="button" onClick={onCancel} disabled={loading}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold">
          <X className="size-4 mr-2" /> Cancelar
        </Button>
      </div>
    </form>
  );
}

export default EditarMascotaForm;
