// components/SeleccionarModulo.jsx
import { useNavigate } from "react-router-dom";

export default function SeleccionarModulo() {
  const navigate = useNavigate();

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Selecciona un módulo</h2>
      <div className="flex justify-center gap-6">
        <button
          onClick={() => navigate("/ordenes")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ir a Órdenes
        </button>
        <button
          onClick={() => navigate("/stock")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Ir a Stock
        </button>
      </div>
    </div>
  );
}
