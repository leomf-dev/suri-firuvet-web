import { User, Mail, Calendar, ArrowLeft } from "lucide-react";
import { useAuth } from "@auth/index";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const { user, cliente } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft className="size-4 text-slate-600" />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mi Perfil</h1>
      </div>

      {/* 2 cols en lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Avatar card */}
        <div className="flex flex-col items-center gap-4 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#2db5a3] text-white">
            <User className="size-12" />
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">
              {cliente ? `${cliente.nombCli} ${cliente.apeCli}` : "Usuario"}
            </p>
            <p className="text-sm text-gray-400 mt-1">{user?.email ?? ""}</p>
          </div>
          <span className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-semibold rounded-full border border-teal-100">
            Cliente registrado
          </span>
        </div>

        {/* Datos — ocupa 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-5">Datos personales</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <User className="size-5 text-[#2db5a3] shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Nombre</p>
                <p className="font-semibold text-gray-800">{cliente?.nombCli ?? "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <User className="size-5 text-[#2db5a3] shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Apellido</p>
                <p className="font-semibold text-gray-800">{cliente?.apeCli ?? "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 sm:col-span-2">
              <Mail className="size-5 text-[#2db5a3] shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Correo electrónico</p>
                <p className="font-semibold text-gray-800">{user?.email ?? "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
              <Calendar className="size-5 text-[#2db5a3] shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Fecha de nacimiento</p>
                <p className="font-semibold text-gray-800">{cliente?.fecNac || "No registrada"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
