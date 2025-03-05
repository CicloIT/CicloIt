import { useState, useEffect } from 'react';
import { obtenerPresupuestos } from '../services/api'; // Asegúrate de crear esta función en tu servicio de API
import { useNavigate } from 'react-router-dom';

function ListaPresupuestos() {
  const [presupuestos, setPresupuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarPresupuestos = async () => {
      try {
        setLoading(true);
        const datos = await obtenerPresupuestos();
        
        // Log para verificar los datos obtenidos
        console.log("Datos obtenidos de la API:", datos);
    
        // Manejar el caso en que los datos estén vacíos
        if (Array.isArray(datos)) {
          setPresupuestos(datos);
          setError(null);
        } else {
          setError('Formato de respuesta incorrecto');
        }
      } catch (err) {
        console.error('Error al cargar presupuestos:', err);
        setError('No se pudieron cargar los presupuestos o sesión expirada');
      } finally {
        setLoading(false);
      }
    };
    

    cargarPresupuestos();
  }, []);

  const handleVerDetalle = (id) => {
    navigate(`/presupuestos/${id}`);
  };

  if (loading) {
    return <div className="text-center mt-8">Cargando presupuestos...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Listado de Presupuestos</h2>
      
      {presupuestos.length === 0 ? (
        <div className="text-center text-gray-500">No hay presupuestos registrados</div>
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
                    ${presupuesto.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleVerDetalle(presupuesto.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ListaPresupuestos;
