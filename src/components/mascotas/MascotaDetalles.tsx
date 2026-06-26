import { PawPrint, Heart, AlertTriangle, User } from "lucide-react";
import { Button } from "@components/ui";
import type { Mascota } from "@appTypes";

interface MascotaDetallesProps {
  mascota: Mascota;
  onClose: () => void;
}

function MascotaDetalles({ mascota, onClose }: MascotaDetallesProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#079f92] flex items-center justify-center">
          <PawPrint className="size-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{mascota.nombMas}</h3>
          <span className="text-sm px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full font-medium">
            {mascota.nombreTipo || "Sin tipo"}
          </span>
        </div>
      </div>

      {/* Datos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <PawPrint className="size-4 text-[#079f92] shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Nombre</p>
            <p className="font-semibold text-gray-800">{mascota.nombMas}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <User className="size-4 text-[#079f92] shrink-0" />
          <div>
            <p className="text-xs text-gray-400">ID Cliente</p>
            <p className="font-semibold text-gray-800">#{mascota.idCliente}</p>
          </div>
        </div>
      </div>

      {/* Apodos */}
      {mascota.apodos && (
        <div className="flex gap-3 p-3 rounded-xl border border-pink-100 bg-pink-50">
          <Heart className="size-4 text-pink-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-pink-400">Apodos</p>
            <p className="font-medium text-pink-800">"{mascota.apodos}"</p>
          </div>
        </div>
      )}

      {/* Alergias */}
      {mascota.alergias ? (
        <div className="flex gap-3 p-3 rounded-xl border border-red-200 bg-red-50">
          <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-red-400 font-semibold">Alergias / condiciones médicas</p>
            <p className="text-red-800 text-sm">{mascota.alergias}</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 p-3 rounded-xl border border-green-200 bg-green-50">
          <Heart className="size-4 text-green-500 shrink-0 mt-0.5" />
          <p className="text-green-700 text-sm">Sin alergias ni condiciones médicas registradas</p>
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

export default MascotaDetalles;
