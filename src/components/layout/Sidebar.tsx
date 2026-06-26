import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import LogoImg from "@assets/Logo.jpeg";
import InicioIcon from "@assets/INICIO.png";
import CitasIcon from "@assets/CITAS.png";
import MascotasIcon from "@assets/MASCOTAS.png";
import ClinicasIcon from "@assets/CLINICAS.png";

const navItems = [
  { to: "/inicio", label: "INICIO", icon: InicioIcon },
  { to: "/citas",     label: "CITAS",     icon: CitasIcon    },
  { to: "/mascotas",  label: "MASCOTAS",  icon: MascotasIcon },
  { to: "/clinicas",  label: "CLINICAS",  icon: ClinicasIcon },
];

interface SidebarProps {
  onClose?:   () => void;
  collapsed?: boolean;
}

function Sidebar({ onClose, collapsed = false }: SidebarProps) {

  return (
    <aside className="flex flex-col h-full min-h-screen bg-teal-600 text-white rounded-none lg:rounded-4xl overflow-hidden">

      {/* Mobile close */}
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 lg:hidden" aria-label="Cerrar">
          <X className="size-5" />
        </button>
      )}

      {/* Logo */}
      <div className={`flex flex-col items-center gap-2 pt-6 pb-4 transition-all duration-200 ${collapsed ? "px-2" : "px-4"}`}>
        <div className={`bg-white/20 rounded-full overflow-hidden transition-all duration-200 ${collapsed ? "w-9 h-9" : "w-16 h-16"}`}>
          <img src={LogoImg} alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="mx-3 h-px bg-white/20" />

      {/* Nav */}
      <nav className={`flex-1 flex flex-col gap-1 mt-3 transition-all duration-200 ${collapsed ? "px-1 items-center" : "px-2"}`}>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 rounded-2xl font-bold transition-all duration-150
               ${collapsed ? "w-10 justify-center px-0" : "px-3"}
               ${isActive
                 ? "bg-[#e8735a] text-white shadow-md"
                 : "text-white/80 hover:bg-white/10 hover:text-white"
               }`
            }
          >
            <img src={icon} alt={label} className="size-5 shrink-0" />
            {!collapsed && <span className="text-sm truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className={`pb-4 pt-2 transition-all duration-200 ${collapsed ? "px-1 flex justify-center" : "px-3"}`}>
        <div className="h-px bg-white/20 mb-3" />
        {collapsed ? (
          <span className="text-[10px] text-white/40 font-bold">©</span>
        ) : (
          <p className="text-[10px] text-white/40 text-center leading-relaxed">
            © 2026 Inscode
          </p>
        )}
      </div>

    </aside>
  );
}

export default Sidebar;
