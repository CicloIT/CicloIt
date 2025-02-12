import { useState, useEffect } from "react";
import { listaUsuarios } from "../services/api";
import { Link } from "react-router-dom";

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  useEffect(() => {    
    const obtenerUsuarios = async () => {
      try {
        const response = await listaUsuarios();
        setUsuarios(response);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setMessage("Error al obtener los usuarios");
      }
    };
    obtenerUsuarios();
  }, []);

  if (loading) {
    return <div className="text-center">Cargando usuarios...</div>;
  }

  if (message) {
    return <div className="text-center">{message}</div>;
  }
  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Lista de Usuarios
      </h2>
      <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left border-b">Nombre</th>
            <th className="px-4 py-2 text-left border-b">Rol</th>
            <th className="px-4 py-2 text-left border-b">Estado</th>
            <th className="px-4 py-2 text-left border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border-b">{usuario.nombre}</td>
                <td className="px-4 py-2 border-b">{usuario.rol}</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      usuario.activo ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  <Link
                    to={`/usuarios/${usuario.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Ver Perfil
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No hay usuarios registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListaUsuarios;
