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
    dispatch({ type: 'CLOSE_ALL_DROPDOWNS' });
  });
  
  // Función para cerrar el menú móvil
  const closeMobileMenu = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL' });
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
    dispatch({ type: 'TOGGLE_DROPDOWN', payload: name });
  }, []);  
  return (
    <nav className="bg-slate-900 shadow-lg sticky top-0 z-50  navbar" ref={navRef}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:text-blue-400 transition-colors font-mono">
            CicloIT
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {rol === "admin" && (
              <>
                <DropdownMenu 
                  isOpen={state.dropdowns.register}
                  title="Registrar"
                  options={MENU_OPTIONS.register}
                  onToggle={() => toggleDropdown('register')}
                  id="register"
                />
                
                <DropdownMenu 
                  isOpen={state.dropdowns.view}
                  title="Ver"
                  options={MENU_OPTIONS.view}
                  onToggle={() => toggleDropdown('view')}
                  id="view"
                />
                <DropdownMenu 
                  isOpen={state.dropdowns.add}
                  title="Crear"
                  options={MENU_OPTIONS.add}  
                  onToggle={() => toggleDropdown('add')}
                  id="add"
                />
              </>
            )}
            
            {rol === "tecnico" && (
              <DropdownMenu 
                isOpen={state.dropdowns.view}
                title="Ver"
                options={MENU_OPTIONS.techView}
                onToggle={() => toggleDropdown('view')}
                id="tech-view"
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
                onClick={() => dispatch({ type: 'TOGGLE_MOBILE_MENU' })}
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

      {/* Mobile menu */}
      <div 
        id="mobile-menu"
        className={`md:hidden transition-all duration-300 ease-in-out ${
          state.isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-3 py-4 space-y-2 bg-slate-800 shadow-xl rounded-b-lg">      
          {rol === "admin" && (
            <>
              <MobileDropdown 
                isOpen={state.dropdowns.mobileRegister}
                title="Registrar"
                options={MENU_OPTIONS.register}
                onToggle={() => toggleDropdown('mobileRegister')}
                activeRoute={activeRoute}
                closeMenu={closeMobileMenu}
              />
              
              <MobileDropdown 
                isOpen={state.dropdowns.mobileView}
                title="Ver"
                options={MENU_OPTIONS.view}
                onToggle={() => toggleDropdown('mobileView')}
                activeRoute={activeRoute}
                closeMenu={closeMobileMenu}
              />

              <MobileDropdown 
                isOpen={state.dropdowns.mobileAdd}
                title="Crear"
                options={MENU_OPTIONS.add}
                onToggle={() => toggleDropdown('mobileAdd')}
                activeRoute={activeRoute}
                closeMenu={closeMobileMenu}
              />
            </>
          )}
          
          {rol === "tecnico" && (
            <MobileDropdown 
              isOpen={state.dropdowns.mobileView}
              title="Ver"
              options={MENU_OPTIONS.techView}
              onToggle={() => toggleDropdown('mobileView')}
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