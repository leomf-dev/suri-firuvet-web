import { useEffect, useState, useCallback } from "react";
import { Calendar, Eye, Clock, Trash2 } from "lucide-react";
import { Button, Modal } from "@components/ui";
import { LoadingOverlay, EmptyState, ErrorMessage } from "@components/common";
import { useAuth } from "@auth/index";
import { citaService, mascotaService, catalogoService } from "@services/index";
import type { Cita, Mascota, TipoCita, Clinica, CitaFormData } from "@appTypes";
import citasIcon from "../assets/CITAS.svg";
import registrarCitaIcon from "../assets/REGISTRAR CITAS.png";

function CitaIcon() {
  return (
    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
      <img src={citasIcon} alt="Cita" className="size-5 sm:size-6" />
    </div>
  );
}

function CitasPage() {
  const { idCliente } = useAuth();

  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [tiposCita, setTiposCita] = useState<TipoCita[]>([]);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [modalRegistroOpen, setModalRegistroOpen] = useState(false);
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);

  const cargarCitas = useCallback(async () => {
    if (!idCliente) return;
    const data = await citaService.getByCliente(idCliente);
    setCitas(data);
  }, [idCliente]);  useEffect(() => {
    async function init() {
      setLoadingPage(true);
      setError(null);
      // REST primero — controla el loading state
      const [citas, mascs] = await Promise.all([
        citaService.getByCliente(idCliente!).catch(() => [] as Cita[]),
        mascotaService.getByCliente(idCliente!).catch(() => [] as Mascota[]),
      ]);
      setCitas(citas);
      setMascotas(mascs);
      setLoadingPage(false);

      // SOAP en segundo plano — no bloquea la UI
      Promise.all([
        catalogoService.getTiposCita().catch(() => [] as TipoCita[]),
        catalogoService.getClinicas().catch(() => [] as Clinica[]),
      ]).then(([tipos, cls]) => {
        setTiposCita(tipos.map(t => ({ ...t, id: Number(t.id) })));
        setClinicas(cls.map(c => ({ ...c, id: Number(c.id) })));
      });
    }
    if (idCliente) init();
    else setLoadingPage(false);
  }, [idCliente]);

  const handleRegistrarCita = async (formData: CitaFormData) => {
    if (!idCliente) return;
    setLoading(true);
    setError(null);
    try {
      await citaService.create({ ...formData, idCliente });
      await cargarCitas();
      setModalRegistroOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear cita");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarCita = async (cita: Cita) => {
    if (!idCliente || !confirm("¿Eliminar esta cita?")) return;
    setLoading(true);
    setError(null);
    try {
      await citaService.delete(cita.idCita, idCliente);
      await cargarCitas();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar cita");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPage) return <LoadingOverlay fullScreen message="Cargando citas..." />;

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
          Mis Citas
        </h1>
        <Button
          onClick={() => setModalRegistroOpen(true)}
          className="bg-[#079f92] hover:bg-[#078c80] text-white rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold shadow-sm w-full sm:w-auto"
        >
          <img src={registrarCitaIcon} alt="Registrar Cita" className="w-4 h-4 sm:w-5 sm:h-5 mr-2 object-contain" />
          Registrar Cita
        </Button>
      </div>

      {error && <ErrorMessage message={error} className="mb-4" />}

      {citas.length === 0 && !error ? (
        <EmptyState
          title="Sin citas registradas"
          description="Agenda tu primera cita veterinaria."
          action={
            <Button onClick={() => setModalRegistroOpen(true)} className="bg-[#079f92] hover:bg-[#078c80] text-white rounded-lg px-4 py-2 text-sm font-bold">
              Registrar Cita
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {citas.map((cita) => {
            const date = new Date(cita.fecha);
            return (
              <div key={cita.idCita} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-lg hover:border-[#079f92]/30 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <CitaIcon />
                  <span className="px-2 py-1 bg-[#079f92] text-white rounded-full text-xs font-bold">
                    {cita.nombreTipoCita}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <span>{date.toLocaleDateString("es-PE")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    <span>{date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>

                <div className="mb-3 space-y-1">
                  <p className="text-sm text-gray-800 font-medium">Mascota: {cita.nombreMascota}</p>
                  <p className="text-sm text-gray-500">Clínica: {cita.nombreClinica}</p>
                  {cita.comentario && <p className="text-xs text-gray-400 line-clamp-2">{cita.comentario}</p>}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => { setCitaSeleccionada(cita); setModalDetallesOpen(true); }}
                    className="flex-1 bg-[#f0644f] hover:bg-[#e55a47] text-white py-2 text-sm font-bold rounded-lg"
                  >
                    <Eye className="size-4 mr-1" /> Ver
                  </Button>
                  <Button
                    onClick={() => handleEliminarCita(cita)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 text-sm font-bold rounded-lg"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Detalles */}
      {citaSeleccionada && (
        <Modal isOpen={modalDetallesOpen} onClose={() => { setModalDetallesOpen(false); setCitaSeleccionada(null); }} title="Detalles de la Cita" size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Tipo</p><p className="font-bold">{citaSeleccionada.nombreTipoCita}</p></div>
              <div><p className="text-sm text-gray-500">Fecha</p><p className="font-bold">{new Date(citaSeleccionada.fecha).toLocaleString("es-PE")}</p></div>
              <div><p className="text-sm text-gray-500">Mascota</p><p className="font-bold">{citaSeleccionada.nombreMascota}</p></div>
              <div><p className="text-sm text-gray-500">Cliente</p><p className="font-bold">{citaSeleccionada.nombreCliente}</p></div>
              <div><p className="text-sm text-gray-500">Clínica</p><p className="font-bold">{citaSeleccionada.nombreClinica}</p></div>
            </div>
            {citaSeleccionada.comentario && (
              <div><p className="text-sm text-gray-500">Comentario</p><p>{citaSeleccionada.comentario}</p></div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal Registro */}
      <Modal isOpen={modalRegistroOpen} onClose={() => setModalRegistroOpen(false)} title="Agendar Nueva Cita" size="lg">
        <CitaForm
          tiposCita={tiposCita}
          clinicas={clinicas}
          mascotas={mascotas}
          loading={loading}
          onSubmit={handleRegistrarCita}
          onCancel={() => setModalRegistroOpen(false)}
        />
      </Modal>
    </div>
  );
}

// ponytail: form inline, matches real API shape. No separate file needed.
function CitaForm({ tiposCita, clinicas, mascotas, loading, onSubmit, onCancel }: {
  tiposCita: TipoCita[]; clinicas: Clinica[]; mascotas: Mascota[];
  loading: boolean; onSubmit: (data: CitaFormData) => void; onCancel: () => void;
}) {
  const { idCliente } = useAuth();
  const [form, setForm] = useState<CitaFormData>({
    idTipoCita: 0, fecha: "", comentario: "", idMascota: 0, idCliente: idCliente ?? 0, idClinica: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.idTipoCita || !form.fecha || !form.idMascota || !form.idClinica) return;
    onSubmit(form);
  };

  const set = (field: keyof CitaFormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tipo de cita *</label>
        <select value={form.idTipoCita} onChange={(e) => set("idTipoCita", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value={0}>Seleccionar...</option>
          {tiposCita.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Fecha y hora *</label>
        <input type="datetime-local" value={form.fecha} onChange={(e) => set("fecha", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mascota *</label>
        <select value={form.idMascota} onChange={(e) => set("idMascota", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value={0}>Seleccionar...</option>
          {mascotas.map((m) => <option key={m.id} value={m.id}>{m.nombMas}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Clínica *</label>
        <select value={form.idClinica} onChange={(e) => set("idClinica", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
          <option value={0}>Seleccionar...</option>
          {clinicas.map((c) => <option key={c.id} value={c.id}>{c.nombre} — {c.direccion}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Comentario</label>
        <textarea value={form.comentario} onChange={(e) => set("comentario", e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none" placeholder="Observaciones..." />
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="bg-[#079f92] hover:bg-[#078c80] text-white px-6 py-3 rounded-lg font-bold flex-1">
          {loading ? "Agendando..." : "Agendar Cita"}
        </Button>
        <Button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold">
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export default CitasPage;
