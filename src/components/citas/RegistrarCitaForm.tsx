import { useState, useEffect } from "react";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Label } from "@components/ui/Label";
import { Save, X, Calendar, Clock } from "lucide-react";
import registrarIcon from "../../assets/REGISTRAR CITAS.png";

interface RegistrarCitaFormProps {
  onSubmit: (cita: CitaFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface CitaFormData {
  fecha: string;
  hora: string;
  motivo: string;
  observaciones: string;
  dueñoNombre: string;
  dueñoTelefono: string;
  dueñoEmail: string;
  mascotaNombre: string;
  mascotaTipo: string;
  mascotaRaza: string;
  mascotaEdad: string;
  veterinario: string;
  clinica: string;
  clinicaDireccion: string;
}

const tiposMascota = [
  { value: "Perro", label: "Perro" },
  { value: "Gato", label: "Gato" },
  { value: "Conejo", label: "Conejo" },
  { value: "Ave", label: "Ave" },
  { value: "Otro", label: "Otro" }
];

const veterinarios = [
  { value: "Dr. Carlos Mendoza", label: "Dr. Carlos Mendoza" },
  { value: "Dra. Ana Ramos", label: "Dra. Ana Ramos" },
  { value: "Dr. Miguel Torres", label: "Dr. Miguel Torres" },
  { value: "Dra. Patricia Silva", label: "Dra. Patricia Silva" },
  { value: "Dr. Ricardo Vega", label: "Dr. Ricardo Vega" },
  { value: "Dr. Luis Herrera", label: "Dr. Luis Herrera" }
];

const clinicas = [
  { 
    value: "Clínica Veterinaria San Marcos", 
    label: "Clínica Veterinaria San Marcos",
    direccion: "Av. Javier Prado 123, San Isidro"
  },
  { 
    value: "Hospital Veterinario Central", 
    label: "Hospital Veterinario Central",
    direccion: "Jr. Las Flores 456, Miraflores"
  },
  { 
    value: "Clínica Dental Veterinaria", 
    label: "Clínica Dental Veterinaria",
    direccion: "Av. Larco 789, San Isidro"
  }
];

function RegistrarCitaForm({ onSubmit, onCancel, loading = false }: RegistrarCitaFormProps) {
  const [formData, setFormData] = useState<CitaFormData>({
    fecha: "",
    hora: "",
    motivo: "",
    observaciones: "",
    dueñoNombre: "",
    dueñoTelefono: "",
    dueñoEmail: "",
    mascotaNombre: "",
    mascotaTipo: "",
    mascotaRaza: "",
    mascotaEdad: "",
    veterinario: "",
    clinica: "",
    clinicaDireccion: ""
  });

  const [errors, setErrors] = useState<Partial<CitaFormData>>({});

  // Actualizar dirección automáticamente cuando se selecciona una clínica
  useEffect(() => {
    if (formData.clinica) {
      const clinicaSeleccionada = clinicas.find(c => c.value === formData.clinica);
      if (clinicaSeleccionada) {
        setFormData(prev => ({ ...prev, clinicaDireccion: clinicaSeleccionada.direccion }));
      }
    }
  }, [formData.clinica]);

  const handleChange = (field: keyof CitaFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CitaFormData> = {};

    // Campos requeridos
    if (!formData.fecha) newErrors.fecha = "La fecha es requerida";
    if (!formData.hora) newErrors.hora = "La hora es requerida";
    if (!formData.motivo.trim()) newErrors.motivo = "El motivo es requerido";
    if (!formData.dueñoNombre.trim()) newErrors.dueñoNombre = "El nombre del dueño es requerido";
    if (!formData.dueñoTelefono.trim()) newErrors.dueñoTelefono = "El teléfono es requerido";
    if (!formData.mascotaNombre.trim()) newErrors.mascotaNombre = "El nombre de la mascota es requerido";
    if (!formData.mascotaTipo) newErrors.mascotaTipo = "El tipo de mascota es requerido";
    if (!formData.veterinario) newErrors.veterinario = "El veterinario es requerido";
    if (!formData.clinica) newErrors.clinica = "La clínica es requerida";

    // Validar fecha no sea en el pasado
    if (formData.fecha) {
      const fechaSeleccionada = new Date(formData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaSeleccionada < hoy) {
        newErrors.fecha = "La fecha no puede ser en el pasado";
      }
    }

    // Validar formato de email si se proporciona
    if (formData.dueñoEmail && !formData.dueñoEmail.includes("@")) {
      newErrors.dueñoEmail = "Email no válido";
    }

    // Validar teléfono
    if (formData.dueñoTelefono && formData.dueñoTelefono.length < 9) {
      newErrors.dueñoTelefono = "Teléfono debe tener al menos 9 dígitos";
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

  // Obtener fecha mínima (hoy)
  const fechaMinima = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica de la cita */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
          <Calendar className="size-5 text-[#079f92]" />
          Información de la Cita
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="fecha">Fecha *</Label>
            <Input
              id="fecha"
              type="date"
              min={fechaMinima}
              value={formData.fecha}
              onChange={(e) => handleChange("fecha", e.target.value)}
              className={errors.fecha ? "border-red-500" : ""}
            />
            {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>}
          </div>

          <div>
            <Label htmlFor="hora">Hora *</Label>
            <Input
              id="hora"
              type="time"
              value={formData.hora}
              onChange={(e) => handleChange("hora", e.target.value)}
              className={errors.hora ? "border-red-500" : ""}
            />
            {errors.hora && <p className="text-red-500 text-sm mt-1">{errors.hora}</p>}
          </div>

          <div>
            <Label htmlFor="veterinario">Veterinario *</Label>
            <select
              id="veterinario"
              value={formData.veterinario}
              onChange={(e) => handleChange("veterinario", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#079f92] ${
                errors.veterinario ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar veterinario</option>
              {veterinarios.map(vet => (
                <option key={vet.value} value={vet.value}>{vet.label}</option>
              ))}
            </select>
            {errors.veterinario && <p className="text-red-500 text-sm mt-1">{errors.veterinario}</p>}
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="motivo">Motivo de la consulta *</Label>
          <textarea
            id="motivo"
            value={formData.motivo}
            onChange={(e) => handleChange("motivo", e.target.value)}
            placeholder="Describe el motivo de la cita..."
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#079f92] resize-none ${
              errors.motivo ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.motivo && <p className="text-red-500 text-sm mt-1">{errors.motivo}</p>}
        </div>
      </div>

      {/* Información del dueño */}
      <div className="bg-blue-50 p-4 rounded-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Información del Dueño</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dueñoNombre">Nombre completo *</Label>
            <Input
              id="dueñoNombre"
              value={formData.dueñoNombre}
              onChange={(e) => handleChange("dueñoNombre", e.target.value)}
              placeholder="Ej: María García López"
              className={errors.dueñoNombre ? "border-red-500" : ""}
            />
            {errors.dueñoNombre && <p className="text-red-500 text-sm mt-1">{errors.dueñoNombre}</p>}
          </div>

          <div>
            <Label htmlFor="dueñoTelefono">Teléfono *</Label>
            <Input
              id="dueñoTelefono"
              type="tel"
              value={formData.dueñoTelefono}
              onChange={(e) => handleChange("dueñoTelefono", e.target.value)}
              placeholder="Ej: +51 987 654 321"
              className={errors.dueñoTelefono ? "border-red-500" : ""}
            />
            {errors.dueñoTelefono && <p className="text-red-500 text-sm mt-1">{errors.dueñoTelefono}</p>}
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="dueñoEmail">Email (opcional)</Label>
          <Input
            id="dueñoEmail"
            type="email"
            value={formData.dueñoEmail}
            onChange={(e) => handleChange("dueñoEmail", e.target.value)}
            placeholder="Ej: maria.garcia@email.com"
            className={errors.dueñoEmail ? "border-red-500" : ""}
          />
          {errors.dueñoEmail && <p className="text-red-500 text-sm mt-1">{errors.dueñoEmail}</p>}
        </div>
      </div>

      {/* Información de la mascota */}
      <div className="bg-green-50 p-4 rounded-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Información de la Mascota</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mascotaNombre">Nombre de la mascota *</Label>
            <Input
              id="mascotaNombre"
              value={formData.mascotaNombre}
              onChange={(e) => handleChange("mascotaNombre", e.target.value)}
              placeholder="Ej: Max, Luna, Rocky"
              className={errors.mascotaNombre ? "border-red-500" : ""}
            />
            {errors.mascotaNombre && <p className="text-red-500 text-sm mt-1">{errors.mascotaNombre}</p>}
          </div>

          <div>
            <Label htmlFor="mascotaTipo">Tipo *</Label>
            <select
              id="mascotaTipo"
              value={formData.mascotaTipo}
              onChange={(e) => handleChange("mascotaTipo", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#079f92] ${
                errors.mascotaTipo ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar tipo</option>
              {tiposMascota.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
            {errors.mascotaTipo && <p className="text-red-500 text-sm mt-1">{errors.mascotaTipo}</p>}
          </div>

          <div>
            <Label htmlFor="mascotaRaza">Raza</Label>
            <Input
              id="mascotaRaza"
              value={formData.mascotaRaza}
              onChange={(e) => handleChange("mascotaRaza", e.target.value)}
              placeholder="Ej: Golden Retriever, Siamés"
            />
          </div>

          <div>
            <Label htmlFor="mascotaEdad">Edad</Label>
            <Input
              id="mascotaEdad"
              value={formData.mascotaEdad}
              onChange={(e) => handleChange("mascotaEdad", e.target.value)}
              placeholder="Ej: 3 años, 6 meses"
            />
          </div>
        </div>
      </div>

      {/* Información de la clínica */}
      <div className="bg-yellow-50 p-4 rounded-xl">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Clínica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clinica">Clínica *</Label>
            <select
              id="clinica"
              value={formData.clinica}
              onChange={(e) => handleChange("clinica", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#079f92] ${
                errors.clinica ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Seleccionar clínica</option>
              {clinicas.map(clinica => (
                <option key={clinica.value} value={clinica.value}>{clinica.label}</option>
              ))}
            </select>
            {errors.clinica && <p className="text-red-500 text-sm mt-1">{errors.clinica}</p>}
          </div>

          <div>
            <Label htmlFor="clinicaDireccion">Dirección</Label>
            <Input
              id="clinicaDireccion"
              value={formData.clinicaDireccion}
              onChange={(e) => handleChange("clinicaDireccion", e.target.value)}
              placeholder="Dirección de la clínica"
              disabled={!!formData.clinica}
              className="bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Observaciones */}
      <div>
        <Label htmlFor="observaciones">Observaciones adicionales</Label>
        <textarea
          id="observaciones"
          value={formData.observaciones}
          onChange={(e) => handleChange("observaciones", e.target.value)}
          placeholder="Información adicional relevante para la cita..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#079f92] resize-none"
        />
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
              Agendando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <img src={registrarIcon} alt="Registrar" className="size-4" />
              Agendar Cita
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

export default RegistrarCitaForm;
export type { CitaFormData };