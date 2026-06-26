import type { Clinica } from "@appTypes";
import ClinicaIcon from "@assets/CLINICAS.svg";

interface ClinicaCardProps {
  clinica: Clinica;
}

function ClinicaCard({ clinica }: ClinicaCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f3]">
        <img src={ClinicaIcon} alt="Clínica" className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold text-slate-800">{clinica.nombre}</p>
        <p className="truncate text-xs text-[#2db5a3]">{clinica.direccion}</p>
      </div>
    </div>
  );
}

export default ClinicaCard;
