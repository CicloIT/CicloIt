import { useEffect, useState } from "react";
import { obtenerReclamos, obtenerReclamosPorCliente, obtenerUsuarios } from "../services/api";
import { format } from "date-fns";

function Reclamos() {
  const [reclamos, setReclamos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({
    importancia: '',
    usuarioAsignado: '',
    estado: '',
    nombreCliente: '', // Este es el filtro para el cliente
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verifica el tipo de usuario logueado
        const token = localStorage.getItem("token");
        const usuarioLogueado = token ? JSON.parse(atob(token.split('.')[1])) : {};// Si el token está presente, obtenemos los datos del usuario
        let reclamosData;
        if (usuarioLogueado.rol === "cliente") {
          // Si el usuario es un cliente, obtenemos los reclamos de ese cliente
          reclamosData = await obtenerReclamosPorCliente(usuarioLogueado.usuario); // Asegúrate de que `obtenerReclamosPorCliente` reciba el ID del cliente          
        } else {
          // Si el usuario es un administrador, obtenemos todos los reclamos
          reclamosData = await obtenerReclamos();
        }
        const usuariosData = await obtenerUsuarios();
        setReclamos(reclamosData);
        setUsuarios(usuariosData);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const reclamosFiltrados = reclamos?.filter(reclamo => {
    const nombreCliente = reclamo.empresa || reclamo.cliente; // Usamos empresa si existe, sino cliente
    return (
      (!filtros.importancia || reclamo.importancia.toLowerCase().includes(filtros.importancia.toLowerCase())) &&
      (!filtros.usuarioAsignado || reclamo.usuario_nombre === filtros.usuarioAsignado) &&
      (!filtros.estado || reclamo.estado.toLowerCase().includes(filtros.estado.toLowerCase())) &&
      (!filtros.nombreCliente || nombreCliente.toLowerCase().includes(filtros.nombreCliente.toLowerCase())) // Filtramos por nombreCliente (empresa o cliente)
    );
  });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (reclamos?.length === 0) return <p className="text-center text-2xl mt-10">No se encontraron reclamos de trabajo</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-5">
      <h2 className="text-2xl font-semibold text-center mb-6">Lista de Reclamos</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col">
          <input
            type="text"
            name="nombreCliente"
            placeholder="Filtrar por cliente..."
            value={filtros.nombreCliente}
            onChange={handleFiltroChange}
            className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
          />
        </div>
        <div className="flex flex-col">
          <select
            name="usuarioAsignado"
            value={filtros.usuarioAsignado}
            onChange={handleFiltroChange}
            className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
          >
            <option value="">Todos los usuarios</option>
            {usuarios.map(usuario => (
              <option key={usuario.id} value={usuario.nombre}>
                {usuario.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <select
            name="importancia"
            value={filtros.importancia}
            onChange={handleFiltroChange}
            className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
          >
            <option value="">Todas las importancias</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>
        <div className="flex flex-col">
          <select
            name="estado"
            value={filtros.estado}
            onChange={handleFiltroChange}
            className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="abierto">Abiertos</option>
            <option value="en proceso">En Procesos</option>
            <option value="cerrado">Cerrados</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {reclamosFiltrados.map((reclamo) => {
            const nombreCliente = reclamo.empresa || reclamo.cliente; // Nombre del cliente (empresa o cliente)
            return (
              <li key={reclamo.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="grid grid-cols-2 gap-4">
                  <p className="text-sm">
                    <span className="font-semibold">Cliente:</span> {nombreCliente}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Asignado a:</span> {reclamo.usuario_nombre}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Importancia:</span> 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${ 
                      reclamo.importancia === 'alta' ? 'bg-red-100 text-red-800' :
                      reclamo.importancia === 'media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800' }`}>
                      {reclamo.importancia}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Estado:</span>
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${ 
                      reclamo.estado === 'pendiente' ? 'bg-gray-100 text-gray-800' :
                      reclamo.estado === 'en proceso' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800' }`}>
                      {reclamo.estado}
                    </span>
                  </p>
                  <p className="text-sm col-span-2">
                    <span className="font-semibold">Descripción:</span> {reclamo.reclamo_descripcion}
                  </p>
                  <p className="text-sm col-span-2">
                    <span className="font-semibold">Orden Descripcion:</span> {reclamo.orden_descripcion}
                  </p>
                  <p className="text-sm col-span-2">
                    <span className="font-semibold">Fecha de Creación:</span> {reclamo.creacion ? format(new Date(reclamo.creacion), "dd/MM/yyyy HH:mm") : "No disponible"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Reclamos;
