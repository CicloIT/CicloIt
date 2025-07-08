import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';

import ListaUsuarios from "../components/ListaUsuarios";
import PerfilUsuario from "../components/PerfilUsuario";
import RegistroUsuarios from "../components/RegistroUsuarios";
import OrdenTrabajo from "../components/OrdenTrabajo";
import FormularioReclamos from "../components/FormularioReclamos";
import Login from "../components/Login";
import CrearPresupuesto from "../components/CrearPresupuesto";
import Reclamos from "../components/Reclamos";
import RegistrarCliente from "../components/RegistrarCliente";
import FormularioOrden from "../components/formularioOrden";
import Navbar from "../components/NavBar/NavBar";
import ListaPresupuestos from "../components/ListaPresupuestos";
import DetallePresupuesto from "../components/DetallesPresupuesto";
import AgregarProducto from "../components/AgregarProducto";
import AgregarServicio from "../components/AgregarServicio";
import MaterialesApp from "../components/MaterialesApp";
import MovimientosApp from "../components/MovimientoApp";
import ResponsablesApp from "../components/Responsables";
import SeleccionarModulo from "../components/SeleccionarModulo";
import StockLayout from "../components/StockLayout";

const Inicio = () => {
  return (
    <div>
      <Reclamos />
    </div>
  );
};

function App() {
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true); // Para evitar redirección antes de cargar el token
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("user"));
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRol(decodedToken.rol);
        // Establece el usuario actual con la información del token
        setUsuarioActual({
          id: decodedToken.id,
          nombre: decodedToken.nombre,
        });
      } catch (error) {
        console.error(error, "Token inválido, cerrando sesión...");
        localStorage.removeItem("user");
        setRol(null);
        setUsuarioActual(null);
      }
    }
    setLoading(false);
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem("user", newToken);
    setToken(newToken); // Dispara el useEffect y actualiza el usuario sin recargar la página
  };

  // Mientras se verifica el token, mostrar un mensaje de carga
  if (loading) return <div className="text-center text-lg">Cargando...</div>;

  // Función para proteger rutas según el rol
  const RutaProtegida = ({ children, rolesPermitidos }) => {
    if (!rol) {
      return <Navigate to="/login" replace />;
    }
    if (!rolesPermitidos.includes(rol)) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  RutaProtegida.propTypes = {
    children: PropTypes.node.isRequired,
    rolesPermitidos: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login setRol={setRol} onLogin={handleLogin} />} />

        {/* Selección inicial luego del login */}
        <Route path="/seleccionar-modulo" element={<RutaProtegida rolesPermitidos={["admin", "tecnico"]}><SeleccionarModulo /></RutaProtegida>} />

        {/* Módulo Stock */}
        <Route path="/stock/*" element={<RutaProtegida rolesPermitidos={["admin"]}><StockLayout rol={rol} /></RutaProtegida>} />

        {/* Resto de rutas (Main Layout) */}
        <Route
          path="/*"
          element={
            <RutaProtegida rolesPermitidos={["admin", "tecnico", "cliente"]}>
              <>
                <Navbar rol={rol} setRol={setRol} />
                <Routes>
                  <Route path="/" element={<Inicio />} />
                  <Route path="/reclamos" element={<Reclamos />} />
                  <Route path="/orden-trabajo" element={<OrdenTrabajo />} />
                  <Route path="/registro" element={<RegistroUsuarios />} />
                  <Route path="/registrar-cliente" element={<RegistrarCliente />} />
                  <Route path="/usuarios" element={<ListaUsuarios />} />
                  <Route path="/usuarios/:id" element={<PerfilUsuario />} />
                  <Route path="/registrar-reclamo" element={<FormularioReclamos usuarioActual={usuarioActual} rol={rol} />} />
                  <Route path="/registrar-orden" element={<FormularioOrden />} />
                  <Route path="/crear-presupuesto" element={<CrearPresupuesto />} />
                  <Route path="/ver-presupuesto" element={<ListaPresupuestos />} />
                  <Route path="/ver-presupuesto-detalles/:id" element={<DetallePresupuesto />} />
                  <Route path="/agregar-producto" element={<AgregarProducto />} />
                  <Route path="/agregar-servicio" element={<AgregarServicio />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </>
            </RutaProtegida>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
