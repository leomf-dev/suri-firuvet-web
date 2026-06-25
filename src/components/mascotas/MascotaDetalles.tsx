import { PawPrint, User, Calendar, Heart, AlertTriangle, Scale, Ruler, Palette, Venus, Mars, Info } from "lucide-react";
import { Button } from "@components/ui/Button";
import { type Mascota } from "@appTypes/database";

interface MascotaDetallesProps {
  mascota: Mascota & {
    raza?: string;
    edad?: string;
    peso?: string;
    color?: string;
    genero?: string;
    fechaNacimiento?: string;
  };
  onClose: () => void;
}

function MascotaDetalles({ mascota, onClose }: MascotaDetallesProps) {
  const formatearFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  const getIconoGenero = (genero: string) => {
    return genero === 'M' ? <Mars className="size-4 text-blue-500" /> : <Venus className="size-4 text-pink-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header con información básica */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#079f92] flex items-center justify-center">
            <PawPrint className="size-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{mascota.nombmas}</h3>
            <p className="text-gray-500">ID: #{mascota.id}</p>
          </div>
        </div>
        
        {mascota.genero && (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
            {getIconoGenero(mascota.genero)}
            <span className="text-sm font-medium">
              {mascota.genero === 'M' ? 'Macho' : 'Hembra'}
            </span>
          </div>
        )}
      </div>

      {/* Información básica de la mascota */}
      <div className="border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <PawPrint className="size-5 text-[#079f92]" />
          <h4 className="font-bold text-gray-800">Información de la Mascota</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p><span className="font-medium">Nombre:</span> {mascota.nombmas}</p>
            <p><span className="font-medium">Tipo:</span> {mascota.tipoMascota?.nombre || "No especificado"}</p>
            {mascota.raza && (
              <p><span className="font-medium">Raza:</span> {mascota.raza}</p>
            )}
            {mascota.color && (
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-gray-500" />
                <span className="font-medium">Color:</span> {mascota.color}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {mascota.edad && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-gray-500" />
                <span className="font-medium">Edad:</span> {mascota.edad} años
              </div>
            )}
            {mascota.peso && (
              <div className="flex items-center gap-2">
                <Scale className="size-4 text-gray-500" />
                <span className="font-medium">Peso:</span> {mascota.peso} kg
              </div>
            )}
            {mascota.fechaNacimiento && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-gray-500" />
                <span className="font-medium">F. Nacimiento:</span> {formatearFecha(mascota.fechaNacimiento)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información del dueño */}
      {mascota.cliente && (
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="size-5 text-[#079f92]" />
            <h4 className="font-bold text-gray-800">Información del Dueño</h4>
          </div>
          
          <div className="space-y-2">
            <p><span className="font-medium">Nombre:</span> {mascota.cliente.nombcli} {mascota.cliente.apecli}</p>
            <p><span className="font-medium">ID Cliente:</span> {mascota.idcliente}</p>
            {mascota.cliente.fecnac && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-gray-500" />
                <span className="font-medium">Fecha de nacimiento:</span> {formatearFecha(mascota.cliente.fecnac)}
              </div>
            )}
            {mascota.cliente.uid && (
              <p><span className="font-medium">UID:</span> {mascota.cliente.uid}</p>
            )}
          </div>
        </div>
      )}

      {/* Apodos y nombres cariñosos */}
      {mascota.apodos && (
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="size-5 text-[#079f92]" />
            <h4 className="font-bold text-gray-800">Apodos y Nombres Cariñosos</h4>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
            <p className="text-pink-800 font-medium">"{mascota.apodos}"</p>
          </div>
        </div>
      )}

      {/* Alergias o condiciones médicas */}
      {mascota.alergias ? (
        <div className="border border-red-200 bg-red-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="size-5 text-red-600" />
            <h4 className="font-bold text-red-800">⚠️ Alergias y Condiciones Médicas</h4>
          </div>
          <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-3">
            <p className="text-red-800 leading-relaxed font-medium">{mascota.alergias}</p>
          </div>
          <div className="bg-red-200 border border-red-400 rounded-lg p-3">
            <p className="text-sm text-red-900 font-bold flex items-center gap-2">
              <Info className="size-4" />
              🏥 IMPORTANTE: Informar al veterinario antes de cualquier tratamiento
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="size-5 text-green-600" />
            <h4 className="font-bold text-green-800">Estado de Salud</h4>
          </div>
          <div className="bg-green-100 border border-green-300 rounded-lg p-3">
            <p className="text-green-800 flex items-center gap-2">
              <span className="text-lg">✅</span>
              No se han registrado alergias o condiciones médicas especiales
            </p>
          </div>
        </div>
      )}

      {/* Resumen rápido */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="size-5 text-blue-600" />
          <h4 className="font-bold text-blue-800">Resumen</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white rounded-lg p-2 border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Tipo</p>
            <p className="text-sm font-bold text-blue-800">{mascota.tipoMascota?.nombre || 'N/A'}</p>
          </div>
          <div className="bg-white rounded-lg p-2 border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Edad</p>
            <p className="text-sm font-bold text-blue-800">{mascota.edad ? `${mascota.edad} años` : 'N/A'}</p>
          </div>
          <div className="bg-white rounded-lg p-2 border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Peso</p>
            <p className="text-sm font-bold text-blue-800">{mascota.peso ? `${mascota.peso} kg` : 'N/A'}</p>
          </div>
          <div className="bg-white rounded-lg p-2 border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Estado</p>
            <p className="text-sm font-bold text-blue-800">{mascota.alergias ? '⚠️ Alergias' : '✅ Saludable'}</p>
          </div>
        </div>
      </div>

      {/* Botón cerrar */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
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

export default MascotaDetalles;