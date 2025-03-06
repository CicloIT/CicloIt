import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerPresupuestoId } from '../services/api';

function DetallePresupuesto() {
  const { id } = useParams();
  const [presupuesto, setPresupuesto] = useState(null);
  const [productosArray, setProductosArray] = useState([]);
  const [serviciosArray, setServiciosArray] = useState([]);
  const [accesoriosArray, setAccesoriosArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresupuesto = async () => {
      try {
        const data = await obtenerPresupuestoId(id);
        console.log('Datos del presupuesto:', data);
        
        if (data.length > 0) {
          const presupuestoData = data[0];
          setPresupuesto(presupuestoData);
          
          // Convertir los datos a arrays correctamente
          setProductosArray(parseItems(presupuestoData.productos));
          setServiciosArray(parseItems(presupuestoData.servicios));
          setAccesoriosArray(parseItems(presupuestoData.accesorios));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles del presupuesto');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchPresupuesto();
  }, [id]);

  // Función para convertir strings en arrays de objetos
  const parseItems = (data) => {
    if (!data) return [];
    if (typeof data === 'string') {
      try {
        // Verificar si el string es JSON válido
        const parsedData = JSON.parse(data);
        return Array.isArray(parsedData) ? parsedData : [];
      } catch (error) {
        console.error('Error al parsear JSON:', error);
        console.log('Datos que causaron el error:', data);  // Ver los datos
        return [];  // Si no es JSON, devolver un array vacío
      }
    }
    return Array.isArray(data) ? data : [];
  };

  // Función para formatear precios
  const formatCurrency = (amount) => {
    return amount ? `$${parseFloat(amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : '$0.00';
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (error) return <p>{error}</p>;
  if (!presupuesto) return <p>Presupuesto no encontrado.</p>;

  return (
    <div>
      <h2>Detalles del Presupuesto</h2>
      <p>Cliente: {presupuesto.nombre_cliente}</p>
      <p>Fecha: {new Date(presupuesto.fecha).toLocaleDateString()}</p>
      <p>Total: {formatCurrency(presupuesto.total)}</p>

      <h3>Productos</h3>
      {productosArray.length > 0 ? (
        productosArray.map((producto, index) => (
          <div key={index}>
            <p>{producto.nombre} - Cantidad: {producto.cantidad || 1}</p>
            <p>Precio unitario: {formatCurrency(producto.precio)}</p>
            <p>Subtotal: {formatCurrency((producto.precio || 0) * (producto.cantidad || 1))}</p>
          </div>
        ))
      ) : (
        <p>No hay productos en este presupuesto</p>
      )}

      <h3>Servicios</h3>
      {serviciosArray.length > 0 ? (
        serviciosArray.map((servicio, index) => (
          <div key={index}>
            <p>{servicio.nombre} - Horas: {servicio.horas || 1}</p>
            <p>Precio por hora: {formatCurrency(servicio.precio_por_hora)}</p>
            <p>Subtotal: {formatCurrency((servicio.precio_por_hora || 0) * (servicio.horas || 1))}</p>
          </div>
        ))
      ) : (
        <p>No hay servicios en este presupuesto</p>
      )}

      <h3>Accesorios</h3>
      {accesoriosArray.length > 0 ? (
        accesoriosArray.map((accesorio, index) => (
          <div key={index}>
            <p>{accesorio.nombre} - Cantidad: {accesorio.cantidad || 1}</p>
            <p>Precio unitario: {formatCurrency(accesorio.precio)}</p>
            <p>Subtotal: {formatCurrency((accesorio.precio || 0) * (accesorio.cantidad || 1))}</p>
          </div>
        ))
      ) : (
        <p>No hay accesorios en este presupuesto</p>
      )}

      <button onClick={() => navigate('/')}>Volver</button>
    </div>
  );
}

export default DetallePresupuesto;
