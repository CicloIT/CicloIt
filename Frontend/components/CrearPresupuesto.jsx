import { useState, useEffect, useMemo } from "react";
import { registrarPresupuesto, obtenerProductos, obtenerServicios, obtenerAccesorios, obtenerClientes } from "../services/api";
import { useNavigate } from "react-router-dom";

function CrearPresupuesto() {
  const [nombreCliente, setNombreCliente] = useState('');
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [total, setTotal] = useState(0);
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [accesorios, setAccesorios] = useState([]);

  const [selectedProductos, setSelectedProductos] = useState([]);
  const [selectedServicios, setSelectedServicios] = useState([]);
  const [selectedAccesorios, setSelectedAccesorios] = useState([]);

  const [productoCantidad, setProductoCantidad] = useState({});
  const [servicioHoras, setServicioHoras] = useState({});
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
        const clientesData = await obtenerClientes();
        setClientes(clientesData);
        setProductos(productosData);
        setServicios(serviciosData);
        setAccesorios(accesoriosData);        
      } catch (err) {
        setError("Error al cargar los datos");
        console.error(err);
      }
    };
    fetchData();
  }, []);
  
  const calcularTotal = useMemo(() => {
    let totalTemp = 0;

    selectedProductos.forEach(producto => {
      totalTemp += (producto.precio || 0) * (productoCantidad[producto.id] || 1);
    });

    selectedServicios.forEach(serv => {
      totalTemp += (serv.precio_por_hora || 0) * (servicioHoras[serv.id] || 1);
    });

    selectedAccesorios.forEach(accesorio => {
      totalTemp += (accesorio.precio || 0) * (accesorioCantidad[accesorio.id] || 1);
    });

    return totalTemp;
  }, [selectedProductos, selectedServicios, selectedAccesorios, productoCantidad, servicioHoras, accesorioCantidad]);

  useEffect(() => {
    setTotal(calcularTotal);
  }, [calcularTotal]);

  // Función de búsqueda mejorada
  const handleSearch = (e) => {
    const query = e.target.value;
    setNombreCliente(query);
    
    // Si es solo un espacio o empieza con espacio, mostrar todos los clientes
    if (query === ' ' || (query.startsWith(' ') && query.trim() === '')) {
      setClientesFiltrados(clientes);
      setMostrarSugerencias(true);
    } else if (query.trim() === '') {
      // Si está vacío (y no es solo un espacio), no mostrar nada
      setClientesFiltrados([]);
      setMostrarSugerencias(false);
    } else {
      // Filtrar según lo que escribió el usuario
      const filtrados = clientes.filter(cliente => 
        cliente.empresa.toLowerCase().includes(query.toLowerCase())
      );
      setClientesFiltrados(filtrados);
      setMostrarSugerencias(true);
    }
  };

  // Función para seleccionar un cliente de la lista
  const seleccionarCliente = (nombreEmpresa) => {
    setNombreCliente(nombreEmpresa);
    setMostrarSugerencias(false);
  };

  // Función para cerrar las sugerencias cuando se hace clic fuera del campo
  const cerrarSugerencias = () => {
    // Pequeño retraso para permitir la selección de un cliente
    setTimeout(() => {
      setMostrarSugerencias(false);
    }, 200);
  };

  const handleAddProducto = (e) => {
    const productoId = parseInt(e.target.value);
    if (!productoId) return;

    const producto = productos.find(p => p.id === productoId);
    if (producto && !selectedProductos.some(p => p.id === productoId)) {
      setSelectedProductos(prev => [...prev, producto]);
      setProductoCantidad(prev => ({ ...prev, [productoId]: 1 }));
    }
    e.target.value = "";
  };

  const handleAddServicio = (e) => {
    const servicioId = parseInt(e.target.value);
    if (!servicioId) return;

    const servicio = servicios.find(s => s.id === servicioId);
    if (servicio && !selectedServicios.some(s => s.id === servicioId)) {
      setSelectedServicios(prev => [...prev, servicio]);
      setServicioHoras(prev => ({ ...prev, [servicioId]: 1 }));
    }
    e.target.value = "";
  };

  const handleAddAccesorio = (e) => {
    const accesorioId = parseInt(e.target.value);
    if (!accesorioId) return;

    const accesorio = accesorios.find(a => a.id === accesorioId);
    if (accesorio && !selectedAccesorios.some(a => a.id === accesorioId)) {
      setSelectedAccesorios(prev => [...prev, accesorio]);
      setAccesorioCantidad(prev => ({ ...prev, [accesorioId]: 1 }));
    }
    e.target.value = "";
  };

  const handleRemoveProducto = (id) => {
    setSelectedProductos(prev => prev.filter(item => item.id !== id));
    setProductoCantidad(prev => {
      const newCantidad = { ...prev };
      delete newCantidad[id];
      return newCantidad;
    });
  };

  const handleRemoveServicio = (id) => {
    setSelectedServicios(prev => prev.filter(item => item.id !== id));
    setServicioHoras(prev => {
      const newHoras = { ...prev };
      delete newHoras[id];
      return newHoras;
    });
  };

  const handleRemoveAccesorio = (id) => {
    setSelectedAccesorios(prev => prev.filter(item => item.id !== id));
    setAccesorioCantidad(prev => {
      const newCantidad = { ...prev };
      delete newCantidad[id];
      return newCantidad;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      accesorios: accesoriosConCantidad,
    };
    console.log("data",data)
    try {
      await registrarPresupuesto(data);
      navigate('/');
    } catch (err) {
      setError("Error al crear el presupuesto");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
      <h2 className="text-4xl font-bold text-center text-blue-700 mb-8">Crear Nuevo Presupuesto</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente:</label>
            <input
              type="text"
              value={nombreCliente}
              onChange={handleSearch}
              onFocus={() => {
                // Si ya hay un espacio, mostrar las sugerencias
                if (nombreCliente === ' ') {
                  setClientesFiltrados(clientes);
                  setMostrarSugerencias(true);
                } else if (nombreCliente.trim() !== '') {
                  setMostrarSugerencias(true);
                }
              }}
              onBlur={cerrarSugerencias}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              placeholder="Presiona espacio para ver todos los clientes o escribe para filtrar"
            />
            {mostrarSugerencias && clientesFiltrados.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
                {clientesFiltrados.map(cliente => (
                  <div
                    key={cliente.id}
                    className="cursor-pointer p-2 hover:bg-blue-50 transition-colors"
                    onClick={() => seleccionarCliente(cliente.empresa)}
                  >
                    {cliente.empresa}
                  </div>
                ))}
              </div>
            )}
            {mostrarSugerencias && clientesFiltrados.length === 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg p-2 border border-gray-200">
                <p className="text-gray-500 text-center">No se encontraron clientes</p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción:</label>
            <textarea
              rows="3"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              placeholder="Breve descripción del presupuesto"
            ></textarea>
          </div>
        </div>

        {/* Productos */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Productos</h3>
          <select
            onChange={handleAddProducto}
            value=""
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="">-- Seleccionar Producto --</option>
            {productos.map(producto => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre} - ${producto.precio.toFixed(2)}
              </option>
            ))}
          </select>

          {selectedProductos.length > 0 && (
            <div className="mt-6 bg-white p-5 rounded-md border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-700 mb-4">Productos seleccionados:</h4>
              {selectedProductos.map(prod => (
                <div key={prod.id} className="flex items-center justify-between mb-4">
                  <div className="text-gray-800">{prod.nombre}</div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="1"
                      value={productoCantidad[prod.id] || 1}
                      onChange={(e) => setProductoCantidad({ ...productoCantidad, [prod.id]: e.target.value })}
                      className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveProducto(prod.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Servicios */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Servicios</h3>
          <select
            onChange={handleAddServicio}
            value=""
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="">-- Seleccionar Servicio --</option>
            {servicios.map(serv => (
              <option key={serv.id} value={serv.id}>
                {serv.nombre} - ${serv.precio_por_hora.toFixed(2)} / hora
              </option>
            ))}
          </select>

          {selectedServicios.length > 0 && (
            <div className="mt-6 bg-white p-5 rounded-md border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-700 mb-4">Servicios seleccionados:</h4>
              {selectedServicios.map(serv => (
                <div key={serv.id} className="flex items-center justify-between mb-4">
                  <div className="text-gray-800">{serv.nombre}</div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="1"
                      value={servicioHoras[serv.id] || 1}
                      onChange={(e) => setServicioHoras({ ...servicioHoras, [serv.id]: e.target.value })}
                      className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveServicio(serv.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Accesorios */}
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Accesorios</h3>
          <select
            onChange={handleAddAccesorio}
            value=""
            className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          >
            <option value="">-- Seleccionar Accesorio --</option>
            {accesorios.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.nombre} - ${acc.precio.toFixed(2)}
              </option>
            ))}
          </select>

          {selectedAccesorios.length > 0 && (
            <div className="mt-6 bg-white p-5 rounded-md border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-700 mb-4">Accesorios seleccionados:</h4>
              {selectedAccesorios.map(acc => (
                <div key={acc.id} className="flex items-center justify-between mb-4">
                  <div className="text-gray-800">{acc.nombre}</div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="1"
                      value={accesorioCantidad[acc.id] || 1}
                      onChange={(e) => setAccesorioCantidad({ ...accesorioCantidad, [acc.id]: e.target.value })}
                      className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAccesorio(acc.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Total */}
        <div className="flex justify-between items-center mt-8">
          <span className="font-medium text-xl text-gray-800">Total:</span>
          <span className="text-2xl font-bold text-green-700">${total.toFixed(2)}</span>
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Presupuesto"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearPresupuesto;