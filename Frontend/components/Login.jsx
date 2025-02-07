import PropTypes from 'prop-types';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { login } from "../services/api";
import {jwtDecode} from "jwt-decode";

function Login({setRol}) {
  const [nombre, setNombre] = useState("");  
  const [contrasena, setContrasena] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const navigate = useNavigate();

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensajeError("");
    setMensajeExito("");

    try {
      const data = { nombre,contrasena };
      const response = await login(data);
      console.log(response);

      const decodedToken = jwtDecode(response.token);
      setRol(decodedToken.rol); // Actualizamos el rol en el componente padre

      setMensajeExito("Login exitoso");
      localStorage.setItem("user", JSON.stringify(response.token)); // Guardamos el token en el localStorage
      navigate("/"); // Redirige a la página principal
    } catch (error) {
      setMensajeError("Error al intentar iniciar sesión");
      console.error(error);
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
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Iniciar sesión
          </button>
        </form>

        {mensajeError && (
          <p className="mt-4 text-red-500 text-center">{mensajeError}</p>
        )}
        {mensajeExito && <p>{mensajeExito}</p>}
      </div>
    </div>
  );
}

Login.propTypes = {
  setRol: PropTypes.func.isRequired
};

export default Login;
