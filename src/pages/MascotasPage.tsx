import { useEffect, useState } from "react";
import { PawPrint, Plus, Eye, User, Heart } from "lucide-react";
import { Button } from "@components/ui/Button";
import Modal from "@components/ui/Modal";
import { api } from "@api/http";
import RegistrarMascotaForm, { type MascotaFormData } from "@components/mascotas/RegistrarMascotaForm";
import MascotaDetalles from "@components/mascotas/MascotaDetalles";
import EditarMascotaForm, { type MascotaEditFormData, type MascotaParaEditar } from "@components/mascotas/EditarMascotaForm";
import { type Mascota, MASCOTAS_MOCK, TIPOS_MASCOTA, type TipoMascota } from "@appTypes/database";
import miIcono from "../assets/MASCOTAS.svg";
import registrarIcon from "../assets/REGISTRAR MASCOTAS.png";

function obtenerNombreMascota(mascota: Mascota): string {
  return mascota.nombmas || "Sin nombre";
}

function obtenerTipoMascota(mascota: Mascota): string {
  if (mascota.tipoMascota?.nombre) {
    return mascota.tipoMascota.nombre;
  }
  
  const tipo = TIPOS_MASCOTA.find((t: TipoMascota) => t.id === mascota.tipomas);
  return tipo?.nombre || "Sin tipo";
}

function obtenerNombreDueño(mascota: Mascota): string {
  if (mascota.cliente) {
    return `${mascota.cliente.nombcli} ${mascota.cliente.apecli}`;
  }
  return "Dueño no disponible";
}

function MascotaIcon() {
  return (
    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
      <img src={miIcono} alt="Mascota" className="size-5 sm:size-6" />
    </div>
  );
}

