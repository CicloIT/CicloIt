import { X } from 'lucide-react';

export default function MaterialFormModal({ formData, setFormData, onClose, onSubmit, loading, isEdit }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isEdit ? 'Editar' : 'Nuevo'} Material</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Nombre', type: 'text', value: formData.nombre, key: 'nombre' },
            { label: 'Cantidad', type: 'number', value: formData.cantidad, key: 'cantidad' },
            { label: 'Cantidad Mínima', type: 'number', value: formData.cantidad_minima, key: 'cantidad_minima' },
            { label: 'Categoría', type: 'text', value: formData.categoria, key: 'categoria' }
          ].map(({ label, type, value, key }) => (
            <div key={key}>
              <label className="text-sm font-medium">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: type === 'number' ? parseInt(e.target.value || 0) : e.target.value })
                }
                className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div>
            <label className="text-sm font-medium">¿Material menor?</label>
            <select
              value={formData.es_material_menor}
              onChange={(e) => setFormData({ ...formData, es_material_menor: parseInt(e.target.value) })}
              className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Sí</option>
              <option value={0}>No</option>
            </select>
          </div>

          <div className="flex justify-end pt-4 space-x-2">
            <button onClick={onClose} className="px-4 py-2 border rounded text-gray-700">Cancelar</button>
            <button onClick={onSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
