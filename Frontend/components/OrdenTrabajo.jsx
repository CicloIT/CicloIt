import { useEffect, useState } from "react";
import { obtenerOrdenes, actualizarOrden, eliminarOrdenTrabajo, obtenerUsuarios } from "../services/api";
import { format } from "date-fns";
import { Pencil, Trash2, Filter, UserCircle, AlertTriangle, ClipboardList, LoaderCircle, Save, XCircle, MessageSquareText } from "lucide-react";

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
  const [ordenEditada, setOrdenEditada] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordenesData, usuariosData] = await Promise.all([
          obtenerOrdenes(),
          obtenerUsuarios()
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

  const handleEditar = (orden) => {
    // Asegurarse de que usuario_id esté correctamente asignado desde el inicio
    setOrdenEditada({
      ...orden,
      usuario_id: orden.id_usuario || '' // Usar el valor existente o un valor predeterminado
    });
  };

  const handleDelete = async (ordenId) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar esta orden?");
    if (!confirmacion) return;
    try {
      await eliminarOrdenTrabajo(ordenId);
      setOrdenes(prev => prev.filter(o => o.orden_id !== ordenId));
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
      alert("Error al eliminar la orden");
    }
  }
  const handleGuardarEdicion = async () => {
    try {
      // Preparar los datos para actualizar, manteniendo el usuario_id original si no cambió
      const datosActualizados = {
        importancia: ordenEditada.importancia,
        estado: ordenEditada.estado,
        id_usuario: ordenEditada.usuario_id
      };

      await actualizarOrden(ordenEditada.orden_id, datosActualizados);

      // Actualiza el estado local
      setOrdenes((prev) => prev.map(o =>
        o.orden_id === ordenEditada.orden_id ? {
          ...ordenEditada,
          nombre_usuario_asignado: usuarios.find(u => u.id === parseInt(ordenEditada.usuario_id))?.nombre || o.nombre_usuario_asignado
        } : o
      ));

      setOrdenEditada(null);
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
      alert("Error al actualizar la orden");
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrdenEditada(prev => ({
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
        <div className="flex flex-col relative">
          <input
            type="text"
            name="nombreCliente"
            placeholder="Filtrar por cliente..."
            value={filtros.nombreCliente}
            onChange={handleFiltroChange}
            className="p-2 pl-10 border rounded shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
          />
          <UserCircle className="absolute left-2 top-2.5 text-gray-400 w-5 h-5" />
        </div>
        <div className="flex flex-col relative">
          <select
            name="usuarioAsignado"
            value={filtros.usuarioAsignado}
            onChange={handleFiltroChange}
            className="p-2 pl-10 border rounded shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
          >
            <option value="">Todos los usuarios</option>
            {usuarios.map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre}
              </option>
            ))}
          </select>
          <Filter className="absolute left-2 top-2.5 text-gray-400 w-5 h-5" />
        </div>
        <div className="flex flex-col relative">       
          <select
            name="importancia"
            value={filtros.importancia}
            onChange={handleFiltroChange}
             className="p-2 pl-10 border rounded shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
          >
            <option className="pl-4" value="">Importancias</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>         
          <AlertTriangle className="absolute left-2 top-2.5 text-gray-400 w-5 h-5" />
        </div>
        <div className="flex flex-col relative">       
          <select
            name="estado"
            value={filtros.estado}
            onChange={handleFiltroChange}
             className="p-2 pl-10 border rounded shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
          >
            <option  value="">Estados</option>
            <option value="abierto">Abiertos</option>
            <option value="en proceso">En Procesos</option>
            <option value="cerrado">Cerrados</option>
          </select>
          <ClipboardList className="absolute left-2 top-2.5 text-gray-400 w-5 h-5" />
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
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${orden.importancia === 'alta' ? 'bg-red-100 text-red-800' : orden.importancia === 'media' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {orden.importancia}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Estado:</span>
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${orden.estado === 'pendiente' ? 'bg-gray-100 text-gray-800' : orden.estado === 'en proceso' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
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
              <div className="col-span-2 text-right flex gap-4 justify-end">
              <button
                          onClick={() => iniciarEdicion(reclamo)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(reclamo.id)}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Formulario de edición */}
      {ordenEditada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-lg font-semibold mb-4">Editar Orden</h3>
            <div className="mb-4">
              <label className="block text-sm">Importancia</label>
              <select
                name="importancia"
                value={ordenEditada.importancia}
                onChange={handleChange}
                className="p-2 border rounded shadow-sm w-full"
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm">Estado</label>
              <select
                name="estado"
                value={ordenEditada.estado}
                onChange={handleChange}
                className="p-2 border rounded shadow-sm w-full"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en proceso">En Proceso</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm">Usuario Asignado</label>
              <select
                name="usuario_id"
                value={ordenEditada.usuario_id}
                onChange={handleChange}
                className="p-2 border rounded shadow-sm w-full"
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleGuardarEdicion}
                className="p-2 bg-green-500 text-white rounded-md mr-2"
              >
                Guardar
              </button>
              <button
                onClick={() => setOrdenEditada(null)}
                className="p-2 bg-gray-500 text-white rounded-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdenTrabajo;