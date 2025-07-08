import PropTypes from 'prop-types';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { login } from "../services/api";
import { jwtDecode } from "jwt-decode";

function Login({ setRol, onLogin }) {  // <-- Recibe onLogin como prop
  const [nombre, setNombre] = useState("");  
  const [contrasena, setContrasena] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensajeError("");
    setIsLoading(true); 

    try {
      const data = { nombre, contrasena };
      const response = await login(data);      

      const decodedToken = jwtDecode(response.token);
      setRol(decodedToken.rol); 
      onLogin(response.token); // <-- Llamamos a onLogin para actualizar el token en App.js

      navigate("/seleccionar-modulo"); 
    } catch (error) {
      setMensajeError("Error al intentar iniciar sesión");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Iniciar sesión
        </h2>

        <form onSubmit={manejarEnvio}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
             {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="ml-2">Iniciando sesión</span>
            </div>
          ) : (
            'Iniciar sesión'
          )}
          </button>
        </form>

        {mensajeError && (
          <p className="mt-4 text-red-500 text-center">{mensajeError}</p>
        )}
      </div>
    </div>
  );
}

Login.propTypes = {
  setRol: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired // <-- Asegurar que la prop es requerida
};

export default Login;
