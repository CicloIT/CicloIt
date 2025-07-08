// components/NavBar/NavbarStock.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function NavbarStock() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xl">Stock</span>
          <NavLink
            to="/stock/materiales"
            className={({ isActive }) =>
              isActive ? "underline" : "hover:underline"
            }
          >
            Materiales
          </NavLink>
          <NavLink
            to="/stock/movimientos"
            className={({ isActive }) =>
              isActive ? "underline" : "hover:underline"
            }
          >
            Movimientos
          </NavLink>
          <NavLink
            to="/stock/responsables"
            className={({ isActive }) =>
              isActive ? "underline" : "hover:underline"
            }
          >
            Responsables
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/seleccionar-modulo")}
            className="bg-white text-green-700 px-3 py-1 rounded hover:bg-green-100 transition"
          >
            Volver a módulos
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm hover:underline"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
