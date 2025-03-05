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
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [selectedServicios, setSelectedServicios] = useState([]);
  const [selectedAccesorios, setSelectedAccesorios] = useState([]);
  const [servicioHoras, setServicioHoras] = useState({});
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

    selectedProductos.forEach(producto => {
      totalTemp += producto.precio || 0;
    });

    selectedServicios.forEach(serv => {
      // Usar el objeto servicioHoras para obtener las horas
      const horas = servicioHoras[serv.id] || 1;
      totalTemp += (serv.precio_por_hora || 0) * horas;
    });

    selectedAccesorios.forEach(accesorio => {
      totalTemp += accesorio.precio || 0;
    });

    return totalTemp;
  }, [selectedProductos, selectedServicios, selectedAccesorios, servicioHoras]);

  useEffect(() => {
    setTotal(Number(calcularTotal) || 0);
  }, [calcularTotal]);

  const handleServicioChange = (e) => {
    const selectedOptions = [...e.target.selectedOptions].map(option => {
      const servicio = servicios.find(serv => serv.id === parseInt(option.value));
      return servicio;
    });
    
    // Crear un nuevo objeto de horas para los servicios seleccionados
    const nuevasHoras = {};
    selectedOptions.forEach(serv => {
      nuevasHoras[serv.id] = 1; // Valor por defecto de 1 hora
    });

    setSelectedServicios(selectedOptions);
    setServicioHoras(prevHoras => ({
      ...prevHoras,
      ...nuevasHoras
    }));
  };

  const handleHorasChange = (id, horas) => {
    if (isNaN(horas)) return;
    
    // Actualizar el objeto de horas
    setServicioHoras(prev => ({
      ...prev,
      [id]: horas
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Preparar los servicios con la información de horas
    const serviciosConHoras = selectedServicios.map(serv => ({
      ...serv,
      horas: servicioHoras[serv.id] || 1
    }));

    const data = {
      nombreCliente,
      descripcion,
      total,
      productos: selectedProductos,
      servicios: serviciosConHoras,
      accesorios: selectedAccesorios
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Crear Nuevo Presupuesto</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Cliente:</label>
          <input
            type="text"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción:</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Monto Total:</label>
          <input
            type="number"
            value={total}
            disabled
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
        
        {/* Productos */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Productos:</label>
          <select
            multiple
            onChange={(e) => setSelectedProductos([...e.target.selectedOptions].map(option => productos.find(p => p.id === parseInt(option.value))))}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            {productos.map(producto => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre} - ${producto.precio}
              </option>
            ))}
          </select>
        </div>

        {/* Servicios con selección de horas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Servicios:</label>
          <select
            multiple
            onChange={handleServicioChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            {servicios.map(servicio => (
              <option key={servicio.id} value={servicio.id}>
                {servicio.nombre} - ${servicio.precio_por_hora} /hora
              </option>
            ))}
          </select>
          {selectedServicios.map(serv => (
            <div key={serv.id} className="flex items-center mt-2 space-x-2">
              <span>{serv.nombre}:</span>
              <input
                type="number"
                min="1"
                value={serv.horas}
                onChange={(e) => handleHorasChange(serv.id, parseInt(e.target.value))}
                className="w-16 p-1 border border-gray-300 rounded-md"
              />
              <span>horas</span>
            </div>
          ))}
        </div>

        {/* Accesorios */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Accesorios:</label>
          <select
            multiple
            onChange={(e) => setSelectedAccesorios([...e.target.selectedOptions].map(option => accesorios.find(a => a.id === parseInt(option.value))))}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            {accesorios.map(accesorio => (
              <option key={accesorio.id} value={accesorio.id}>
                {accesorio.nombre} - ${accesorio.precio}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Cargando...' : 'Crear Presupuesto'}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}

export default CrearPresupuesto;
