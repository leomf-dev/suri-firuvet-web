import { Calendar, Clock, User, PawPrint, Stethoscope, FileText, MapPin, Phone } from "lucide-react";
import { Button } from "@components/ui/Button";

interface CitaDetallesProps {
  cita: CitaCompleta;
  onClose: () => void;
}

interface CitaCompleta {
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



function CitaDetalles({ cita, onClose }: CitaDetallesProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#079f92] flex items-center justify-center">
          <Calendar className="size-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Cita #{cita.id}</h3>
        </div>
      </div>

      {/* Información de fecha y hora */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <Calendar className="size-5 text-[#079f92]" />
          <div>
            <p className="text-sm text-gray-500">Fecha</p>
            <p className="font-bold text-gray-800">{cita.fecha}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Clock className="size-5 text-[#079f92]" />
          <div>
            <p className="text-sm text-gray-500">Hora</p>
            <p className="font-bold text-gray-800">{cita.hora}</p>
          </div>
        </div>
      </div>

      {/* Información del dueño */}
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="size-5 text-[#079f92]" />
          <h4 className="font-bold text-gray-800">Información del Dueño</h4>
        </div>
        
        <div className="space-y-2">
          <p><span className="font-medium">Nombre:</span> {cita.dueño.nombre}</p>
          {cita.dueño.telefono && (
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-gray-500" />
              <span>{cita.dueño.telefono}</span>
            </div>
          )}
          {cita.dueño.email && (
            <p><span className="font-medium">Email:</span> {cita.dueño.email}</p>
          )}
        </div>
      </div>

      {/* Información de la mascota */}
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <PawPrint className="size-5 text-[#079f92]" />
          <h4 className="font-bold text-gray-800">Información de la Mascota</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Nombre:</span> {cita.mascota.nombre}</p>
            <p><span className="font-medium">Tipo:</span> {cita.mascota.tipo}</p>
          </div>
          <div>
            {cita.mascota.raza && (
              <p><span className="font-medium">Raza:</span> {cita.mascota.raza}</p>
            )}
            {cita.mascota.edad && (
              <p><span className="font-medium">Edad:</span> {cita.mascota.edad}</p>
            )}
          </div>
        </div>
      </div>

      {/* Detalles de la cita */}
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope className="size-5 text-[#079f92]" />
          <h4 className="font-bold text-gray-800">Detalles de la Cita</h4>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="font-medium text-gray-700">Motivo:</p>
            <p className="text-gray-600">{cita.motivo}</p>
          </div>
          
          {cita.veterinario && (
            <div>
              <p className="font-medium text-gray-700">Veterinario:</p>
              <p className="text-gray-600">{cita.veterinario.nombre}</p>
            </div>
          )}
          
          {cita.clinica && (
            <div>
              <p className="font-medium text-gray-700">Clínica:</p>
              <p className="text-gray-600">{cita.clinica.nombre}</p>
              {cita.clinica.direccion && (
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="size-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{cita.clinica.direccion}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Observaciones */}
      {cita.observaciones && (
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="size-5 text-[#079f92]" />
            <h4 className="font-bold text-gray-800">Observaciones</h4>
          </div>
          <p className="text-gray-600 leading-relaxed">{cita.observaciones}</p>
        </div>
      )}

      {/* Botón cerrar */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
}

export default CitaDetalles;
export type { CitaCompleta };