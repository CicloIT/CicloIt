import { useState, useEffect } from 'react';
import {
  registrarOrden,
  obtenerUsuarios,
  obtenerClientes,
} from "../services/api";

function FormularioOrden() {
    const [usuarios, setUsuarios] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [idUsuario, setIdUsuario] = useState("");
    const [idCliente, setIdCliente] = useState("");
    const [importancia, setImportancia] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState("");
    const [mensajeError, setMensajeError] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");
  
    useEffect(() => {
      const obtenerDatos = async () => {
        try {
          const usuariosResponse = await obtenerUsuarios(); // Asumiendo que tienes una función para obtener los usuarios
          const clientesResponse = await obtenerClientes(); // Lo mismo para los clientes
          setUsuarios(usuariosResponse);
          setClientes(clientesResponse);
        } catch (error) {
          console.error("Error al obtener usuarios o clientes", error);
        }
      };
      obtenerDatos();
    }, []);
  
    const manejarEnvio = async (e) => {
      e.preventDefault();
      setMensajeError("");
      setMensajeExito("");
  
      // Validación básica
      if (!idUsuario || !idCliente || !importancia || !estado) {
        setMensajeError("Todos los campos son obligatorios");
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
        await registrarOrden(data);
        setMensajeExito("Orden de trabajo creada exitosamente");
        setTimeout(() => {
          setMensajeExito("");
        }, 2000);
        setDescripcion("");
        setImportancia("");
        setEstado("");
        setIdCliente("");
        setIdUsuario("");
      } catch (error) {
        setMensajeError("Error al crear la orden de trabajo");
        setTimeout(() => {
          setMensajeError("");
        }, 2000);
        console.error(error);
      }
    };
  
    return (
      <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Formulario de Orden de Trabajo
        </h2>
        <form onSubmit={manejarEnvio} className="space-y-4">
          <div>
            <label
              htmlFor="idUsuario"
              className="block text-sm font-medium text-gray-700"
            >
              Usuario:
            </label>
            <select
              id="idUsuario"
              value={idUsuario}
              onChange={(e) => setIdUsuario(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccionar usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre} {usuario.apellido}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <label
              htmlFor="idCliente"
              className="block text-sm font-medium text-gray-700"
            >
              Cliente:
            </label>
            <select
              id="idCliente"
              value={idCliente}
              onChange={(e) => setIdCliente(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.empresa}
                </option>
              ))}
            </select>
          </div>
  
          <div className="mb-4">
            <label
              htmlFor="importancia"
              className="block text-sm font-medium text-gray-700"
            >
              Importancia:
            </label>
            <select
              id="importancia"
              value={importancia}
              onChange={(e) => setImportancia(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            >
              <option value="">Seleccionar importancia</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
  
          <div className="mb-4">
            <label
              htmlFor="estado"
              className="block text-sm font-medium text-gray-700"
            >
              Estado:
            </label>
            <select
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            >
              <option value="">Seleccionar estado</option>
              <option value="pendiente">Pendiente</option>
              <option value="en proceso">En proceso</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>
  
          <div className="mb-4">
            <label
              htmlFor="descripcion"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción:
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
  
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Registrar Orden
          </button>
        </form>
  
        {mensajeError && (
          <p className="mt-4 text-red-500 text-center">{mensajeError}</p>
        )}
        {mensajeExito && (
          <p className="mt-4 text-green-500 text-center">{mensajeExito}</p>
        )}
      </div>
    );
}

export default FormularioOrden