import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Para obtener el parámetro de la URL
import { obtenerPresupuestoId } from '../services/api'; // Asumiendo que ya tienes la función
import { useNavigate } from 'react-router-dom';

function DetallePresupuesto() {
  const { id } = useParams(); // Obtener el ID del presupuesto desde la URL
  const [presupuesto, setPresupuesto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresupuesto = async () => {
      try {
        const data = await obtenerPresupuestoId(id); // Pasamos el id a la función para obtener el presupuesto
        setPresupuesto(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles del presupuesto');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPresupuesto();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-8">Cargando detalles...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!presupuesto) {
    return <div className="text-center mt-8">Presupuesto no encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Detalles del Presupuesto</h2>

      <div className="space-y-4">
        <div>
          <strong>Cliente:</strong> {presupuesto.nombre_cliente}
        </div>
        <div>
          <strong>Descripción:</strong> {presupuesto.descripcion}
        </div>
        <div>
          <strong>Total:</strong> ${presupuesto.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div>
          <strong>Productos:</strong>
          <ul className="ml-6">
            {presupuesto.productos && presupuesto.productos.length > 0 ? (
              presupuesto.productos.map((producto, index) => (
                <li key={index}>
                  {producto.nombre} - ${producto.precio}
                </li>
              ))
            ) : (
              <li>No hay productos.</li>
            )}
          </ul>
        </div>
        <div>
          <strong>Servicios:</strong>
          <ul className="ml-6">
            {presupuesto.servicios && presupuesto.servicios.length > 0 ? (
              presupuesto.servicios.map((servicio, index) => (
                <li key={index}>
                  {servicio.nombre} - ${servicio.precio_por_hora} /hora x {servicio.horas} horas
                </li>
              ))
            ) : (
              <li>No hay servicios.</li>
            )}
          </ul>
        </div>
        <div>
          <strong>Accesorios:</strong>
          <ul className="ml-6">
            {presupuesto.accesorios && presupuesto.accesorios.length > 0 ? (
              presupuesto.accesorios.map((accesorio, index) => (
                <li key={index}>
                  {accesorio.nombre} - ${accesorio.precio}
                </li>
              ))
            ) : (
              <li>No hay accesorios.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate('/presupuestos')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Volver al listado
        </button>
      </div>
    </div>
  );
}

export default DetallePresupuesto;
