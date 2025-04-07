import { useEffect, useState } from "react";
import { obtenerReclamos, obtenerReclamosPorCliente, obtenerUsuarios, eliminarReclamo, editarReclamo } from "../services/api";
import { format } from "date-fns";
import { Pencil, Trash2, Filter, UserCircle, AlertTriangle, ClipboardList, LoaderCircle, Save, XCircle, MessageSquareText } from "lucide-react";


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
    cargo: '', // Este es el filtro para el cargo
  });
  const [editandoId, setEditandoId] = useState(null);
  const [formEdit, setFormEdit] = useState({
    importancia: "",
    estado: "",
    reclamo_descripcion: "",
    asignado: "",
    comentario: "",
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

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que querés eliminar este reclamo?");
    if (!confirmar) return;
    try {
      await eliminarReclamo(id);
      setReclamos(prev => prev.filter(reclamo => reclamo.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const iniciarEdicion = (reclamo) => {
    setEditandoId(reclamo.id);
    setFormEdit({
      importancia: reclamo.importancia || "",
      estado: reclamo.estado || "",
      reclamo_descripcion: reclamo.reclamo_descripcion || "",
      asignado: reclamo.usuario_id?.toString() || "", // <-- IMPORTANTE: forzamos a string
      comentario: reclamo.comentario || "",
    });
  };


  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormEdit({
      importancia: "",
      estado: "",
      reclamo_descripcion: "",
      asignado: "",
    });
  };

  const guardarCambios = async (id) => {
    try {
      const reclamoActualizado = await editarReclamo(id, formEdit);

      // Adaptar los nombres de campos si es necesario
      const nuevoReclamo = {
        ...reclamoActualizado,
        reclamo_descripcion: reclamoActualizado.descripcion,
        usuario_nombre: usuarios.find(u => u.id === Number(reclamoActualizado.asignado))?.nombre || "",
      };

      setReclamos(prev =>
        prev.map(r => (r.id === id ? { ...r, ...nuevoReclamo } : r))
      );

      cancelarEdicion();
    } catch (err) {
      console.error("Error al editar el reclamo:", err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormEdit(prev => ({
      ...prev,
      [name]: name === "asignado" && value !== "" ? Number(value) : value,
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
          {reclamosFiltrados.map((reclamo) => {
            const nombreCliente = reclamo.empresa || reclamo.cliente;
            const estaEditando = editandoId === reclamo.id;

            return (
              <li key={reclamo.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="grid grid-cols-2 gap-4">
                  {estaEditando ? (
                    <>
                      <p><strong>Cliente:</strong> {nombreCliente}</p>
                      <p><strong>Orden:</strong> {reclamo.orden_descripcion}</p>
                      <p><strong>Fecha de Creación:</strong> {format(new Date(reclamo.creacion), "dd/MM/yyyy HH:mm")}</p>
                      <p><strong>Cargado por:</strong> {reclamo.cargo || "No disponible"}</p>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium">Descripción del reclamo:</label>
                        <textarea
                          name="reclamo_descripcion"
                          value={formEdit.reclamo_descripcion}
                          onChange={handleEditChange}
                          className="w-full border p-2 rounded"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Importancia:</label>
                        <select
                          name="importancia"
                          value={formEdit.importancia}
                          onChange={handleEditChange}
                          className="w-full border p-2 rounded"
                        >
                          <option value="alta">Alta</option>
                          <option value="media">Media</option>
                          <option value="baja">Baja</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Estado:</label>
                        <select
                          name="estado"
                          value={formEdit.estado}
                          onChange={handleEditChange}
                          className="w-full border p-2 rounded"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en proceso">En Proceso</option>
                          <option value="cerrado">Cerrado</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Asignado a:</label>
                        <select
                          name="asignado"
                          value={formEdit.asignado}
                          onChange={handleEditChange}
                          className="w-full border p-2 rounded"
                        >
                          <option value="">Sin asignar</option>
                          {usuarios.map(usuario => (
                            <option key={usuario.id} value={usuario.id.toString()}>
                              {usuario.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2 flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => guardarCambios(reclamo.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
                        >
                          <Save size={16} />
                          Guardar
                        </button>

                        <button
                          onClick={cancelarEdicion}
                          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Cancelar
                        </button>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium">Comentario:</label>
                        <textarea
                          name="comentario"
                          value={formEdit.comentario}
                          onChange={handleEditChange}
                          className="w-full border p-2 rounded"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p><strong>Cliente:</strong> {nombreCliente}</p>
                      <p><strong>Asignado a:</strong> {reclamo.usuario_nombre || "Sin asignar"}</p>
                      <p><strong>Importancia:</strong> {reclamo.importancia}</p>
                      <p><strong>Estado:</strong> {reclamo.estado}</p>
                      <p className="col-span-2"><strong>Descripción:</strong> {reclamo.reclamo_descripcion}</p>
                      <p className="col-span-2"><strong>Orden:</strong> {reclamo.orden_descripcion}</p>
                      <p className="col-span-2"><strong>Fecha de Creación:</strong> {format(new Date(reclamo.creacion), "dd/MM/yyyy HH:mm")}</p>
                      <p className="col-span-2"><strong>Cargado por:</strong> {reclamo.cargo || "No disponible"}</p>
                      <p className="col-span-2"><strong>Comentario:</strong> {reclamo.comentario || "Sin comentarios"}</p>
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
                    </>
                  )}
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
