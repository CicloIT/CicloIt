import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { useState } from "react";

const Navbar = ({ rol, setRol }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setRol(null);
    navigate("/login");
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="text-sm font-medium text-gray-200 hover:bg-blue-600 px-3 py-2 rounded-md transition-colors duration-200"
    >
      {children}
    </Link>
  );

  NavLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  };

  return (
    <nav className="bg-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:text-blue-400 transition-colors font-mono">
              CicloIT
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:items-center">
            <div className="flex space-x-1">
              {rol === "admin" && (
                <>
                  <NavLink to="/registro">Registro usuario</NavLink>
                  <NavLink to="/registrar-cliente">Registrar clientes</NavLink>
                  <NavLink to="/registrar-orden">Registrar orden</NavLink>
                  <NavLink to="/registrar-reclamo">Registrar reclamos</NavLink>
                  <NavLink to="/usuarios">Ver usuarios</NavLink>                  
                </>
              )}
              {rol && (
                <>
                  <NavLink to="/orden-trabajo">Ordenes de trabajo</NavLink>
                  <NavLink to="/reclamos">Reclamos</NavLink>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-200 hover:bg-red-600 px-3 py-2 rounded-md transition-colors duration-200"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? <HiX className="block h-7 w-7" /> : <HiMenuAlt4 className="block h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 py-4 space-y-2 bg-slate-800 shadow-xl rounded-b-lg">
          {rol === "admin" && (
            <>
              <Link 
                to="/registro" 
                className="block text-base font-medium text-gray-200 hover:bg-blue-600 px-4 py-3 rounded-md transition-colors duration-200"
              >
                Registro usuario
              </Link>
              <Link 
                to="/registrar-orden"
                className="block text-base font-medium text-gray-200 hover:bg-blue-600 px-4 py-3 rounded-md transition-colors duration-200"
              >
                Registrar orden
              </Link>
              <Link 
                to="/registrar-reclamo"
                className="block text-base font-medium text-gray-200 hover:bg-blue-600 px-4 py-3 rounded-md transition-colors duration-200"
              >
                Registrar reclamos
              </Link>
              <Link 
                to="/usuarios"
                className="block text-base font-medium text-gray-200 hover:bg-blue-600 px-4 py-3 rounded-md transition-colors duration-200"
              >
                Ver usuarios
              </Link>
            </>
          )}
          {rol && (
            <>
              <Link 
                to="/orden-trabajo"
                className="block text-base font-medium text-gray-200 hover:bg-blue-600 px-4 py-3 rounded-md transition-colors duration-200"
              >
                Ordenes de trabajo
              </Link>
              <Link 
                to="/reclamos"
                className="block text-base font-medium text-gray-200 hover:bg-blue-600 px-4 py-3 rounded-md transition-colors duration-200"
              >
                Reclamos
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-base font-medium text-gray-200 hover:bg-red-600 px-4 py-3 rounded-md transition-colors duration-200"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  rol: PropTypes.string,
  setRol: PropTypes.func.isRequired
};

export default Navbar;
