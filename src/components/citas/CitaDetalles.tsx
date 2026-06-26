import { Calendar, Clock, PawPrint, MapPin, FileText } from "lucide-react";
import { Button } from "@components/ui";
import type { Cita } from "@appTypes";

interface CitaDetallesProps {
  cita: Cita;
  onClose: () => void;
}

function CitaDetalles({ cita, onClose }: CitaDetallesProps) {
  const fecha = new Date(cita.fecha);

  return (
    <div className="space-y-4">
      {/* Fecha y tipo */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <Calendar className="size-5 text-[#079f92]" />
          <div>
            <p className="text-xs text-gray-500">Fecha</p>
            <p className="font-bold text-gray-800">
              {fecha.toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="size-5 text-[#079f92]" />
          <div>
            <p className="text-xs text-gray-500">Hora</p>
            <p className="font-bold text-gray-800">
              {fecha.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
      </div>

      {/* Tipo de cita */}
      <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
        <span className="px-3 py-1 bg-teal-50 text-teal-700 text-sm font-semibold rounded-full">
          {cita.nombreTipoCita}
        </span>
      </div>

      {/* Mascota y cliente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
          <PawPrint className="size-5 text-[#079f92] shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Mascota</p>
            <p className="font-semibold text-gray-800">{cita.nombreMascota}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
          <MapPin className="size-5 text-[#079f92] shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Clínica</p>
            <p className="font-semibold text-gray-800">{cita.nombreClinica}</p>
          </div>
        </div>
      </div>

      {/* Comentario */}
      {cita.comentario && (
        <div className="flex gap-3 p-4 border border-gray-200 rounded-xl">
          <FileText className="size-5 text-[#079f92] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-500 mb-1">Comentario</p>
            <p className="text-gray-700 text-sm leading-relaxed">{cita.comentario}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg">
          Cerrar
        </Button>
      </div>
    </div>
  );
}

export default CitaDetalles;
