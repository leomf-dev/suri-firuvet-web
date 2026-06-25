import { useState, useEffect } from "react";
import { Button } from "@components/ui/Button";
import { Input } from "@components/ui/Input";
import { Label } from "@components/ui/Label";
import { Save, X, Calendar, Clock } from "lucide-react";

interface EditarCitaFormProps {
  cita: CitaParaEditar;
  onSubmit: (cita: CitaEditFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface CitaParaEditar {
  id?: number;
  fecha: string;
  hora: string;
  motivo: string;
  observaciones?: string;
  dueño: {
    nombre: string;
    telefono?: string;
    email?: string;
  };
  mascota: {
    nombre: string;
    tipo: string;
    raza?: string;
    edad?: string;
  };
  veterinario?: {
    nombre: string;
  };
  clinica?: {
    nombre: string;
    direccion?: string;
  };
}

interface CitaEditFormData {
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

function EditarCitaForm({ cita, onSubmit, onCancel, loading = false }: EditarCitaFormProps) {
  const [formData, setFormData] = useState<CitaEditFormData>({
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

  const [errors, setErrors] = useState<Partial<CitaEditFormData>>({});

  // Poblar formulario con datos de la cita existente
  useEffect(() => {
    if (cita) {
      setFormData({
        fecha: cita.fecha,
        hora: cita.hora,
        motivo: cita.motivo,
        observaciones: cita.observaciones || "",
        dueñoNombre: cita.dueño.nombre,
        dueñoTelefono: cita.dueño.telefono || "",
        dueñoEmail: cita.dueño.email || "",
        mascotaNombre: cita.mascota.nombre,
        mascotaTipo: cita.mascota.tipo,
        mascotaRaza: cita.mascota.raza || "",
        mascotaEdad: cita.mascota.edad || "",
        veterinario: cita.veterinario?.nombre || "",
        clinica: cita.clinica?.nombre || "",
        clinicaDireccion: cita.clinica?.direccion || ""
      });
    }
  }, [cita]);

  // Actualizar dirección automáticamente cuando se selecciona una clínica
  useEffect(() => {
    if (formData.clinica) {
      const clinicaSeleccionada = clinicas.find(c => c.value === formData.clinica);
      if (clinicaSeleccionada) {
        setFormData(prev => ({ ...prev, clinicaDireccion: clinicaSeleccionada.direccion }));
      }
    }
  }, [formData.clinica]);

  const handleChange = (field: keyof CitaEditFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CitaEditFormData> = {};

    // Campos requeridos
    if (!formData.fecha) newErrors.fecha = "La fecha es requerida";
    if (!formData.hora) newErrors.hora = "La hora es requerida";
    if (!formData.motivo.trim()) newErrors.motivo = "El motivo es requerido";
    if (!formData.dueñoNombre.trim()) newErrors.dueñoNombre = "El nombre del dueño es requerido";
    if (!formData.mascotaNombre.trim()) newErrors.mascotaNombre = "El nombre de la mascota es requerido";
    if (!formData.veterinario) newErrors.veterinario = "El veterinario es requerido";

    // Validar fecha no sea en el pasado (opcional para edición)
    if (formData.fecha) {
      const fechaSeleccionada = new Date(formData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fechaSeleccionada < hoy) {
        // Solo advertencia, no error bloqueante para edición
        console.warn("Fecha en el pasado detectada");
      }
    }

    // Validar formato de email si se proporciona
    if (formData.dueñoEmail && !formData.dueñoEmail.includes("@")) {
      newErrors.dueñoEmail = "Email no válido";
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
      {/* Información básica de la cita */}
      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
        <h3 className="flex items-center gap-2 text-lg font-bold text-yellow-800 mb-4">
          <Calendar className="size-5 text-yellow-600" />
          Información de la Cita
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="fecha">Fecha *</Label>
            <Input
              id="fecha"
              type="date"
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
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
        <h3 className="text-lg font-bold text-blue-800 mb-4">Información del Dueño</h3>
        
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
            <Label htmlFor="dueñoTelefono">Teléfono</Label>
            <Input
              id="dueñoTelefono"
              type="tel"
              value={formData.dueñoTelefono}
              onChange={(e) => handleChange("dueñoTelefono", e.target.value)}
              placeholder="Ej: +51 987 654 321"
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="dueñoEmail">Email</Label>
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
      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
        <h3 className="text-lg font-bold text-green-800 mb-4">Información de la Mascota</h3>
        
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
            <Label htmlFor="mascotaTipo">Tipo</Label>
            <select
              id="mascotaTipo"
              value={formData.mascotaTipo}
              onChange={(e) => handleChange("mascotaTipo", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#079f92]"
            >
              <option value="">Seleccionar tipo</option>
              {tiposMascota.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
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
      <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
        <h3 className="text-lg font-bold text-purple-800 mb-4">Clínica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="clinica">Clínica</Label>
            <select
              id="clinica"
              value={formData.clinica}
              onChange={(e) => handleChange("clinica", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#079f92]"
            >
              <option value="">Seleccionar clínica</option>
              {clinicas.map(clinica => (
                <option key={clinica.value} value={clinica.value}>{clinica.label}</option>
              ))}
            </select>
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

      {/* Alerta de edición */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-bold text-orange-800 mb-2">⚠️ Editando Cita Existente</h3>
        <p className="text-sm text-orange-700">
          Estás modificando una cita ya programada. Asegúrate de verificar la disponibilidad antes de guardar los cambios.
        </p>
      </div>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold flex-1 sm:flex-initial"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Actualizando...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="size-4" />
              Actualizar Cita
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

export default EditarCitaForm;
export type { CitaEditFormData, CitaParaEditar };