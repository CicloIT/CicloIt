import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerPresupuestoId } from "../services/api";
import "./detalles.css";

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
        console.log("Datos del presupuesto:", data);

        if (data.length > 0) {
          setPresupuesto(data[0]);
        }
        setLoading(false);
      } catch (err) {
        setError("Error al cargar los detalles del presupuesto");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPresupuesto();
  }, [id]);

  const formatCurrency = (amount) => {
    return amount
      ? `$${parseFloat(amount).toLocaleString("es-AR", {
          minimumFractionDigits: 2,
        })}`
      : "$0.00";
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <p className="text-center text-lg text-gray-600">Cargando detalles...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!presupuesto) return <p className="text-center text-lg text-gray-600">Presupuesto no encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg relative">
      <h2 className="text-4xl font-semibold text-center mb-8 text-blue-600">Detalles del Presupuesto</h2>

      <div className="absolute top-4 left-4 text-lg font-bold text-gray-600">Ciclo IT</div>
      <div className="">CUIT: 27-42787410-4</div>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <p className="text-xl font-medium">
          Cliente: <span className="font-bold">{presupuesto.nombre_cliente}</span>
        </p>
        <p className="text-xl font-medium">
          Cuit: <span className="font-bold">{presupuesto.cuil || "No disponible"}</span>
        </p>
        <p className="text-xl font-medium">
          Presupuesto Num: <span className="font-bold">{presupuesto.id}</span>
        </p>
        <p className="text-xl font-medium">
          Fecha:{" "}
          <span className="font-bold">
            {presupuesto.fecha ? new Date(presupuesto.fecha).toLocaleDateString() : "Fecha no disponible"}
          </span>
        </p>
      </div>

      {/* Sección de Productos */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-2xl font-semibold text-blue-600 mb-4">Productos</h3>
        {presupuesto.productos ? (
          presupuesto.productos.split(", ").map((producto, index) => {
            const match = producto.match(/(.*) \((\d+) x \$([\d.]+)\)/);
            if (!match) return null;
            const [, nombre, cantidad, precio] = match;

            return (
              <div key={index} className="border-b border-gray-200 py-4">
                <p className="text-lg font-semibold text-gray-800">
                  {nombre} - Cantidad: {cantidad}
                </p>
                <p className="text-sm text-gray-600">Precio unitario: {formatCurrency(precio)}</p>
                <p className="text-sm text-gray-600">
                  Subtotal: {formatCurrency(parseFloat(precio) * cantidad)}
                </p>
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
          presupuesto.servicios.split(", ").map((servicio, index) => {
            const match = servicio.match(/(.*) \((\d+) horas a \$([\d.]+)\/hora\)/);
            if (!match) return null;
            const [, nombre, horas, precioPorHora] = match;

            return (
              <div key={index} className="border-b border-gray-200 py-4">
                <p className="text-lg font-semibold text-gray-800">
                  {nombre} - Horas: {horas}
                </p>
                <p className="text-sm text-gray-600">Precio por hora: {formatCurrency(precioPorHora)}</p>
                <p className="text-sm text-gray-600">
                  Subtotal: {formatCurrency(parseFloat(precioPorHora) * horas)}
                </p>
              </div>
            );
          })
        ) : (
          <p>No hay servicios en este presupuesto</p>
        )}
      </div>

      <p className="text-xl font-medium">
        Total: <span className="font-bold text-green-600">{formatCurrency(presupuesto.total)}</span>
      </p>

      <div className="text-center">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
        >
          Volver
        </button>

        <button
          onClick={handlePrint}
          className="ml-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition duration-300"
        >
          Imprimir
        </button>
      </div>

      {/* Condiciones comerciales solo visibles en la impresión */}
      <div className="condiciones-imprimir">
        <h3 className="text-lg font-bold text-gray-600 text-center mt-8">Condiciones Comerciales</h3>
        <ul className="lista text-sm text-gray-500">
          <li>
            <strong>FORMA DE PAGO:</strong> Entrega del 100% de los materiales al confirmar presupuesto y el resto al finalizar el trabajo.
          </li>
          <li>
            <strong>Cotización:</strong> Dólar Banco Nación.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DetallePresupuesto;
