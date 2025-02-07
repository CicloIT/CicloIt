import { perfilUsuario } from "../services/api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";


function PerfilUsuario() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  

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
    </div>
  );
}

export default PerfilUsuario;