function MascotasPage() {
  const [mascotas, setMascotas] = useState<Mascota[]>(MASCOTAS_MOCK);
  const [modalRegistroOpen, setModalRegistroOpen] = useState(false);
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null);
  const [mascotaParaEditar, setMascotaParaEditar] = useState<Mascota | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function cargarMascotas() {
      try {
        // 🔧 CAMBIA ESTA RUTA por tu endpoint real
        const data = await api.get<Mascota[]>("/mascotas");
        setMascotas(data);
      } catch {
        setMascotas(MASCOTAS_MOCK);
      }
    }

    cargarMascotas();
  }, []);

  const handleVerDetalles = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota);
    setModalDetallesOpen(true);
  };

  const handleEditarMascota = (mascota: Mascota) => {
    setMascotaParaEditar(mascota);
    setModalEditarOpen(true);
  };

  const handleRegistrarMascota = async (formData: MascotaFormData) => {
    setLoading(true);
    try {
      // 🔧 CAMBIA ESTA RUTA por tu endpoint real
      const nuevaMascota = await api.post<Mascota>("/mascotas", {
        nombmas: formData.nombmas,
        tipomas: formData.tipomas,
        apodos: formData.apodos,
        alergias: formData.alergias,
        idcliente: 1 // Por ahora hardcodeado, luego vendrá del usuario logueado
      });
      
      // Agregar la nueva mascota a la lista
      setMascotas(prev => [...prev, nuevaMascota]);
      
      // Cerrar modal
      setModalRegistroOpen(false);
      
      console.log("Mascota registrada exitosamente:", nuevaMascota);
    } catch (error) {
      console.error("Error al registrar mascota:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarMascota = async (formData: MascotaEditFormData) => {
    if (!mascotaParaEditar) return;
    
    setLoading(true);
    try {
      // 🔧 CAMBIA ESTA RUTA por tu endpoint real
      const mascotaActualizada = await api.put<Mascota>(`/mascotas/${mascotaParaEditar.id}`, formData);
      
      // Actualizar la mascota en la lista
      setMascotas(prev => prev.map(m => m.id === mascotaParaEditar.id ? mascotaActualizada : m));
      
      // Cerrar modal
      setModalEditarOpen(false);
      setMascotaParaEditar(null);
      
      console.log("Mascota actualizada exitosamente:", mascotaActualizada);
    } catch (error) {
      console.error("Error al actualizar mascota:", error);
    } finally {
      setLoading(false);
    }
  };

  const cerrarModalDetalles = () => {
    setModalDetallesOpen(false);
    setMascotaSeleccionada(null);
  };

  const cerrarModalRegistro = () => {
    setModalRegistroOpen(false);
  };

  const cerrarModalEditar = () => {
    setModalEditarOpen(false);
    setMascotaParaEditar(null);
  };

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          Mis Mascotas
        </h1>

        <Button 
          onClick={() => setModalRegistroOpen(true)}
          className="bg-[#079f92] hover:bg-[#078c80] text-white rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold shadow-sm w-full sm:w-auto"
        >
          <img src={registrarIcon} alt="Registrar" className="w-4 h-4 sm:w-5 sm:h-5 mr-2 object-contain" />
          Registrar Mascota
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {mascotas.map((mascota, index) => (
          <div
            key={mascota.id ?? index}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-lg hover:border-[#079f92]/30 transition-all duration-200"
          >
            {/* Header con icono */}
            <div className="flex items-start justify-between mb-3">
              <MascotaIcon />
              {/* Badge de tipo de mascota */}
              <span className="px-2 py-1 bg-[#079f92] text-white rounded-full text-xs font-bold">
                {obtenerTipoMascota(mascota)}
              </span>
            </div>

            {/* Información básica */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                {obtenerNombreMascota(mascota)}
              </h3>
              {mascota.apodos && (
                <p className="text-sm text-gray-500 mb-2 truncate">
                  "{mascota.apodos}"
                </p>
              )}
            </div>

            {/* Información del dueño */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="size-4 text-[#079f92]" />
                <span className="text-sm font-bold text-gray-700">Dueño</span>
              </div>
              <p className="text-sm text-gray-800 font-medium truncate">
                {obtenerNombreDueño(mascota)}
              </p>
            </div>

            {/* Indicador de alergias */}
            {mascota.alergias && (
              <div className="mb-4">
                <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <Heart className="size-4 text-red-500" />
                  <span className="text-xs text-red-700 font-medium">
                    Tiene condiciones médicas
                  </span>
                </div>
              </div>
            )}

            {/* Estado saludable */}
            {!mascota.alergias && (
              <div className="mb-4">
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <Heart className="size-4 text-green-500" />
                  <span className="text-xs text-green-700 font-medium">
                    Sin alergias conocidas
                  </span>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleVerDetalles(mascota)}
                className="flex-1 bg-[#f0644f] hover:bg-[#e55a47] text-white py-2 text-sm font-bold rounded-lg transition-colors"
              >
                <Eye className="size-4 mr-1" />
                Ver Detalles
              </Button>
              
              <Button
                onClick={() => handleEditarMascota(mascota)}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 text-sm font-bold rounded-lg transition-colors"
              >
                Editar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalles */}
      {mascotaSeleccionada && (
        <Modal
          isOpen={modalDetallesOpen}
          onClose={cerrarModalDetalles}
          title={`Detalles de ${mascotaSeleccionada.nombmas}`}
          size="lg"
        >
          <MascotaDetalles
            mascota={mascotaSeleccionada}
            onClose={cerrarModalDetalles}
          />
        </Modal>
      )}

      {/* Modal de edición */}
      {mascotaParaEditar && (
        <Modal
          isOpen={modalEditarOpen}
          onClose={cerrarModalEditar}
          title={`Editar Mascota: ${mascotaParaEditar.nombmas}`}
          size="lg"
        >
          <EditarMascotaForm
            mascota={mascotaParaEditar as MascotaParaEditar}
            onSubmit={handleActualizarMascota}
            onCancel={cerrarModalEditar}
            loading={loading}
          />
        </Modal>
      )}

      {/* Modal de registro */}
      <Modal
        isOpen={modalRegistroOpen}
        onClose={cerrarModalRegistro}
        title="Registrar Nueva Mascota"
        size="lg"
      >
        <RegistrarMascotaForm
          onSubmit={handleRegistrarMascota}
          onCancel={cerrarModalRegistro}
          loading={loading}
        />
      </Modal>
    </div>
  );
}

export default MascotasPage;