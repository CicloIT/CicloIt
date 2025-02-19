import { useState, useEffect, useRef } from 'react';
import {
  registrarOrden,
  obtenerUsuarios,
  obtenerClientes,
} from "../services/api";

function FormularioOrden() {
    const [usuarios, setUsuarios] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [busquedaCliente, setBusquedaCliente] = useState("");
    const [idUsuario, setIdUsuario] = useState("");
    const [idCliente, setIdCliente] = useState("");
    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [importancia, setImportancia] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const sugerenciasRef = useRef(null);
  
    useEffect(() => {
      const obtenerDatos = async () => {
        try {
          const usuariosResponse = await obtenerUsuarios();
          const clientesResponse = await obtenerClientes();
          setUsuarios(usuariosResponse);
          setClientes(clientesResponse);
        } catch (error) {
          console.error("Error al obtener usuarios o clientes", error);
        }
      };
      obtenerDatos();
    }, []);

    useEffect(() => {
      const resultados = clientes.filter(cliente =>
        cliente.empresa.toLowerCase().includes(busquedaCliente.toLowerCase())
      );
      setClientesFiltrados(resultados);
    }, [busquedaCliente, clientes]);
    
    // Cierra el dropdown cuando se hace clic fuera de él
    useEffect(() => {
      function handleClickOutside(event) {
        if (sugerenciasRef.current && !sugerenciasRef.current.contains(event.target)) {
          setMostrarSugerencias(false);
        }
      }
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");
  
      if (!idUsuario || !idCliente || !importancia || !estado) {
        setMessage("Todos los campos son obligatorios");
        setLoading(false);
        return;
      }
  
      try {
        const data = {
          id_usuario: idUsuario,
          id_cliente: idCliente,
          importancia: importancia,
          descripcion: descripcion,
          estado: estado,
        };
        const response = await registrarOrden(data);
        if (!response) {
          throw new Error("Error al registrar la orden");
        }
        setMessage("Orden de trabajo creada exitosamente");
        setDescripcion("");
        setImportancia("");
        setEstado("");
        setIdCliente("");
        setClienteSeleccionado("");
        setBusquedaCliente("");
        setIdUsuario("");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      } catch (error) {
        console.error(error);
        setMessage("Error al crear la orden de trabajo");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };
    
    const seleccionarCliente = (cliente) => {
      setIdCliente(cliente.id);
      setClienteSeleccionado(cliente.empresa);
      setBusquedaCliente(cliente.empresa);
      setMostrarSugerencias(false);
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
            Formulario de Orden de Trabajo
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <select
                id="idUsuario"
                value={idUsuario}
                onChange={(e) => setIdUsuario(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
                required
              >
                <option value="">Seleccionar usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="relative" ref={sugerenciasRef}>
              <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition duration-300 ease-in-out hover:border-indigo-400">
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={busquedaCliente}
                  onChange={(e) => {
                    setBusquedaCliente(e.target.value);
                    setMostrarSugerencias(true);
                    if (e.target.value === "") {
                      setIdCliente("");
                      setClienteSeleccionado("");
                    } else if (clienteSeleccionado && e.target.value !== clienteSeleccionado) {
                      setIdCliente("");
                      setClienteSeleccionado("");
                    }
                  }}
                  onFocus={() => setMostrarSugerencias(true)}
                  className="flex-grow px-3 py-3 placeholder-gray-500 text-gray-900 focus:outline-none sm:text-sm rounded-l-lg"
                  required
                />
                {idCliente && (
                  <button
                    type="button"
                    onClick={() => {
                      setIdCliente("");
                      setClienteSeleccionado("");
                      setBusquedaCliente("");
                    }}
                    className="pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              
              {mostrarSugerencias && busquedaCliente && clientesFiltrados.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                  {clientesFiltrados.map((cliente) => (
                    <li
                      key={cliente.id}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-100"
                      onClick={() => seleccionarCliente(cliente)}
                    >
                      <div className="flex items-center">
                        <span className="font-medium block truncate">{cliente.empresa}</span>
                      </div>
                      {idCliente === cliente.id && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              
              {mostrarSugerencias && busquedaCliente && clientesFiltrados.length === 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-2 px-3 text-sm text-gray-700">
                  No se encontraron clientes. 
                </div>
              )}
            </div>

            <div>
              <select
                id="importancia"
                value={importancia}
                onChange={(e) => setImportancia(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
                required
              >
                <option value="">Seleccionar importancia</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
  
            <div>
              <select
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out hover:border-indigo-400"
                required
              >
                <option value="">Seleccionar estado</option>
                <option value="pendiente">Pendiente</option>
                <option value="en proceso">En proceso</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
  
            <div>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción"
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
                "Registrar Orden"
              )}
            </button>
            {message && <p className="text-center mt-2 text-green-500">{message}</p>}
          </form>
        </div>
      </div>
    );
}

export default FormularioOrden