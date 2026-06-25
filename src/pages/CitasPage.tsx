import { useEffect, useState } from "react";
import { Calendar, Eye, Plus, Clock, User, PawPrint } from "lucide-react";
import { Button } from "@components/ui/Button";
import Modal from "@components/ui/Modal";
import { api } from "@api/http";
import { CitaDetalles, type CitaCompleta, RegistrarCitaForm, type CitaFormData, EditarCitaForm, type CitaEditFormData, type CitaParaEditar } from "@components/citas";
import citasIcon from "../assets/CITAS.svg";
import registrarCitaIcon from "../assets/REGISTRAR CITAS.png";

type Cita = {
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
};

const citasMock: Cita[] = [
  {
    id: 1,
    fecha: "2024-01-15",
    hora: "09:00 AM",
    motivo: "Consulta general",
    observaciones: "Primera consulta del año. Revisar vacunas.",
    dueño: {
      nombre: "María García",
      telefono: "+51 987 654 321",
      email: "maria.garcia@email.com"
    },
    mascota: {
      nombre: "Max",
      tipo: "Perro",
      raza: "Golden Retriever", 
      edad: "3 años"
    },
    veterinario: {
      nombre: "Dr. Carlos Mendoza"
    },
    clinica: {
      nombre: "Clínica Veterinaria San Marcos",
      direccion: "Av. Javier Prado 123, San Isidro"
    }
  },
  {
    id: 2,
    fecha: "2024-01-15",
    hora: "10:30 AM",
    motivo: "Vacunación",
    dueño: {
      nombre: "Juan Pérez",
      telefono: "+51 999 888 777"
    },
    mascota: {
      nombre: "Luna",
      tipo: "Gato",
      raza: "Persa",
      edad: "2 años"
    },
    veterinario: {
      nombre: "Dra. Ana Ramos"
    },
    clinica: {
      nombre: "Clínica Veterinaria San Marcos"
    }
  },
  {
    id: 3,
    fecha: "2024-01-16",
    hora: "02:00 PM",
    motivo: "Control post-operatorio",
    observaciones: "Evolución favorable después de la cirugía. Sin complicaciones.",
    dueño: {
      nombre: "Ana López",
      telefono: "+51 955 444 333",
      email: "ana.lopez@email.com"
    },
    mascota: {
      nombre: "Rocky",
      tipo: "Perro",
      raza: "Bulldog Francés",
      edad: "5 años"
    },
    veterinario: {
      nombre: "Dr. Miguel Torres"
    },
    clinica: {
      nombre: "Hospital Veterinario Central",
      direccion: "Jr. Las Flores 456, Miraflores"
    }
  },
  {
    id: 4,
    fecha: "2024-01-17",
    hora: "11:15 AM",
    motivo: "Desparasitación",
    dueño: {
      nombre: "Carlos Ruiz",
      telefono: "+51 966 777 888"
    },
    mascota: {
      nombre: "Mía",
      tipo: "Conejo",
      raza: "Holandés",
      edad: "1 año"
    },
    veterinario: {
      nombre: "Dra. Patricia Silva"
    },
    clinica: {
      nombre: "Clínica Veterinaria San Marcos"
    }
  },
  {
    id: 5,
    fecha: "2024-01-18",
    hora: "04:30 PM",
    motivo: "Emergencia - Accidente",
    observaciones: "Accidente de tráfico. Requiere atención inmediata.",
    dueño: {
      nombre: "Sofía Mendez",
      telefono: "+51 944 555 666",
      email: "sofia.mendez@email.com"
    },
    mascota: {
      nombre: "Toby",
      tipo: "Perro",
      raza: "Mestizo",
      edad: "4 años"
    },
    veterinario: {
      nombre: "Dr. Ricardo Vega"
    },
    clinica: {
      nombre: "Hospital Veterinario Central",
      direccion: "Jr. Las Flores 456, Miraflores"
    }
  },
  {
    id: 6,
    fecha: "2024-01-19",
    hora: "08:45 AM",
    motivo: "Revisión dental",
    dueño: {
      nombre: "Roberto Castro",
      telefono: "+51 933 222 111"
    },
    mascota: {
      nombre: "Nala",
      tipo: "Gato",
      raza: "Siamés",
      edad: "6 años"
    },
    veterinario: {
      nombre: "Dr. Luis Herrera"
    },
    clinica: {
      nombre: "Clínica Dental Veterinaria"
    }
  }
];



function CitaIcon() {
  return (
    <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
      <img src={citasIcon} alt="Cita" className="size-5 sm:size-6" />
    </div>
  );
}

