import { PageHeader } from "@components/common";
import { clinicas, citas } from "@services";
import ClinicaIcon from "@assets/CLINICAS.svg";

function ClinicasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Clínicas"
        description="Visualiza las clínicas disponibles y el número de citas agendadas en cada una."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {clinicas.map((clinica) => {
          const citasCount = citas.filter((c) => c.idclinica === clinica.id).length;
          return (
            <div
              key={clinica.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f3]">
                <img src={ClinicaIcon} alt="Clínica" className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">{clinica.nombre}</p>
                <p className="truncate text-xs text-[#2db5a3]">{clinica.direccion}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {citasCount} cita{citasCount !== 1 ? "s" : ""} agendada{citasCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClinicasPage;
