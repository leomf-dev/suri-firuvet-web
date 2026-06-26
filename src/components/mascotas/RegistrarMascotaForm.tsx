import { useState } from "react";
import { Button, Input, Label } from "@components/ui";
import { X } from "lucide-react";
import type { TipoMascota, MascotaFormData } from "@appTypes";
import registrarIcon from "../../assets/REGISTRAR MASCOTAS.png";

interface RegistrarMascotaFormProps {
  tiposMascota: TipoMascota[];
  onSubmit: (data: MascotaFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

function RegistrarMascotaForm({ tiposMascota, onSubmit, onCancel, loading = false }: RegistrarMascotaFormProps) {
  const [form, setForm] = useState<Omit<MascotaFormData, "idCliente">>({
    nombMas: "", idTipoMascota: 0, apodos: "", alergias: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: keyof typeof form, value: string | number) =>
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
    if (validate()) onSubmit({ ...form, idCliente: 0 }); // idCliente lo pone la página
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombMas">Nombre *</Label>
          <Input id="nombMas" value={form.nombMas} onChange={e => set("nombMas", e.target.value)}
            placeholder="Ej: Max, Luna" className={errors.nombMas ? "border-red-500" : ""} maxLength={25} />
          {errors.nombMas && <p className="text-red-500 text-xs mt-1">{errors.nombMas}</p>}
        </div>
        <div>
          <Label htmlFor="idTipoMascota">Tipo *</Label>
          <select id="idTipoMascota" value={form.idTipoMascota}
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
        <Label htmlFor="apodos">Apodos <span className="text-gray-400 font-normal">(opcional)</span></Label>
        <Input id="apodos" value={form.apodos ?? ""} onChange={e => set("apodos", e.target.value)}
          placeholder="Ej: Peludo, Chiquito" maxLength={100} />
      </div>

      <div>
        <Label htmlFor="alergias">Alergias / condiciones médicas <span className="text-gray-400 font-normal">(opcional)</span></Label>
        <textarea id="alergias" value={form.alergias ?? ""} onChange={e => set("alergias", e.target.value)}
          rows={3} maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#079f92] resize-none"
          placeholder="Ej: Alérgico al pollo, asma..." />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button type="submit" disabled={loading}
          className="bg-[#079f92] hover:bg-[#078c80] text-white px-6 py-3 rounded-lg font-bold flex-1 sm:flex-initial">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Guardando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <img src={registrarIcon} alt="" className="size-4" />
              Registrar Mascota
            </div>
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

export default RegistrarMascotaForm;
