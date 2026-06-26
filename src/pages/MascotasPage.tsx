import { useEffect, useState, useCallback } from "react";
import { Eye, Heart } from "lucide-react";
import { Button, Modal } from "@components/ui";
import { LoadingOverlay, EmptyState, ErrorMessage } from "@components/common";
import RegistrarMascotaForm from "@components/mascotas/RegistrarMascotaForm";
import MascotaDetalles from "@components/mascotas/MascotaDetalles";
import EditarMascotaForm from "@components/mascotas/EditarMascotaForm";
import { mascotaService, catalogoService } from "@services/index";
import { useAuth } from "@auth/index";
import type { Mascota, TipoMascota, MascotaFormData } from "@appTypes";
import miIcono from "../assets/MASCOTAS.svg";
import registrarIcon from "../assets/REGISTRAR MASCOTAS.png";

function MascotaIcon() {
  return (
    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
      <img src={miIcono} alt="Mascota" className="size-5 sm:size-6" />
    </div>
  );
}

function MascotasPage() {
  const { idCliente } = useAuth();

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [tiposMascota, setTiposMascota] = useState<TipoMascota[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [modalRegistroOpen, setModalRegistroOpen] = useState(false);
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<Mascota | null>(null);
  const [mascotaParaEditar, setMascotaParaEditar] = useState<Mascota | null>(null);

  const cargarMascotas = useCallback(async () => {
    if (!idCliente) return;
    const data = await mascotaService.getByCliente(idCliente);
    setMascotas(data);
  }, [idCliente]);

  // Catálogos — cargan siempre, no dependen de idCliente
  useEffect(() => {
    catalogoService.getTiposMascota()
      .then(tipos => setTiposMascota(tipos.map(t => ({ ...t, id: Number(t.id) }))))
      .catch(() => {});
  }, []);

  // Mascotas — solo cuando hay cliente
  useEffect(() => {
    if (!idCliente) { setLoadingPage(false); return; }
    mascotaService.getByCliente(idCliente)
      .then(setMascotas)
      .catch(() => {})
      .finally(() => setLoadingPage(false));
  }, [idCliente]);

  const handleVerDetalles = (mascota: Mascota) => {
    setMascotaSeleccionada(mascota);
    setModalDetallesOpen(true);
  };

  const handleEditarMascota = (mascota: Mascota) => {
    setMascotaParaEditar(mascota);
    setModalEditarOpen(true);
  };

  const handleRegistrarMascota = async (formData: MascotaFormData) => {
    if (!idCliente) return;
    setLoading(true);
    setError(null);
    try {
      const result = await mascotaService.registrar({
        ...formData,
        idCliente,
      });

      if (result === null) {
        setError("No se pudo registrar la mascota. Verifique que el tipo de mascota sea válido.");
        return;
      }

      await cargarMascotas();
      setModalRegistroOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al registrar mascota");
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarMascota = async (formData: MascotaFormData) => {
    if (!mascotaParaEditar || !idCliente) return;
    setLoading(true);
    setError(null);
    try {
      await mascotaService.update(mascotaParaEditar.id, {
        nombMas: formData.nombMas,
        idTipoMascota: formData.idTipoMascota,
        idCliente,
        apodos: formData.apodos || undefined,
        alergias: formData.alergias || undefined,
      });
      await cargarMascotas();
      setModalEditarOpen(false);
      setMascotaParaEditar(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al actualizar mascota");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarMascota = async (mascota: Mascota) => {
    if (!idCliente) return;
    setLoading(true);
    setError(null);
    try {
      await mascotaService.delete(mascota.id, idCliente);
      await cargarMascotas();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar mascota");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPage) {
    return <LoadingOverlay message="Cargando mascotas..." fullScreen />;
  }

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

      {error && <ErrorMessage message={error} className="mb-4" />}

      {mascotas.length === 0 && !error ? (
        <EmptyState
          title="Sin mascotas registradas"
          description="Registra tu primera mascota para comenzar."
          action={
            <Button
              onClick={() => setModalRegistroOpen(true)}
              className="bg-[#079f92] hover:bg-[#078c80] text-white rounded-lg px-4 py-2 text-sm font-bold"
            >
              Registrar Mascota
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {mascotas.map((mascota) => (
            <div
              key={mascota.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-lg hover:border-[#079f92]/30 transition-all duration-200"
            >
              {/* Header con icono */}
              <div className="flex items-start justify-between mb-3">
                <MascotaIcon />
                <span className="px-2 py-1 bg-[#079f92] text-white rounded-full text-xs font-bold">
                  {mascota.nombreTipo || "Sin tipo"}
                </span>
              </div>

              {/* Información básica */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                  {mascota.nombMas || "Sin nombre"}
                </h3>
                {mascota.apodos && (
                  <p className="text-sm text-gray-500 mb-2 truncate">
                    "{mascota.apodos}"
                  </p>
                )}
              </div>

              {/* Indicador de alergias */}
              {mascota.alergias ? (
                <div className="mb-4">
                  <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <Heart className="size-4 text-red-500" />
                    <span className="text-xs text-red-700 font-medium">
                      Tiene condiciones médicas
                    </span>
                  </div>
                </div>
              ) : (
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
      )}

      {/* Modal de detalles */}
      {mascotaSeleccionada && (
        <Modal
          isOpen={modalDetallesOpen}
          onClose={() => { setModalDetallesOpen(false); setMascotaSeleccionada(null); }}
          title={`Detalles de ${mascotaSeleccionada.nombMas}`}
          size="lg"
        >
          <MascotaDetalles
            mascota={mascotaSeleccionada as any}
            onClose={() => { setModalDetallesOpen(false); setMascotaSeleccionada(null); }}
          />
        </Modal>
      )}

      {/* Modal de edición */}
      {mascotaParaEditar && (
        <Modal
          isOpen={modalEditarOpen}
          onClose={() => { setModalEditarOpen(false); setMascotaParaEditar(null); }}
          title={`Editar Mascota: ${mascotaParaEditar.nombMas}`}
          size="lg"
        >
          <EditarMascotaForm
            mascota={mascotaParaEditar}
            tiposMascota={tiposMascota}
            onSubmit={handleActualizarMascota}
            onCancel={() => { setModalEditarOpen(false); setMascotaParaEditar(null); }}
            loading={loading}
          />
        </Modal>
      )}

      {/* Modal de registro */}
      <Modal
        isOpen={modalRegistroOpen}
        onClose={() => setModalRegistroOpen(false)}
        title="Registrar Nueva Mascota"
        size="lg"
      >
        <RegistrarMascotaForm
          tiposMascota={tiposMascota}
          onSubmit={handleRegistrarMascota}
          onCancel={() => setModalRegistroOpen(false)}
          loading={loading}
        />
      </Modal>
    </div>
  );
}

export default MascotasPage;
