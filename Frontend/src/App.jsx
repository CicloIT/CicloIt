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
        console.error(error,"Token inválido, cerrando sesión...");
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
      <Navbar rol={rol} setRol={setRol}/>
      <Routes>
        {/* Ruta de inicio de sesión */}
        <Route path="/login" element={<Login setRol={setRol} onLogin={handleLogin} />} />
        {/* Rutas accesibles por todos los roles */}
        <Route path="/" element={<RutaProtegida rolesPermitidos={["admin", "tecnico"]}><Inicio /></RutaProtegida>} />
        <Route path="/reclamos" element={<RutaProtegida rolesPermitidos={["admin", "tecnico", "cliente"]}><Reclamos /></RutaProtegida>} />
        <Route path="/orden-trabajo" element={<RutaProtegida rolesPermitidos={["admin", "tecnico"]}><OrdenTrabajo /></RutaProtegida>} />
        {/* Rutas exclusivas para admin */}
        <Route path="/registro" element={<RutaProtegida rolesPermitidos={["admin"]}><RegistroUsuarios /></RutaProtegida>} />
        <Route path="/registrar-cliente" element={<RutaProtegida rolesPermitidos={["admin"]}><RegistrarCliente /></RutaProtegida>} />
        <Route path="/usuarios" element={<RutaProtegida rolesPermitidos={["admin"]}><ListaUsuarios /></RutaProtegida>} />
        <Route path="/usuarios/:id" element={<RutaProtegida rolesPermitidos={["admin"]}><PerfilUsuario /></RutaProtegida>} />        
        <Route path="/registrar-reclamo" element={<RutaProtegida rolesPermitidos={["admin", "cliente"]}><FormularioReclamos usuarioActual={usuarioActual} rol={rol}/></RutaProtegida>} />
        <Route path="/registrar-orden" element={<RutaProtegida rolesPermitidos={["admin"]}><FormularioOrden /></RutaProtegida>} />
        <Route path="/registrar-clientes" element={<RutaProtegida rolesPermitidos={["admin"]}><RegistrarCliente /></RutaProtegida>} />
        <Route path="/crear-presupuesto" element={<RutaProtegida rolesPermitidos={["admin"]}> <CrearPresupuesto/></RutaProtegida>}/>
        <Route path="/ver-presupuesto" element={<RutaProtegida rolesPermitidos={["admin"]}><ListaPresupuestos /> </RutaProtegida>} />
        <Route path="/ver-presupuesto-detalles/:id" element={<RutaProtegida rolesPermitidos={["admin"]}><DetallePresupuesto /></RutaProtegida>} />
        <Route path="/agregar-producto" element={<RutaProtegida rolesPermitidos={["admin"]}><AgregarProducto /></RutaProtegida>} />
        <Route path="/agregar-servicio" element={<RutaProtegida rolesPermitidos={["admin"]}><AgregarServicio /></RutaProtegida>} />
      </Routes>
    </Router>
  );
}

export default App;
