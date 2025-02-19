import { useState } from "react"
import { registrarCliente } from "../services/api"
function RegistrarCliente() {
    const [nombre,setNombre] = useState("")
    const [empresa,setEmpresa] = useState("")
    const [email,setEmail] = useState("")
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
                email: email === "" ? null : email,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Registro de Cliente
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
              placeholder="Empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            />
          </div>
          <div>
            <input
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Provincia"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Localidad"
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
              required
            />
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
              "Registrar Cliente"
            )}
          </button>
          {message && <p className="text-center mt-2 text-green-500">{message}</p>}
        </form>
      </div>
    </div>
  )
}

export default RegistrarCliente