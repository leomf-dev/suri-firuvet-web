import { useEffect, useState } from "react";
import { PageHeader, LoadingOverlay, EmptyState, ErrorMessage } from "@components/common";
import { ClinicaCard } from "@components/clinicas";
import { catalogoService } from "@services/index";
import type { Clinica } from "@appTypes";

function ClinicasPage() {
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    catalogoService
      .getClinicas()
      .then(setClinicas)
      .catch((e: Error) => setError(e.message || "Error al cargar clínicas"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clínicas"
        description="Visualiza las clínicas veterinarias disponibles."
      />

      {loading && <LoadingOverlay message="Cargando clínicas..." />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && clinicas.length === 0 && (
        <EmptyState
          title="Sin clínicas"
          description="No se encontraron clínicas registradas."
        />
      )}

      {!loading && !error && clinicas.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {clinicas.map((clinica) => (
            <ClinicaCard key={clinica.id} clinica={clinica} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ClinicasPage;
