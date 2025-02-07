import { useState } from "react"
import { registrarCliente } from "../services/api"
function RegistrarCliente() {
    const [nombre,setNombre] = useState("")
    const [empresa,setEmpresa] = useState("")
    const [email,setEmail] = useState(null)
    const [telefono,setTelefono] = useState("")
    const [localidad,setLocalidad] = useState("")
    const [provincia,setProvincia] = useState("")
    const [direccion,setDireccion] = useState("")
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const response = await registrarCliente({
                nombre,
                empresa,
                email,
                telefono,
                localidad,
                provincia,
                direccion
            });
            if (!response) {
                throw new Error("Error al registrar el usuario");
            }
            setMessage("Usuario registrado exitosamente");
            setNombre("");
            setEmpresa("");
            setEmail("");
            setTelefono("");
            setLocalidad("");
            setProvincia("");
            setDireccion("");
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
          placeholder="Empresa"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          className="border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2"
          required
        />

         <input
          type="text"
          placeholder="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="border rounded p-2"
          required
        />
         <input
          type="text"
          placeholder="provincia"
          value={provincia}
          onChange={(e) => setProvincia(e.target.value)}
          className="border rounded p-2"
          required
        />
         <input
          type="text"
          placeholder="localidad"
          value={localidad}
          onChange={(e) => setLocalidad(e.target.value)}
          className="border rounded p-2"
          required
        />
         <input
          type="text"
          placeholder="direccion"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          className="border rounded p-2"
          required
        />
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
  )
}

export default RegistrarCliente