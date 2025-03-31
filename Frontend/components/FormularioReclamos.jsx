/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  registrarReclamo,
  obtenerUsuarios,
  obtenerOrdenesTrabajo,
} from "../services/api";

function FormularioReclamos({ usuarioActual, rol }) {
  const [usuarioId, setUsuarioId] = useState("");
  const [ordenTrabajoId, setOrdenTrabajoId] = useState("");
  const [ordenTrabajoManual, setOrdenTrabajoManual] = useState(""); // Nuevo estado
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [importancia, setImportancia] = useState("");
  const [estado, setEstado] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [ordenesTrabajo, setOrdenesTrabajo] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [creadoPor, setCreadoPor] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const usuariosResponse = await obtenerUsuarios();
        setUsuarios(usuariosResponse);
        if (rol !== "cliente") {
          const ordenesResponse = await obtenerOrdenesTrabajo();
          setOrdenesTrabajo(ordenesResponse);
        }
      } catch (error) {
        console.error("Error al obtener los datos", error);
        setMessage("Error al obtener los datos");
        setTimeout(() => setMessage(""), 2000);
      }
    };

    obtenerDatos();
  }, [rol]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (rol === "cliente" && !creadoPor) {
      setMessage("Por favor, indique quién carga el reclamo");
      setLoading(false);
      return;
    }

    if (!usuarioId || !titulo || !descripcion || !importancia || !estado) {
      setMessage("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    try {
      const data = {
        usuario_id: Number(usuarioId),
        ...(ordenTrabajoId && ordenTrabajoId !== "otro"
          ? { ordenTrabajo_id: Number(ordenTrabajoId) }
          : { ordenTrabajo_id: null }), // Usar ordenTrabajoManual si es "otro"
        titulo,
        descripcion,
        importancia,
        estado,
        ...(rol === "cliente" && { creadoPor }),
        cliente: rol === "cliente" ? usuarioActual?.nombre : ordenTrabajoManual,
      };
      const response = await registrarReclamo(data);

      if (response.id) {
        setMessage("Reclamo creado exitosamente");
        setDescripcion("");
        setEstado("");
        setImportancia("");
        setTitulo("");
        setUsuarioId(usuarioActual?.id || "");
        setOrdenTrabajoId("");
        setOrdenTrabajoManual(""); // Resetear también este campo

        if (rol === "cliente") {
          setCreadoPor("");
        }
      } else {
        setMessage("Error al crear el reclamo");
      }
      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      console.error(error);
      setMessage("Error al crear el reclamo");
      setTimeout(() => setMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Formulario de Reclamo
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Si el usuario es cliente, mostramos su nombre y el campo creadoPor */}
          {rol === "cliente" ? (
            <>
              <select
                id="usuarioId"
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Seleccionar Usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido}
                  </option>
                ))}
              </select>
              <div>
                <input
                  type="text"
                  placeholder="¿Quién está cargando el reclamo?"
                  value={creadoPor}
                  onChange={(e) => setCreadoPor(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  value={usuarioActual.nombre}
                  disabled
                  className="w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg bg-gray-100"
                />
              </div>
            </>
          ) : (
            <>
              <select
                id="usuarioId"
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Seleccionar Usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nombre} {usuario.apellido}
                  </option>
                ))}
              </select>

              {rol !== "cliente" && (
                <>
                  <div>
                    <select
                      id="ordenTrabajoId"
                      value={ordenTrabajoId}
                      onChange={(e) => {
                        setOrdenTrabajoId(e.target.value);
                        // Resetear ordenTrabajoManual si no es "otro"
                        if (e.target.value !== "otro") {
                          setOrdenTrabajoManual("");
                        }
                      }}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg"
                    >
                      <option value="">Seleccionar Orden de Trabajo</option>
                      {ordenesTrabajo.map((orden) => (
                        <option key={orden.id} value={orden.id}>
                          {orden.id} - {orden.empresa} - {orden.descripcion}
                        </option>
                      ))}
                      <option value="otro">Otro (escribir manualmente)</option>
                    </select>
                  </div>

                  {/* Mostrar un campo de texto si el usuario elige "Otro" */}
                  {ordenTrabajoId === "otro" && (
                    <div>
                      <input
                        type="text"
                        placeholder="Ingrese la orden de trabajo manualmente"
                        value={ordenTrabajoManual}
                        onChange={(e) => setOrdenTrabajoManual(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <div>
            <input
              type="text"
              id="titulo"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <textarea
              id="descripcion"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <select
              id="importancia"
              value={importancia}
              onChange={(e) => setImportancia(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg"
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
              className="w-full px-3 py-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Seleccionar estado</option>
              <option value="abierto">Abierto</option>
              <option value="en proceso">En proceso</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>

          <button
            type="submit"
            className={`w-full py-3 text-white rounded-lg ${
              loading
                ? "bg-indigo-400 cursor-wait"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Registrar Reclamo"
            )}
          </button>
          {message && (
            <p className="text-center mt-2 text-green-500">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default FormularioReclamos;
