import { perfilUsuario,cambiarContra } from "../services/api";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

function PerfilUsuario() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [mostrarCambioContrasena, setMostrarCambioContrasena] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [cargandoCambio, setCargandoCambio] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const response = await perfilUsuario(id);
        setUsuario(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setMessage("Error al obtener el perfil del usuario");
      }
    };
    obtenerUsuario();
  }, [id]); // Agregar `navigate` como dependencia


  const handleActualizarContrasena = async () => {
    if (!nuevaPassword) {
      setMessage("Por favor, ingresa una nueva contraseña.");
      return;
    }
    setCargandoCambio(true);
    setMessage("");
    try {
      await cambiarContra(id, nuevaPassword);
      setMessage("Contraseña actualizada exitosamente");
      setNuevaPassword("");
      setMostrarCambioContrasena(false);
      setTimeout(() => {
        navigate("/")
      }, 1000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setCargandoCambio(false);
    }
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }
  if (message) {
    return <div className="text-center">{message}</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 border rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-center mb-4">Datos del Usuario</h2>
    <div className="space-y-4">
      <div>
        <strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}
      </div>
      <div>
        <strong>Rol:</strong> {usuario.rol}
      </div>
      <div>
        <strong>Estado:</strong> {usuario.activo ? "Activo" : "Inactivo"}
      </div>
      <div>
        <strong>Fecha de Registro:</strong> 
        {usuario.creacion ? format(new Date(usuario.creacion), "dd/MM/yyyy HH:mm") : "No disponible"}
      </div>
    </div>

    {/* Botón para mostrar el campo de cambio de contraseña */}
    <button
      onClick={() => setMostrarCambioContrasena(!mostrarCambioContrasena)}
      className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300"
    >
      {mostrarCambioContrasena ? "Cancelar" : "Cambiar Contraseña"}
    </button>

    {/* Campo para ingresar la nueva contraseña */}
    {mostrarCambioContrasena && (
      <div className="mt-4">
        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
        <button
          onClick={handleActualizarContrasena}
          className={`mt-2 w-full text-white py-2 px-4 rounded-lg ${
            cargandoCambio ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
          disabled={cargandoCambio}
        >
          {cargandoCambio ? "Actualizando..." : "Guardar Contraseña"}
        </button>
      </div>
    )}
    {/* Mensaje de éxito o error */}
    {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
  </div>
  );
}

export default PerfilUsuario;
