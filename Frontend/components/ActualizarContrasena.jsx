import { useState } from "react";
import { cambiarContra } from "../services/api";
function ActualizarContrasena() {
  const [id, setId] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await cambiarContra(id, nuevaPassword);  
    
      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar la contraseña");
      }

      setMessage("Contraseña actualizada exitosamente");
      setId("");
      setNuevaPassword("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-center text-2xl font-bold mb-6">Actualizar Contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="ID del usuario"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Nueva Contraseña"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
          <button
            type="submit"
            className={`w-full py-3 text-white font-bold rounded-lg ${
              loading ? "bg-gray-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
}

export default ActualizarContrasena;
