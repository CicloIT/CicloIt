import { useEffect, useState } from "react";
import { obtenerOrdenes, listaUsuarios } from "../services/api";
import { format } from "date-fns";

function OrdenTrabajo() {
  const [ordenes, setOrdenes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({
    importancia: '',
    usuarioAsignado: '',
    estado: '',
    nombreCliente: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordenesData, usuariosData] = await Promise.all([
          obtenerOrdenes(),
          listaUsuarios()
        ]);
        setOrdenes(ordenesData);
        setUsuarios(usuariosData);
      } catch (err) {
        setError("Error al cargar las órdenes de trabajo");
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

  const ordenesFiltradas = ordenes?.filter(orden => {
    return (
      (!filtros.importancia || orden.importancia.toLowerCase().includes(filtros.importancia.toLowerCase())) &&
      (!filtros.usuarioAsignado || orden.nombre_usuario_asignado === filtros.usuarioAsignado) &&
      (!filtros.estado || orden.estado.toLowerCase().includes(filtros.estado.toLowerCase())) &&
      (!filtros.nombreCliente || orden.empresa.toLowerCase().includes(filtros.nombreCliente.toLowerCase()))
    );
  });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (ordenes?.length === 0) return <p className="text-center text-2xl mt-10">No se encontraron ordenes de trabajo</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-5">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Lista de Órdenes de Trabajo
      </h2>

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
            <option value="pendiente">Pendientes</option>
            <option value="en proceso">En Procesos</option>
            <option value="finalizado">Finalizados</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {ordenesFiltradas.map((orden) => (
            <li
              key={orden.orden_id}
              className="p-4 hover:bg-gray-50 transition-colors duration-150"
            >            
              <div className="grid grid-cols-2 gap-4">
                <p className="text-sm">
                  <span className="font-semibold">Cliente:</span> {orden.empresa}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Asignado a:</span> {orden.nombre_usuario_asignado}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Importancia:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    orden.importancia === 'alta' ? 'bg-red-100 text-red-800' :
                    orden.importancia === 'media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {orden.importancia}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Estado:</span>
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    orden.estado === 'pendiente' ? 'bg-gray-100 text-gray-800' :
                    orden.estado === 'en proceso' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {orden.estado}
                  </span>
                </p>
                <p className="text-sm col-span-2">
                  <span className="font-semibold">Descripción:</span> {orden.descripcion}
                </p>
                <p className="text-sm col-span-2">
                  <span className="font-semibold">Fecha de Creación:</span> {orden.creacion ? format(new Date(orden.creacion), "dd/MM/yyyy HH:mm") : "No disponible"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrdenTrabajo;
