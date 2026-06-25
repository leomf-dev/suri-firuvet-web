import { NavLink, useNavigate } from "react-router-dom";
import LogoImg from "@assets/Logo.jpeg";
import InicioIcon from "@assets/INICIO.png";
import CitasIcon from "@assets/CITAS.png";
import MascotasIcon from "@assets/MASCOTAS.png";
import ClinicasIcon from "@assets/CLINICAS.png";
import CerrarSesionIcon from "@assets/CERRAR SESIÓN.png";

const navItems = [
  { to: "/inicio", label: "INICIO", icon: InicioIcon },
  { to: "/citas", label: "CITAS", icon: CitasIcon },
  { to: "/mascotas", label: "MASCOTAS", icon: MascotasIcon },
  { to: "/clinicas", label: "CLINICAS", icon: ClinicasIcon },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("cliente");
    navigate("/login");
  };

  return (
    <aside className="flex flex-col w-[20%] min-h-screen rounded-4xl bg-teal-600 text-white">
      {/* Logo */}
      <div className="flex items-center justify-center p-6">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
          <img src={LogoImg} alt="Logo" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 flex flex-col gap-1 px-3 mt-4">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-3xl text-lg font-bold transition-colors ${
                isActive
                  ? "bg-[#e8735a] text-white shadow-md"
                  : "text-white/90 hover:bg-white/10"
              }`
            }
          >
            <img src={icon} alt={label} className="size-6" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Cerrar sesión */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-3xl text-white/90 font-bold hover:bg-white/10 transition-colors"
        >
          <img src={CerrarSesionIcon} alt="Cerrar sesión" className="size-6" />
          CERRAR SESIÓN
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