function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>(citasMock);
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);
  const [modalRegistroOpen, setModalRegistroOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [citaParaEditar, setCitaParaEditar] = useState<Cita | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function cargarCitas() {
      try {
        // 🔧 CAMBIA ESTA RUTA por tu endpoint real
        const data = await api.get<Cita[]>("/citas");
        setCitas(data);
      } catch {
        setCitas(citasMock);
      }
    }

    cargarCitas();
  }, []);

  const handleVerDetalles = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setModalDetallesOpen(true);
  };

  const handleEditarCita = (cita: Cita) => {
    setCitaParaEditar(cita);
    setModalEditarOpen(true);
  };

  const handleRegistrarCita = async (formData: CitaFormData) => {
    setLoading(true);
    try {
      // 🔧 CAMBIA ESTA RUTA por tu endpoint real
      const nuevaCita = await api.post<Cita>("/citas", {
        fecha: formData.fecha,
        hora: formData.hora,
        motivo: formData.motivo,

        observaciones: formData.observaciones,
        dueño: {
          nombre: formData.dueñoNombre,
          telefono: formData.dueñoTelefono,
          email: formData.dueñoEmail
        },
        mascota: {
          nombre: formData.mascotaNombre,
          tipo: formData.mascotaTipo,
          raza: formData.mascotaRaza,
          edad: formData.mascotaEdad
        },
        veterinario: {
          nombre: formData.veterinario
        },
        clinica: {
          nombre: formData.clinica,
          direccion: formData.clinicaDireccion
        }
      });
      
      // Agregar la nueva cita a la lista
      setCitas(prev => [nuevaCita, ...prev]);
      
      // Cerrar modal
      setModalRegistroOpen(false);
      
      console.log("Cita registrada exitosamente:", nuevaCita);
    } catch (error) {
      console.error("Error al registrar cita:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarCita = async (formData: CitaEditFormData) => {
    if (!citaParaEditar) return;
    
    setLoading(true);
    try {
      // 🔧 CAMBIA ESTA RUTA por tu endpoint real
      const citaActualizada = await api.put<Cita>(`/citas/${citaParaEditar.id}`, {
        fecha: formData.fecha,
        hora: formData.hora,
        motivo: formData.motivo,
        observaciones: formData.observaciones,
        dueño: {
          nombre: formData.dueñoNombre,
          telefono: formData.dueñoTelefono,
          email: formData.dueñoEmail
        },
        mascota: {
          nombre: formData.mascotaNombre,
          tipo: formData.mascotaTipo,
          raza: formData.mascotaRaza,
          edad: formData.mascotaEdad
        },
        veterinario: {
          nombre: formData.veterinario
        },
        clinica: {
          nombre: formData.clinica,
          direccion: formData.clinicaDireccion
        }
      });
      
      // Actualizar la cita en la lista
      setCitas(prev => prev.map(c => c.id === citaParaEditar.id ? citaActualizada : c));
      
      // Cerrar modal
      setModalEditarOpen(false);
      setCitaParaEditar(null);
      
      console.log("Cita actualizada exitosamente:", citaActualizada);
    } catch (error) {
      console.error("Error al actualizar cita:", error);
    } finally {
      setLoading(false);
    }
  };

  const cerrarModalDetalles = () => {
    setModalDetallesOpen(false);
    setCitaSeleccionada(null);
  };

  const cerrarModalRegistro = () => {
    setModalRegistroOpen(false);
  };

  const cerrarModalEditar = () => {
    setModalEditarOpen(false);
    setCitaParaEditar(null);
  };

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {citas.map((cita, index) => {
          return (
            <div
              key={cita.id ?? index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-lg hover:border-[#079f92]/30 transition-all duration-200"
            >
              {/* Header con icono */}
              <div className="flex items-start mb-3">
                <CitaIcon />
              </div>

              {/* Fecha y hora */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  <span>{cita.fecha}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-4" />
                  <span>{cita.hora}</span>
                </div>
              </div>

              {/* Información del dueño */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="size-4 text-[#079f92]" />
                  <span className="text-sm font-bold text-gray-700">Dueño</span>
                </div>
                <p className="text-sm text-gray-800 font-medium truncate">{cita.dueño.nombre}</p>
                {cita.dueño.telefono && (
                  <p className="text-xs text-gray-500 truncate">{cita.dueño.telefono}</p>
                )}
              </div>

              {/* Información de la mascota */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <PawPrint className="size-4 text-[#079f92]" />
                  <span className="text-sm font-bold text-gray-700">Mascota</span>
                </div>
                <p className="text-sm text-gray-800 font-medium truncate">{cita.mascota.nombre}</p>
                <p className="text-xs text-gray-500 truncate">{cita.mascota.tipo} - {cita.mascota.raza}</p>
              </div>

              {/* Motivo */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Motivo:</p>
                <p className="text-sm text-gray-600 line-clamp-2">{cita.motivo}</p>
              </div>

              {/* Botones */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleVerDetalles(cita)}
                  className="flex-1 bg-[#f0644f] hover:bg-[#e55a47] text-white py-2 text-sm font-bold rounded-lg transition-colors"
                >
                  <Eye className="size-4 mr-1" />
                  Ver Detalles
                </Button>
                
                <Button
                  onClick={() => handleEditarCita(cita)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 text-sm font-bold rounded-lg transition-colors"
                >
                  Editar
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de detalles */}
      {citaSeleccionada && (
        <Modal
          isOpen={modalDetallesOpen}
          onClose={cerrarModalDetalles}
          title={`Detalles de la Cita #${citaSeleccionada.id}`}
          size="xl"
        >
          <CitaDetalles
            cita={citaSeleccionada as CitaCompleta}
            onClose={cerrarModalDetalles}
          />
        </Modal>
      )}

      {/* Modal de edición */}
      {citaParaEditar && (
        <Modal
          isOpen={modalEditarOpen}
          onClose={cerrarModalEditar}
          title={`Editar Cita #${citaParaEditar.id}`}
          size="xl"
        >
          <EditarCitaForm
            cita={citaParaEditar as CitaParaEditar}
            onSubmit={handleActualizarCita}
            onCancel={cerrarModalEditar}
            loading={loading}
          />
        </Modal>
      )}

      {/* Modal de registro */}
      <Modal
        isOpen={modalRegistroOpen}
        onClose={cerrarModalRegistro}
        title="Agendar Nueva Cita"
        size="xl"
      >
        <RegistrarCitaForm
          onSubmit={handleRegistrarCita}
          onCancel={cerrarModalRegistro}
          loading={loading}
        />
      </Modal>
    </div>
  );
}

export default CitasPage;