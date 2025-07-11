import { Loader2 } from 'lucide-react';

export default function MovimientoForm({
  formData,
  setFormData,
  materiales,
  responsables,
  loading,
  handleSubmit,
  mensaje
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-4 rounded-md border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} className="border p-2 rounded">
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>

        <input
          type="date"
          value={formData.fecha}
          onChange={e => setFormData({ ...formData, fecha: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <select
          value={formData.material_id}
          onChange={e => setFormData({ ...formData, material_id: e.target.value })}
          className="border p-2 rounded"
          required
        >
          <option value="">Seleccionar material</option>
          {materiales.map(mat => (
            <option key={mat.id} value={mat.id}>{mat.nombre}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          min="1"
          placeholder="Cantidad"
          value={formData.cantidad}
          onChange={e => setFormData({ ...formData, cantidad: parseInt(e.target.value) || '' })}
          className="border p-2 rounded"
          required
        />

        <select
          value={formData.responsable_id}
          onChange={e => setFormData({ ...formData, responsable_id: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Sin responsable</option>
          {responsables.map(resp => (
            <option key={resp.id} value={resp.id}>{resp.nombre}</option>
          ))}
        </select>

        {/* Responsable que recibe */}
        <select
          value={formData.responsable_id_recibe}
          onChange={e => setFormData({ ...formData, responsable_id_recibe: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Sin responsable que recibe</option>
          {responsables.map(resp => (
            <option key={resp.id} value={resp.id}>{resp.nombre}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Motivo (opcional)"
          value={formData.motivo}
          onChange={e => setFormData({ ...formData, motivo: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Guardar</span>
        </button>
      </div>

      {mensaje && <p className="text-sm mt-2 text-blue-600">{mensaje}</p>}
    </form>
  );
}
