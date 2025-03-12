    import React, { useState } from 'react';
import { agregarProducto } from '../services/api';
const AgregarProducto = () => {
    const [formData, setFormData] = useState({
      nombre: '',
      precio_lista: '', // Precio de lista como base
      proveedor: '',
      modelo: '',
      stock: '',
      iva: '21', // Valor por defecto
      recargo_5: false, // Recargo del 5%
      recargo_6_5: false, // Recargo del 6.5%
      ganancia: '30', // Valor por defecto (30%)
    });
    
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  
    // Opciones para los selectores
    const opcionesIVA = [
      { value: '0', label: '0%' },
      { value: '10.5', label: '10.5%' },
      { value: '21', label: '21%' },
      { value: '27', label: '27%' },
    ];
  
    // Manejador de cambios en los inputs
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      // Si es un campo de precio, reemplazamos comas por puntos
      if (name === 'precio_lista' && typeof value === 'string') {
        const formattedValue = value.replace(',', '.');
        setFormData({
          ...formData,
          [name]: formattedValue
        });
      } else {
        setFormData({
          ...formData,
          [name]: type === 'checkbox' ? checked : value,
        });
      }
    };
  
    // Calcular precio neto (igual al precio de lista)
    const calcularPrecioNeto = () => {
      if (!formData.precio_lista) return '';
      
      return parseFloat(formData.precio_lista).toFixed(2);
    };
  
    const calcularPrecioConGanancia = () => {
        if (!formData.precio_lista) return 0;
      
        const precioLista = parseFloat(formData.precio_lista);
        const ganancia = parseFloat(formData.ganancia) / 100;
        return parseFloat((precioLista * (1 + ganancia)).toFixed(2));
      };
      
    // Calcular el total de recargos
    const calcularRecargos = () => {
      let recargos = 0;
      if (formData.recargo_5) {
        recargos += 5;
      }
      if (formData.recargo_6_5) {
        recargos += 6.5;
      }
      return recargos;
    };
      
    // Calcular precio final con ganancia, IVA y recargos
    const calcularPrecioTotal = () => {
      if (!formData.precio_lista) return 0;
      
      const precioLista = parseFloat(formData.precio_lista);
      const ganancia = parseFloat(formData.ganancia) / 100;
      const iva = parseFloat(formData.iva) / 100;
      const recargo = calcularRecargos() / 100;
      
      // Aplicamos ganancia sobre el precio de lista
      const precioConGanancia = precioLista * (1 + ganancia);
      
      // Luego aplicamos IVA y recargo adicional
      const precioTotal = precioConGanancia * (1 + iva) * (1 + recargo);
      
      return parseFloat(precioTotal.toFixed(2));
    };
      
  
    // Manejador del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
      
        try {
          // Asegurarnos de que los valores numéricos sean de tipo Number (pero no BigInt)
          const precio_neto = parseFloat(calcularPrecioConGanancia().toFixed(2));
          const precio_con_iva = parseFloat(calcularPrecioTotal().toFixed(2));
          const stock = Number(formData.stock);
      
          // Crear un objeto con los valores exactos que espera la base de datos
          const producto = {
            nombre: formData.nombre,
            precio_neto, 
            precio_con_iva,
            proveedor: formData.proveedor,
            modelo: formData.modelo,
            stock,
          };
      
          // Verificar que los tipos de datos son correctos antes de enviar
          console.log("Enviando producto:", producto);         
      
          const resultado = await agregarProducto(producto);
      
          setMensaje({
            tipo: 'success',
            texto: resultado.message || 'Producto agregado exitosamente'
          });
      
          // Reiniciar el formulario
          setFormData({
            nombre: '',
            precio_lista: '',
            proveedor: '',
            modelo: '',
            stock: '',
            iva: '21',
            recargo_5: false,
            recargo_6_5: false,
            ganancia: '30',
          });
      
        } catch (error) {
          console.error("Error al agregar producto:", error);
          setMensaje({
            tipo: 'error',
            texto: 'Error al agregar el producto: ' + (error.message || 'Error desconocido')
          });
        } finally {
          setLoading(false);
      
          // Limpiar el mensaje después de 3 segundos
          setTimeout(() => {
            setMensaje({ tipo: '', texto: '' });
          }, 3000);
        }
    };
  
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Producto</h2>
        
        {mensaje.texto && (
          <div className={`p-3 mb-4 rounded ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {mensaje.texto}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Proveedor</label>
              <input
                type="text"
                name="proveedor"
                value={formData.proveedor}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Modelo</label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio de Lista</label>
              <input
                type="text"
                name="precio_lista"
                value={formData.precio_lista}
                onChange={handleChange}
                required
                placeholder="0.00"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Precio base del producto (use punto para decimales)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Ganancia (%)</label>
              <input
                type="number"
                name="ganancia"
                value={formData.ganancia}
                onChange={handleChange}
                required
                min="0"
                max="100"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">IVA</label>
              <select
                name="iva"
                value={formData.iva}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {opcionesIVA.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recargos Adicionales</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recargo_5"
                    name="recargo_5"
                    checked={formData.recargo_5}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="recargo_5" className="ml-2 block text-sm text-gray-700">
                    Recargo 5%
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recargo_6_5"
                    name="recargo_6_5"
                    checked={formData.recargo_6_5}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="recargo_6_5" className="ml-2 block text-sm text-gray-700">
                    Recargo 6.5%
                  </label>
                </div>
              </div>
              {(formData.recargo_5 || formData.recargo_6_5) && (
                <p className="text-sm text-gray-700 mt-2">
                  Recargo total aplicado: <span className="font-medium">{calcularRecargos()}%</span>
                </p>
              )}
            </div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-md mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-medium">Precio Neto:</span>
                <span className="block text-xl font-bold">${calcularPrecioNeto() || '0.00'}</span>
                <span className="text-sm text-gray-500">Precio de lista</span>
              </div>
              <div>
                <span className="font-medium">Precio con Ganancia:</span>
                <span className="block text-xl font-bold">${calcularPrecioConGanancia().toFixed(2) || '0.00'}</span>
                <span className="text-sm text-gray-500">Precio de lista + {formData.ganancia}% de ganancia</span>
              </div>
              <div>
                <span className="font-medium">Precio Final:</span>
                <span className="block text-xl font-bold">${calcularPrecioTotal().toFixed(2) || '0.00'}</span>
                <span className="text-sm text-gray-500">Incluye ganancia, IVA y recargos</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default AgregarProducto;
  


 