import React, { useState } from 'react';
import { agregarServicios } from '../services/api';

const AgregarServicio = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio_por_hora: '',
    precio_con_iva: 0
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Crear nuevo estado basado en los cambios
    const nuevoEstado = {
      ...formData,
      [name]: value
    };
    // Si cambió el precio, actualizar el precio con IVA
    if (name === 'precio_por_hora') {
      const precioBase = parseFloat(value) || 0;
      nuevoEstado.precio_con_iva = (precioBase * 1.21).toFixed(2);
    }
    
    setFormData(nuevoEstado);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    
    try {
      // Validar que los campos no estén vacíos
      if (!formData.nombre || !formData.precio_por_hora) {
        setMensaje({
          texto: 'Por favor completa todos los campos',
          tipo: 'error'
        });
        setCargando(false);
        return;
      }      
      // Usar tu función existente para agregar el servicio
      await agregarServicios(formData);     
      // Mostrar mensaje de éxito
      setMensaje({
        texto: 'Servicio agregado exitosamente',
        tipo: 'exito'
      });

      // Limpiar el formulario
      setFormData({
        nombre: '',
        precio_por_hora: '',
        precio_con_iva: 0
      });
    } catch (error) {
      console.error('Error al agregar servicio:', error);
      setMensaje({
        texto: 'Error al agregar el servicio. Por favor intenta nuevamente.',
        tipo: 'error'
      });
    } finally {
      setCargando(false);
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setMensaje({ texto: '', tipo: '' });
      }, 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Agregar Nuevo Servicio</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700 font-medium mb-2">
              Nombre del Servicio:
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="precio_por_hora" className="block text-gray-700 font-medium mb-2">
              Precio por Hora ($):
            </label>
            <input
              type="number"
              id="precio_por_hora"
              name="precio_por_hora"
              value={formData.precio_por_hora}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6 p-3 bg-gray-50 rounded-md">
            <label className="block text-gray-700 font-medium mb-2">Desglose de Precios</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-600">Sin IVA:</div>
              <div className="font-medium text-right">
                ${parseFloat(formData.precio_por_hora || 0).toFixed(2)}
              </div>
              <div className="text-gray-600">Con IVA (21%):</div>
              <div className="font-medium text-right text-indigo-700">
                ${formData.precio_con_iva}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={cargando} 
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            }`}
          >
            {cargando ? 'Agregando...' : 'Agregar Servicio'}
          </button>
        </form>
        
        {mensaje.texto && (
          <div className={`mt-4 p-3 rounded-md text-center ${
            mensaje.tipo === 'exito' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {mensaje.texto}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgregarServicio;