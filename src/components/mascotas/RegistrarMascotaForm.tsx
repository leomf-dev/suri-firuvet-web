import { useState } from "react";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Label } from "@components/ui/Label";
import { Save, X } from "lucide-react";
import { TIPOS_MASCOTA } from "@appTypes/database";
import registrarIcon from "../../assets/REGISTRAR MASCOTAS.png";

interface RegistrarMascotaFormProps {
  onSubmit: (mascota: MascotaFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface MascotaFormData {
  nombmas: string;
  tipomas: number;
  raza: string;
  edad: string;
  peso: string;
  color: string;
  genero: string;
  fechaNacimiento: string;
  apodos: string;
  alergias: string;
}

const generos = [
  { value: "M", label: "Macho" },
  { value: "H", label: "Hembra" }
];

function RegistrarMascotaForm({ onSubmit, onCancel, loading = false }: RegistrarMascotaFormProps) {
  const [formData, setFormData] = useState<MascotaFormData>({
    nombmas: "",
    tipomas: 0,
    raza: "",
    edad: "",
    peso: "",
    color: "",
    genero: "",
    fechaNacimiento: "",
    apodos: "",
    alergias: ""
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleStringChange = (field: keyof MascotaFormData, value: string) => {
    if (field === 'tipomas') return; // Este campo es numérico
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleNumberChange = (field: 'tipomas', value: string) => {
    const numValue = Number(value);
    setFormData(prev => ({ ...prev, [field]: numValue }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nombmas.trim()) newErrors.nombmas = "El nombre es requerido";
    if (!formData.tipomas || formData.tipomas === 0) newErrors.tipomas = "El tipo es requerido";
    if (!formData.raza.trim()) newErrors.raza = "La raza es requerida";
    if (!formData.genero) newErrors.genero = "El género es requerido";
    
    if (formData.edad && (isNaN(Number(formData.edad)) || Number(formData.edad) < 0)) {
      newErrors.edad = "La edad debe ser un número válido";
    }
    
    if (formData.peso && (isNaN(Number(formData.peso)) || Number(formData.peso) <= 0)) {
      newErrors.peso = "El peso debe ser un número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Fila 1: Nombre y Tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombmas">Nombre de la mascota *</Label>
          <Input
            id="nombmas"
            value={formData.nombmas}
            onChange={(e) => handleStringChange("nombmas", e.target.value)}
            placeholder="Ej: Max, Luna, Firulais"
            className={errors.nombmas ? "border-red-500" : ""}
            maxLength={25}
          />
          {errors.nombmas && <p className="text-red-500 text-sm mt-1">{errors.nombmas}</p>}
        </div>

        <div>
          <Label htmlFor="tipomas">Tipo de mascota *</Label>
          <select
            id="tipomas"
            value={formData.tipomas}
            onChange={(e) => handleNumberChange("tipomas", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#079f92] ${
              errors.tipomas ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value={0}>Seleccionar tipo</option>
            {TIPOS_MASCOTA.map(tipo => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
          {errors.tipomas && <p className="text-red-500 text-sm mt-1">{errors.tipomas}</p>}
        </div>
      </div>

      {/* Fila 2: Raza y Género */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="raza">Raza *</Label>
          <Input
            id="raza"
            value={formData.raza}
            onChange={(e) => handleStringChange("raza", e.target.value)}
            placeholder="Ej: Labrador, Siamés, Mestizo"
            className={errors.raza ? "border-red-500" : ""}
          />
          {errors.raza && <p className="text-red-500 text-sm mt-1">{errors.raza}</p>}
        </div>

        <div>
          <Label htmlFor="genero">Género *</Label>
          <select
            id="genero"
            value={formData.genero}
            onChange={(e) => handleStringChange("genero", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#079f92] ${
              errors.genero ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Seleccionar género</option>
            {generos.map(genero => (
              <option key={genero.value} value={genero.value}>{genero.label}</option>
            ))}
          </select>
          {errors.genero && <p className="text-red-500 text-sm mt-1">{errors.genero}</p>}
        </div>
      </div>

      {/* Fila 3: Edad, Peso y Color */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="edad">Edad (años)</Label>
          <Input
            id="edad"
            type="number"
            min="0"
            step="0.1"
            value={formData.edad}
            onChange={(e) => handleStringChange("edad", e.target.value)}
            placeholder="Ej: 2.5"
            className={errors.edad ? "border-red-500" : ""}
          />
          {errors.edad && <p className="text-red-500 text-sm mt-1">{errors.edad}</p>}
        </div>

        <div>
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input
            id="peso"
            type="number"
            min="0"
            step="0.1"
            value={formData.peso}
            onChange={(e) => handleStringChange("peso", e.target.value)}
            placeholder="Ej: 15.5"
            className={errors.peso ? "border-red-500" : ""}
          />
          {errors.peso && <p className="text-red-500 text-sm mt-1">{errors.peso}</p>}
        </div>

        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => handleStringChange("color", e.target.value)}
            placeholder="Ej: Marrón, Negro, Blanco"
          />
        </div>
      </div>

      {/* Fecha de nacimiento */}
      <div>
        <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
        <Input
          id="fechaNacimiento"
          type="date"
          value={formData.fechaNacimiento}
          onChange={(e) => handleStringChange("fechaNacimiento", e.target.value)}
        />
      </div>

      {/* Apodos */}
      <div>
        <Label htmlFor="apodos">Apodos o nombres cariñosos</Label>
        <Input
          id="apodos"
          value={formData.apodos}
          onChange={(e) => handleStringChange("apodos", e.target.value)}
          placeholder="Ej: Peludo, Chiquito, Gordito"
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">Opcional - Otros nombres por los que conocen a tu mascota</p>
      </div>

      {/* Alergias */}
      <div>
        <Label htmlFor="alergias">Alergias o condiciones médicas</Label>
        <textarea
          id="alergias"
          value={formData.alergias}
          onChange={(e) => handleStringChange("alergias", e.target.value)}
          placeholder="Ej: Alérgico al pollo, asma, displasia de cadera..."
          rows={3}
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#079f92] resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">Opcional - Información médica importante para el veterinario</p>
      </div>

      {/* Información importante */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-800 mb-2">📋 Información importante</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• La mascota será asociada a tu cuenta automáticamente</li>
          <li>• Todos los campos marcados con * son obligatorios</li>
          <li>• Podrás editar esta información después del registro</li>
          <li>• Es importante mantener actualizada la información médica</li>
        </ul>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#079f92] hover:bg-[#078c80] text-white px-6 py-3 rounded-lg font-bold flex-1 sm:flex-initial"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Guardando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <img src={registrarIcon} alt="Registrar Cita" className="size-4 sm:size-5 mr-2" />
              Registrar Mascota
            </div>
          )}
        </Button>

        <Button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold flex-1 sm:flex-initial"
        >
          <X className="size-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export default RegistrarMascotaForm;
export type { MascotaFormData };