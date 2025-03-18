import { useState, useEffect } from 'react';
import { obtenerPresupuestos, generarOT, obtenerUsuarios } from '../services/api'; // Agregamos obtenerUsuarios
import { useNavigate } from 'react-router-dom';

function ListaPresupuestos() {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingOT, setLoadingOT] = useState(null);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [importanciaSeleccionada, setImportanciaSeleccionada] = useState('baja'); // Estado para la importancia
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPresupuestos = async () => {
      try {
        setLoading(true);
        const datos = await obtenerPresupuestos();
        
        if (Array.isArray(datos) && datos.length > 0) {
          setPresupuestos(datos);
          setError(null);
        } else {
          setPresupuestos([]);
        }
      } catch (err) {
        console.error('Error al cargar presupuestos:', err);
        setError('No se pudieron cargar los presupuestos');
      } finally {
        setLoading(false);
      }
    };

    const cargarUsuarios = async () => {
      try {
        const datosUsuarios = await obtenerUsuarios();
        setUsuarios(datosUsuarios);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
      }
    };

    cargarPresupuestos();
    cargarUsuarios();
  }, []);

  const handleVerDetalle = (id) => {
    navigate(`/ver-presupuesto-detalles/${id}`);
  };

  const handleGenerarOT = async (idPresupuesto) => {
    setLoadingOT(idPresupuesto); // Indica que este presupuesto está en proceso
    try {
      if (!usuarioSeleccionado) {
        alert('Por favor seleccione un usuario');
        return;
      }      
      await generarOT(idPresupuesto, usuarioSeleccionado, importanciaSeleccionada);
      setShowModal(false); // Cerrar el modal después de generar la OT
    } catch (error) {
      alert('Error al generar la OT: ' + error.message);
    } finally {
      setLoadingOT(null); // Restablece el estado
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Cargando presupuestos...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Listado de Presupuestos</h2>
      
      {presupuestos.length === 0 ? (
        <div className="text-center text-gray-500">{'No hay presupuestos registrados'}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nombre Cliente</th>
                <th className="p-3 text-left">Descripción</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {presupuestos.map((presupuesto) => (
                <tr 
                  key={presupuesto.id} 
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">{presupuesto.id}</td>
                  <td className="p-3">{presupuesto.nombre_cliente}</td>
                  <td className="p-3">{presupuesto.descripcion}</td>
                  <td className="p-3 text-right">
                    {presupuesto.dolares ? (
                      `US$${presupuesto.dolares.toFixed(4)}`
                    ):(
                    `$${presupuesto.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    )}                  
                  </td>                                   
                  <td className="p-3 text-center space-x-2 flex flex-wrap justify-center gap-2">
  <button
    onClick={() => handleVerDetalle(presupuesto.id)}
    className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors text-sm md:text-base w-full sm:w-auto"
  >
    Ver Detalle
  </button>

  <button
    onClick={() => setShowModal(true)} // Muestra el modal
    className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors text-sm md:text-base w-full sm:w-auto"
    disabled={loadingOT === presupuesto.id}
  >
    {loadingOT === presupuesto.id ? 'Generando...' : 'Generar OT'}
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para seleccionar usuario e importancia */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Seleccionar Usuario e Importancia</h3>

            <div className="mb-4">
              <label htmlFor="usuario" className="block mb-2 text-sm font-medium">Seleccionar Usuario</label>
              <select
                id="usuario"
                value={usuarioSeleccionado}
                onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                className="w-full p-3 border rounded-md text-sm"
              >
                <option value="">Seleccionar...</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>{usuario.nombre}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="importancia" className="block mb-2 text-sm font-medium">Seleccionar Importancia</label>
              <select
                id="importancia"
                value={importanciaSeleccionada}
                onChange={(e) => setImportanciaSeleccionada(e.target.value)}
                className="w-full p-3 border rounded-md text-sm"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleGenerarOT(presupuestos[0].id)} // Asegúrate de pasar el ID correcto
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListaPresupuestos;
