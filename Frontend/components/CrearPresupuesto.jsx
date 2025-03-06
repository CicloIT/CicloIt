import { useState, useEffect, useMemo } from "react";
import { registrarPresupuesto, obtenerProductos, obtenerServicios, obtenerAccesorios } from "../services/api";
import { useNavigate } from "react-router-dom";

function CrearPresupuesto() {
  const [nombreCliente, setNombreCliente] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [total, setTotal] = useState(0);
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [accesorios, setAccesorios] = useState([]);
  
  // Modified to include quantity
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [selectedServicios, setSelectedServicios] = useState([]);
  const [selectedAccesorios, setSelectedAccesorios] = useState([]);
  
  const [servicioHoras, setServicioHoras] = useState({});
  const [productoCantidad, setProductoCantidad] = useState({});
  const [accesorioCantidad, setAccesorioCantidad] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosData = await obtenerProductos();
        const serviciosData = await obtenerServicios();
        const accesoriosData = await obtenerAccesorios();
        setProductos(productosData);
        setServicios(serviciosData);
        setAccesorios(accesoriosData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const calcularTotal = useMemo(() => {
    let totalTemp = 0;

    // Include quantity for products
    selectedProductos.forEach(producto => {
      const cantidad = productoCantidad[producto.id] || 1;
      totalTemp += (producto.precio || 0) * cantidad;
    });

    // Calculate service hours
    selectedServicios.forEach(serv => {
      const horas = servicioHoras[serv.id] || 1;
      totalTemp += (serv.precio_por_hora || 0) * horas;
    });

    // Include quantity for accessories
    selectedAccesorios.forEach(accesorio => {
      const cantidad = accesorioCantidad[accesorio.id] || 1;
      totalTemp += (accesorio.precio || 0) * cantidad;
    });

    return totalTemp;
  }, [selectedProductos, selectedServicios, selectedAccesorios, servicioHoras, productoCantidad, accesorioCantidad]);

  useEffect(() => {
    setTotal(Number(calcularTotal) || 0);
  }, [calcularTotal]);

  // Handlers for adding items
  const handleAddProducto = (e) => {
    const productoId = parseInt(e.target.value);
    if (!productoId) return;
    
    const producto = productos.find(p => p.id === productoId);
    
    // Check if product is already selected
    if (!selectedProductos.some(p => p.id === productoId)) {
      setSelectedProductos(prev => [...prev, producto]);
      setProductoCantidad(prev => ({
        ...prev,
        [productoId]: 1 // Default quantity
      }));
    }
    
    // Reset select value
    e.target.value = "";
  };

  const handleAddServicio = (e) => {
    const servicioId = parseInt(e.target.value);
    if (!servicioId) return;
    
    const servicio = servicios.find(s => s.id === servicioId);
    
    // Check if service is already selected
    if (!selectedServicios.some(s => s.id === servicioId)) {
      setSelectedServicios(prev => [...prev, servicio]);
      setServicioHoras(prev => ({
        ...prev,
        [servicioId]: 1 // Default hours
      }));
    }
    
    // Reset select value
    e.target.value = "";
  };

  const handleAddAccesorio = (e) => {
    const accesorioId = parseInt(e.target.value);
    if (!accesorioId) return;
    
    const accesorio = accesorios.find(a => a.id === accesorioId);
    
    // Check if accessory is already selected
    if (!selectedAccesorios.some(a => a.id === accesorioId)) {
      setSelectedAccesorios(prev => [...prev, accesorio]);
      setAccesorioCantidad(prev => ({
        ...prev,
        [accesorioId]: 1 // Default quantity
      }));
    }
    
    // Reset select value
    e.target.value = "";
  };

  // Handlers for removing items
  const handleRemoveProducto = (id) => {
    setSelectedProductos(prev => prev.filter(item => item.id !== id));
    setProductoCantidad(prev => {
      const newCantidad = {...prev};
      delete newCantidad[id];
      return newCantidad;
    });
  };

  const handleRemoveServicio = (id) => {
    setSelectedServicios(prev => prev.filter(item => item.id !== id));
    setServicioHoras(prev => {
      const newHoras = {...prev};
      delete newHoras[id];
      return newHoras;
    });
  };

  const handleRemoveAccesorio = (id) => {
    setSelectedAccesorios(prev => prev.filter(item => item.id !== id));
    setAccesorioCantidad(prev => {
      const newCantidad = {...prev};
      delete newCantidad[id];
      return newCantidad;
    });
  };

  // Handlers for quantity changes
  const handleProductoCantidadChange = (id, cantidad) => {
    setProductoCantidad(prev => ({
      ...prev,
      [id]: Math.max(1, cantidad || 1) // Evita valores menores a 1 o NaN
    }));
  };

  const handleHorasChange = (id, horas) => {
    if (isNaN(horas) || horas < 1) return;
    
    setServicioHoras(prev => ({
      ...prev,
      [id]: horas
    }));
  };

  const handleAccesorioCantidadChange = (id, cantidad) => {
    if (isNaN(cantidad) || cantidad < 1) return;
    
    setAccesorioCantidad(prev => ({
      ...prev,
      [id]: cantidad
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare items with quantities/hours
    const productosConCantidad = selectedProductos.map(prod => ({
      ...prod,
      cantidad: productoCantidad[prod.id] || 1
    }));
    
    const serviciosConHoras = selectedServicios.map(serv => ({
      ...serv,
      horas: servicioHoras[serv.id] || 1
    }));
    
    const accesoriosConCantidad = selectedAccesorios.map(acc => ({
      ...acc,
      cantidad: accesorioCantidad[acc.id] || 1
    }));

    const data = {
      nombreCliente,
      descripcion,
      total,
      productos: productosConCantidad,
      servicios: serviciosConHoras,
      accesorios: accesoriosConCantidad
    };

    console.log("Datos enviados al backend:", data);
    
    try {
      await registrarPresupuesto(data);
      navigate('/');
    } catch (err) {
      setError('Error al crear el presupuesto');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Crear Nuevo Presupuesto</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente:</label>
            <input
              type="text"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Ingrese nombre del cliente"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
            {/* Changed to textarea */}
            <textarea
              rows="3"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Breve descripción del presupuesto"
            ></textarea>
          </div>
        </div>
                        
        {/* Productos */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <label className="block text-lg font-medium text-gray-800 mb-3">Productos:</label>
          <select
            onChange={handleAddProducto}
            value=""
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Seleccionar Producto --</option>
            {productos.map(producto => (
              <option key={producto.id} value={producto.id} className="py-1">
                {producto.nombre} - ${producto.precio.toFixed(2)}
              </option>
            ))}
          </select>
          
          {selectedProductos.length > 0 && (
            <div className="mt-4 bg-white p-4 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">Productos seleccionados:</h4>
              <div className="space-y-3">
                {selectedProductos.map(prod => (
                  <div key={prod.id} className="flex items-center space-x-3 p-2 bg-blue-50 rounded-md">
                    <span className="font-medium text-gray-800 flex-grow">{prod.nombre}</span>
                    <div className="flex items-center">
                      <label className="mr-2 text-gray-700">Cantidad:</label>
                      <input
                        type="number"
                        min="1"
                        value={productoCantidad[prod.id] || 1}
                        onChange={(e) => handleProductoCantidadChange(prod.id, parseInt(e.target.value))}
                        className="w-16 p-2 border border-gray-300 rounded-md text-center"
                      />
                    </div>
                    <div className="font-medium mx-3">
                      ${((prod.precio || 0) * (productoCantidad[prod.id] || 1)).toFixed(2)}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveProducto(prod.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Servicios */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <label className="block text-lg font-medium text-gray-800 mb-3">Servicios:</label>
          <select
            onChange={handleAddServicio}
            value=""
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Seleccionar Servicio --</option>
            {servicios.map(servicio => (
              <option key={servicio.id} value={servicio.id} className="py-1">
                {servicio.nombre} - ${servicio.precio_por_hora.toFixed(2)} /hora
              </option>
            ))}
          </select>
          
          {selectedServicios.length > 0 && (
            <div className="mt-4 bg-white p-4 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">Servicios seleccionados:</h4>
              <div className="space-y-3">
                {selectedServicios.map(serv => (
                  <div key={serv.id} className="flex items-center space-x-3 p-2 bg-blue-50 rounded-md">
                    <span className="font-medium text-gray-800 flex-grow">{serv.nombre}</span>
                    <div className="flex items-center">
                      <label className="mr-2 text-gray-700">Horas:</label>
                      <input
                        type="number"
                        min="1"
                        value={servicioHoras[serv.id] || 1}
                        onChange={(e) => handleHorasChange(serv.id, parseInt(e.target.value))}
                        className="w-16 p-2 border border-gray-300 rounded-md text-center"
                      />
                    </div>
                    <div className="font-medium mx-3">
                      ${((serv.precio_por_hora || 0) * (servicioHoras[serv.id] || 1)).toFixed(2)}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveServicio(serv.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Accesorios */}
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <label className="block text-lg font-medium text-gray-800 mb-3">Accesorios:</label>
          <select
            onChange={handleAddAccesorio}
            value=""
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Seleccionar Accesorio --</option>
            {accesorios.map(accesorio => (
              <option key={accesorio.id} value={accesorio.id} className="py-1">
                {accesorio.nombre} - ${accesorio.precio.toFixed(2)}
              </option>
            ))}
          </select>
          
          {selectedAccesorios.length > 0 && (
            <div className="mt-4 bg-white p-4 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">Accesorios seleccionados:</h4>
              <div className="space-y-3">
                {selectedAccesorios.map(acc => (
                  <div key={acc.id} className="flex items-center space-x-3 p-2 bg-blue-50 rounded-md">
                    <span className="font-medium text-gray-800 flex-grow">{acc.nombre}</span>
                    <div className="flex items-center">
                      <label className="mr-2 text-gray-700">Cantidad:</label>
                      <input
                        type="number"
                        min="1"
                        value={accesorioCantidad[acc.id] || 1}
                        onChange={(e) => handleAccesorioCantidadChange(acc.id, parseInt(e.target.value))}
                        className="w-16 p-2 border border-gray-300 rounded-md text-center"
                      />
                    </div>
                    <div className="font-medium mx-3">
                      ${((acc.precio || 0) * (accesorioCantidad[acc.id] || 1)).toFixed(2)}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveAccesorio(acc.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botón de envío */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            ) : (
              'Crear Presupuesto'
            )}
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="text-xl font-bold text-blue-700 mt-4">
  Total: ${total.toFixed(2)}
</div>            
        </div>

      </form>
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-center font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

export default CrearPresupuesto;