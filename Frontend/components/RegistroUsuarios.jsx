import { useState} from "react";
import { registroUsuario } from "../services/api";

function RegistroUsuarios() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("cliente");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await registroUsuario({
        nombre,
        apellido,
        password,
        rol,
      });
      if (!response) {
        throw new Error("Error al registrar el usuario");
      }
      setMessage("Usuario registrado exitosamente");
      setNombre("");
      setApellido("");
      setPassword("");
      setRol("cliente");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage("Error al registrar el usuario");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Registro de Usuario
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            />
          </div>
          <div>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            >
              <option value="tecnico">Técnico</option>
              <option value="admin">Admin</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>

          <button
            type="submit"
            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
              loading 
                ? "bg-indigo-400 cursor-wait" 
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition duration-300 ease-in-out hover:scale-105"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Registrar Usuario"
            )}
          </button>
          {message && (
            <div className={`rounded-lg p-3 text-center text-sm font-medium ${
              message.includes("exitosamente") 
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegistroUsuarios;
