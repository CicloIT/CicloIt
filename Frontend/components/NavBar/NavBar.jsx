// src/components/Navbar/Navbar.jsx
import { useState, useEffect, useRef, useCallback, useReducer } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import "./navbar.css";
import { MENU_OPTIONS } from "./constants";
import { navReducer, initialNavState } from "./navReducer";
import { useOutsideClick } from "./hooks/useOutsideClick";
import { DropdownMenu } from "./DropdownMenu";
import { MobileDropdown } from "./MobileDropdown";

const Navbar = ({ rol, setRol }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState("/");
  const [state, dispatch] = useReducer(navReducer, initialNavState);
  const navRef = useRef(null);

  // Actualizar ruta activa cuando cambia la ubicación
  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);

  // Cerrar los dropdowns al hacer clic fuera
  useOutsideClick(navRef, () => {
    dispatch({ type: "CLOSE_ALL_DROPDOWNS" });
  });

  // Función para cerrar el menú móvil
  const closeMobileMenu = useCallback(() => {
    dispatch({ type: "CLOSE_ALL" });
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = useCallback(() => {
    closeMobileMenu();
    localStorage.removeItem("user");
    setRol(null);
    navigate("/login");
  }, [navigate, setRol, closeMobileMenu]);

  // Función para alternar dropdown
  const toggleDropdown = useCallback((name) => {
    dispatch({ type: "TOGGLE_DROPDOWN", payload: name });
  }, []);

  const getMenuOptions = (rol) => {
    if (rol === "cliente") {
      return {
        register: MENU_OPTIONS.register.filter(
          (option) => option.to === "/registrar-reclamo"
        ),
        view: MENU_OPTIONS.view.filter((option) => option.to === "/reclamos"),
      };
    } else if (rol === "tecnico") {
      return {
        view: MENU_OPTIONS.techView,
      };
    } else if (rol === "admin") {
      return {
        register: MENU_OPTIONS.register,
        view: MENU_OPTIONS.view,
        add: MENU_OPTIONS.add,
      };
    }
    return {}; // Si no hay rol, no mostrar nada
  };

  const filteredMenuOptions = getMenuOptions(rol);

  return (
    <nav
      className="bg-slate-900 shadow-lg sticky top-0 z-50  navbar"
      ref={navRef}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-white tracking-tight hover:text-blue-400 transition-colors font-mono"
          >
            CicloIT
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {filteredMenuOptions.register && (
              <DropdownMenu
                isOpen={state.dropdowns.register}
                title="Registrar"
                options={filteredMenuOptions.register}
                onToggle={() => toggleDropdown("register")}
                id="register"
              />
            )}

            {filteredMenuOptions.view && (
              <DropdownMenu
                isOpen={state.dropdowns.view}
                title="Ver"
                options={filteredMenuOptions.view}
                onToggle={() => toggleDropdown("view")}
                id="view"
              />
            )}

            {filteredMenuOptions.add && (
              <DropdownMenu
                isOpen={state.dropdowns.add}
                title="Crear"
                options={filteredMenuOptions.add}
                onToggle={() => toggleDropdown("add")}
                id="add"
              />
            )}

            {rol && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-300 hover:bg-red-600 hover:text-white rounded-md transition-all duration-200"
              >
                Cerrar sesión
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          {rol && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => dispatch({ type: "TOGGLE_MOBILE_MENU" })}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-expanded={state.isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Abrir menú principal</span>
                {state.isMobileMenuOpen ? (
                  <HiX className="block h-7 w-7" aria-hidden="true" />
                ) : (
                  <HiMenuAlt4 className="block h-7 w-7" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden transition-all duration-300 ease-in-out ${
          state.isMobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-3 py-4 space-y-2 bg-slate-800 shadow-xl rounded-b-lg">
          {filteredMenuOptions.register && (
            <MobileDropdown
              isOpen={state.dropdowns.mobileRegister}
              title="Registrar"
              options={filteredMenuOptions.register}
              onToggle={() => toggleDropdown("mobileRegister")}
              activeRoute={activeRoute}
              closeMenu={closeMobileMenu}
            />
          )}

          {filteredMenuOptions.view && (
            <MobileDropdown
              isOpen={state.dropdowns.mobileView}
              title="Ver"
              options={filteredMenuOptions.view}
              onToggle={() => toggleDropdown("mobileView")}
              activeRoute={activeRoute}
              closeMenu={closeMobileMenu}
            />
          )}

          {rol && (
            <button
              onClick={handleLogout}
              className="w-full text-left text-base font-medium text-gray-200 hover:bg-red-600 px-4 py-3 rounded-md transition-colors duration-200"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  rol: PropTypes.string,
  setRol: PropTypes.func.isRequired,
};

export default Navbar;
