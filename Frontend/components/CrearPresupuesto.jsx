import { useState, useEffect } from "react";
import { registrarPresupuesto, obtenerProductos, obtenerServicios, obtenerAccesorios } from "../services/api";
import { useNavigate } from "react-router-dom";

function CrearPresupuesto() {
  const [nombreCliente, setNombreCliente] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [total, setTotal] = useState('');
  const [productos, setProductos] = useState([]);
  const [servicio, setServicio] = useState([]);
  const [accesorios, setAccesorios] = useState([]);
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
        setServicio(serviciosData);
        setAccesorios(accesoriosData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = {
      nombreCliente,
      descripcion,
      total,
      productos,
      servicio,
      accesorios
    };

    try {
      const response = await registrarPresupuesto(data);
      console.log('Presupuesto creado:', response);
      navigate('/');
    } catch (err) {
      setError('Error al crear el presupuesto');
      console.error('Error al crear el presupuesto:', err);
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
          <label className="block text-sm font-medium text-gray-700">Monto:</label>
          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Productos:</label>
          <select
            multiple
            value={productos}
            onChange={(e) => setProductos([...e.target.selectedOptions].map(option => option.value))}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            {productos.map((producto) => (
              <option key={producto.id} value={producto.nombre}>
                {producto.nombre} - ${producto.precio}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Servicios:</label>
          <select
            multiple
            value={servicio}
            onChange={(e) => setServicio([...e.target.selectedOptions].map(option => option.value))}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            {servicio.map((serv) => (
              <option key={serv.id} value={serv.nombre}>
                {serv.nombre} - ${serv.precio}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Accesorios:</label>
          <select
            multiple
            value={accesorios}
            onChange={(e) => setAccesorios([...e.target.selectedOptions].map(option => option.value))}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
          >
            {accesorios.map((accesorio) => (
              <option key={accesorio.id} value={accesorio.nombre}>
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
