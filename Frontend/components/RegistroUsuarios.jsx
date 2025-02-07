import { useState} from "react";
import { registroUsuario } from "../services/api";

function RegistroUsuarios() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("tecnico");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Estado para el loader
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar el loader
    setMessage(""); // Limpiar el mensaje anterior

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
      setRol("tecnico");
      setTimeout(() => {
        setMessage("");
      }, 2000); // 2000 ms = 2 segundos
    } catch (error) {
      console.error(error);
      setMessage("Error al registrar el usuario");
      setTimeout(() => {
        setMessage("");
      }, 2000); // 2000 ms = 2 segundos
    } finally {
      setLoading(false); // Desactivar el loader
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-sm mx-auto mt-10"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2"
          required
        />
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className="border rounded p-2"
          required
        >
          <option value="tecnico">Técnico</option>
          <option value="admin">Admin</option>
        </select>

        {/* Botón de registro con hover y disabled */}
        <button
          type="submit"
          className={`bg-blue-500 text-white rounded p-2 ${
            loading ? "cursor-wait opacity-50" : "hover:bg-blue-700"
          }`}
          disabled={loading} // Deshabilitar mientras se está procesando
        >
          {loading ? (
            <span className="spinner-border"></span>
          ) : (
            "Registrar"
          )}
        </button>
        {message && <p className="text-center mt-2 text-green-400">{message}</p>}
      </form>
    </>
  );
}

export default RegistroUsuarios;
