import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerPresupuestoId } from '../services/api';
import './detalles.css';

function DetallePresupuesto() {
  const { id } = useParams();
  const [presupuesto, setPresupuesto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresupuesto = async () => {
      try {
        const data = await obtenerPresupuestoId(id);        
        setPresupuesto(data)        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles del presupuesto');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPresupuesto();
  }, [id]);

  // Función para formatear precios
  const formatCurrency = (amount) => {
    return amount ? `$${parseFloat(amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : '$0.00';
  };

  // Función para imprimir
  const handlePrint = () => {
    window.print();
  };
  const cotizacion = presupuesto?.dolares > 0 ? presupuesto.total / presupuesto.dolares : 1;
  if (loading) return <p className="text-center text-lg text-gray-600">Cargando detalles...</p>;
  if (error) return <p className="text-cesnter text-red-600">{error}</p>;
  if (!presupuesto) return <p className="text-center text-lg text-gray-600">Presupuesto no encontrado.</p>;
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg relative">
      <h2 className="text-4xl font-semibold text-center mb-8 text-blue-600">Detalles del Presupuestos</h2>

      {/* Título Ciclo IT en esquina */}
      <div className="absolute top-4 lefts-4 text-lg font-bold text-gray-600">Ciclo IT</div>
      <div className="">CUIT: 27-42787410-4</div>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <p className="text-xl font-medium">Cliente: <span className="font-bold">{presupuesto.nombre_cliente}</span></p>
        <p className="text-xl font-medium">Cuit: <span className="font-bold">{presupuesto.cuit}</span></p>
        <p className="text-xl font-medium">Tipo IVA: <span className="font-bold">{presupuesto.tipo_iva}</span></p>
        <p className='text-xl font-medium'>Presupuesto Num: <span className='font-bold'>{presupuesto.id}</span></p>
        <p className="text-xl font-medium">Fecha: <span className="font-bold">{new Date(presupuesto.fecha).toLocaleDateString()}</span></p>
      </div>

      {/* Sección de Productos */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-2xl font-semibold text-blue-600 mb-4">Productos</h3>
        {presupuesto.productos ? (
          presupuesto.productos.split(', ').map((producto, index) => {
            const [nombre, detalles] = producto.split(' (');
            const cantidadYPrecio = detalles.replace(')', '').split(' x $');
            const cantidad = cantidadYPrecio[0] || 1;
            const precio = cantidadYPrecio[1] || 0;
            const precioUnitarioDolares = cotizacion > 0 ? precio / cotizacion : precio;               
            const subtotalDolares = cotizacion > 0 ? (precio * cantidad) / cotizacion : precio * cantidad;
            
            return (
              <div key={index} className="border-b border-gray-200 py-4">
                <p className="text-lg font-semibold text-gray-800">{nombre} - Cantidad: {cantidad}</p>
                {presupuesto.dolares > 0 ? (
                  <>
                    <p className="text-sm text-gray-600">Precio unitario: {`US$${(precioUnitarioDolares.toFixed(2))}`}</p>
                    <p className="text-sm text-gray-600">Subtotal: {`US$ ${(subtotalDolares).toFixed(2)}`}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">Precio unitario: {formatCurrency(precio)}</p>
                    <p className="text-sm text-gray-600">Subtotal: {formatCurrency(parseFloat(precio) * cantidad)}</p>
                  </>
                )}                  
              </div>
            );
          })
        ) : (
          <p>No hay productos en este presupuesto</p>
        )}
      </div>

      {/* Sección de Servicios */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-2xl font-semibold text-blue-600 mb-4">Servicios</h3>
        {presupuesto.servicios ? (
          presupuesto.servicios.split(', ').map((servicio, index) => {
            const [nombre, detalles] = servicio.split(' (');
            const [horas, precioPorHora] = detalles.replace(')', '').split(' horas a $');
            const precioPorHoraNumerico = parseFloat(precioPorHora.replace(/[^0-9.-]+/g, ''));           
            const precioUnitarioDolaresSer = cotizacion > 0 ? precioPorHoraNumerico / cotizacion : precioPorHoraNumerico;                       
            const subtotalDolaresSer = cotizacion > 0 ? (precioPorHoraNumerico * horas) / cotizacion : precioPorHoraNumerico * horas;
            return (
              <div key={index} className="border-b border-gray-200 py-4">
                <p className="text-lg font-semibold text-gray-800">{nombre} - Horas: {horas}</p>     
                  
                {presupuesto.dolares > 0 ? (
                  <>
                    <p className="text-sm text-gray-600">Precio unitario: {`US$ ${(precioUnitarioDolaresSer.toFixed(2))}`}</p>
                    <p className="text-sm text-gray-600">Subtotal: {`US$ ${(subtotalDolaresSer.toFixed(2))}`}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">Precio unitario: {formatCurrency(precioPorHora)}</p>
                    <p className="text-sm text-gray-600">Subtotal: {formatCurrency(parseFloat(precioPorHora) * horas)}</p>
                  </>
                )}                                 
              </div>
            );
          })
        ) : (
          <p>No hay servicios en este presupuesto</p>
        )}
      </div>

      {/* Sección de Accesorios */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-2xl font-semibold text-blue-600 mb-4">Accesorios</h3>
        {presupuesto.accesorios ? (
          presupuesto.accesorios.split(', ').map((accesorio, index) => {
            const [nombre, detalles] = accesorio.split(' (');
            const cantidadYPrecio = detalles.replace(')', '').split(' x $');
            const cantidad = cantidadYPrecio[0] || 1;
            const precio = cantidadYPrecio[1] || 0;
            const precioUnitarioDolaresA = cotizacion > 0 ? precio / cotizacion : precio;
            const subtotalDolaresA = cotizacion > 0 ? (precio * cantidad) / cotizacion : precio * cantidad;
            return (
              <div key={index} className="border-b border-gray-200 py-4">
                <p className="text-lg font-semibold text-gray-800">{nombre} - Cantidad: {cantidad}</p>
                {presupuesto.dolares > 0 ? (
                  <>
                    <p className="text-sm text-gray-600">Precio unitario: {`US$${(precioUnitarioDolaresA.toFixed(2))}`}</p>
                    <p className="text-sm text-gray-600">Subtotal: {`US$ ${(subtotalDolaresA.toFixed(2))}`}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">Precio unitario: {formatCurrency(precio)}</p>
                    <p className="text-sm text-gray-600">Subtotal: {formatCurrency(parseFloat(precio) * cantidad)}</p>
                  </>
                )}                 
              </div>
            );
          })
        ) : (
          <p>No hay accesorios en este presupuesto</p>
        )}
      </div>
      <p className="text-xl font-medium">Total:
        <span className="font-bold text-green-600">
          {presupuesto.dolares
            ? ` US$${presupuesto.dolares.toFixed(2)}` // Si existe "presupuesto.dolares", mostrarlo
            : formatCurrency(presupuesto.total) // Si no, mostrar "presupuesto.total"
          }
        </span>
      </p>
      <div className="text-center">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300 button-volver"
        >
          Volver
        </button>

        <button
          onClick={handlePrint}
          className="ml-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition duration-300 button-imprimir"
        >
          Imprimir
        </button>
      </div>

      {/* Condiciones comerciales solo visibles en la impresión */}
      <div className="condiciones-imprimir">
        <h3 className="text-lg font-bold text-gray-600 text-center mt-8">Condiciones Comerciales</h3>
        <ul id='lista' className="lista text-sm text-gray-500">
          <li><strong>FORMA DE PAGO:</strong> Entrega del 100% de los materiales al confirmar presupuesto y el resto al finalizar el trabajo.</li>
          <li><strong>Cotización:</strong> Dólar Banco Nación.</li>
          <li><strong>TIEMPO DE INSTALACIÓN:</strong> Dentro de los 25 días de confirmar el presupuesto.</li>
          <li><strong>OBSERVACIONES:</strong> Presupuesto sujeto a cambios a partir de los 3 días de la fecha del mismo.</li>
          <li>Los precios son de contado, por transferencia o depósito bancario; en caso de cheque, se sumará un porcentaje correspondiente a la fecha de cobro.</li>
        </ul>
      </div>
    </div>
  );
}

export default DetallePresupuesto;
