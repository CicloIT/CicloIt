import { useState, useEffect } from 'react';
import { registrarReclamo, obtenerUsuarios, obtenerOrdenesTrabajo } from "../services/api"; 
function FormularioReclamos() {
  const [usuarioId, setUsuarioId] = useState('');
  const [ordenTrabajoId, setOrdenTrabajoId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [importancia, setImportancia] = useState('');
  const [estado, setEstado] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [ordenesTrabajo, setOrdenesTrabajo] = useState([]);
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');  
  useEffect(() => {    
    const obtenerDatos = async () => {
      try {
        // Obtener usuarios y órdenes de trabajo desde la API
        const usuariosResponse = await obtenerUsuarios();
        const ordenesResponse = await obtenerOrdenesTrabajo();

        setUsuarios(usuariosResponse);
        setOrdenesTrabajo(ordenesResponse);
      } catch (error) {
        console.error("Error al obtener los datos", error);
        setMensajeError("Error al obtener los datos");
      }
    };

    obtenerDatos();
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    // Validación básica
    if (!usuarioId || !ordenTrabajoId || !titulo || !descripcion || !importancia || !estado) {
      setMensajeError('Todos los campos son obligatorios');
      return;
    }

    try {
      const data = {
        usuario_id: usuarioId,
        ordenTrabajo_id: ordenTrabajoId,
        titulo: titulo,
        descripcion: descripcion,
        importancia: importancia,
        estado: estado,
      };
      const response = await registrarReclamo(data);
      console.log(response);
      if (response.id) {
        setMensajeExito('Reclamo creado exitosamente');
      } else {
        setMensajeError('Error al crear el reclamo');
      }
      setTimeout(() => {
        setMensajeExito('');
        setMensajeError('');
      }, 2000);
      // Limpiar los campos del formulario
      setDescripcion('');
      setEstado('');
      setImportancia('');
      setTitulo('');
      setUsuarioId('');
      setOrdenTrabajoId('');
    } catch (error) {
      setMensajeError('Error al crear el reclamo');
      console.error(error);
      setTimeout(() => {
        setMensajeError('');
      }, 2000);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-5 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Formulario de Reclamo</h2>
      <form onSubmit={manejarEnvio}>
        <div className="mb-4">
          <label htmlFor="usuarioId" className="block text-sm font-medium text-gray-700">ID Usuario:</label>
          <select
            id="usuarioId"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          >
            <option value="">Seleccionar Usuario</option>
            {usuarios.map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre} {usuario.apellido}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="ordenTrabajoId" className="block text-sm font-medium text-gray-700">ID Orden de Trabajo:</label>
          <select
            id="ordenTrabajoId"
            value={ordenTrabajoId}
            onChange={(e) => setOrdenTrabajoId(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          >
            <option value="">Seleccionar Orden de Trabajo</option>
            {ordenesTrabajo.map(orden => (
              <option key={orden.id} value={orden.id}>
                {orden.id} - {orden.empresa} - {orden.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción:</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="importancia" className="block text-sm font-medium text-gray-700">Importancia:</label>
          <select
            id="importancia"
            value={importancia}
            onChange={(e) => setImportancia(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          >
            <option value="">Seleccionar importancia</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado:</label>
          <select
            id="estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          >
            <option value="">Seleccionar estado</option>
            <option value="abierto">Abierto</option>
            <option value="en proceso">En proceso</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>

        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Registrar Reclamo
        </button>
      </form>

      {mensajeError && <p className="mt-4 text-red-500">{mensajeError}</p>}
      {mensajeExito && <p className="mt-4 text-green-500">{mensajeExito}</p>}
    </div>
  );
}

export default FormularioReclamos;
