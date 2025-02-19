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
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {    
    const obtenerDatos = async () => {
      try {
        const usuariosResponse = await obtenerUsuarios();
        const ordenesResponse = await obtenerOrdenesTrabajo();

        setUsuarios(usuariosResponse);
        setOrdenesTrabajo(ordenesResponse);
      } catch (error) {
        console.error("Error al obtener los datos", error);
        setMessage("Error al obtener los datos");
        setTimeout(() => {
          setMessage('');
        }, 2000);
      }
    };

    obtenerDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!usuarioId || !ordenTrabajoId || !titulo || !descripcion || !importancia || !estado) {
      setMessage('Todos los campos son obligatorios');
      setLoading(false);
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
      if (response.id) {
        setMessage('Reclamo creado exitosamente');
        setDescripcion('');
        setEstado('');
        setImportancia('');
        setTitulo('');
        setUsuarioId('');
        setOrdenTrabajoId('');
      } else {
        setMessage('Error al crear el reclamo');
      }
      setTimeout(() => {
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage('Error al crear el reclamo');
      setTimeout(() => {
        setMessage('');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Formulario de Reclamo</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <select
              id="usuarioId"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            >
              <option value="">Seleccionar Usuario</option>
              {usuarios.map(usuario => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre} {usuario.apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              id="ordenTrabajoId"
              value={ordenTrabajoId}
              onChange={(e) => setOrdenTrabajoId(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            >
              <option value="">Seleccionar Orden de Trabajo</option>
              {ordenesTrabajo.map(orden => (
                <option key={orden.id} value={orden.id}>
                  {orden.id} - {orden.empresa} - {orden.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              id="titulo"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            />
          </div>

          <div>
            <textarea
              id="descripcion"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            />
          </div>

          <div>
            <select
              id="importancia"
              value={importancia}
              onChange={(e) => setImportancia(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            >
              <option value="">Seleccionar importancia</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div>
            <select
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            >
              <option value="">Seleccionar estado</option>
              <option value="abierto">Abierto</option>
              <option value="en proceso">En proceso</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>

          <button
            type="submit"
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
              loading 
                ? "bg-indigo-400 cursor-wait" 
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition duration-300 ease-in-out hover:scale-105"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Registrar Reclamo"
            )}
          </button>
          {message && <p className="text-center mt-2 text-green-500">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default FormularioReclamos;
