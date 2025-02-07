import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, rol, requiredRole }) => {
  if (!rol) {
    return <Navigate to="/login" />; // Si no hay rol (usuario no autenticado), redirige a login
  }

  if (requiredRole && rol !== requiredRole) {
    return <Navigate to="/" />; // Si el rol no coincide con el requerido, redirige al inicio
  }

  return children; // Si tiene el rol correcto, renderiza los hijos (la ruta)
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  rol: PropTypes.string,
  requiredRole: PropTypes.string
};

export default ProtectedRoute;
