import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';

export default function MovimientosApp() {
  const [movimientos, setMovimientos] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [formData, setFormData] = useState({
    tipo: 'entrada',
    fecha: new Date().toISOString().split('T')[0],
    material_id: '',
    cantidad: '',
    responsable_id: '',
    motivo: ''
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const API_MOVIMIENTOS = 'http://localhost:3000/api/movimientos';
  const API_MATERIALES = 'http://localhost:3000/api/materiales';
  const API_RESPONSABLES = 'http://localhost:3000/api/responsables';

  const loadData = async () => {
    const [mRes, matRes, respRes] = await Promise.all([
      fetch(API_MOVIMIENTOS),
      fetch(API_MATERIALES),
      fetch(API_RESPONSABLES)
    ]);
    const mData = await mRes.json();
    const matData = await matRes.json();
    const respData = await respRes.json();

    setMovimientos(mData);
    setMateriales(matData);
    setResponsables(respData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    try {
      const res = await fetch(API_MOVIMIENTOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Error al registrar el movimiento');
      }

      setMensaje('Movimiento registrado correctamente');
      setFormData({ tipo: 'entrada', fecha: new Date().toISOString().split('T')[0], material_id: '', cantidad: '', responsable_id: '', motivo: '' });
      loadData();
    } catch (error) {
      setMensaje(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registro de Movimientos</h1>

      {/* Formulario */}
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

      {/* Tabla */}
      <div className="bg-white shadow border rounded-md overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Responsable</th>
              <th className="px-4 py-2">Motivo</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map(mov => (
              <tr key={mov.id} className="border-t">
                <td className="px-4 py-2">{mov.fecha}</td>
                <td className={`px-4 py-2 font-medium ${mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                  {mov.tipo}
                </td>
                <td className="px-4 py-2">{mov.material_nombre}</td>
                <td className="px-4 py-2">{mov.cantidad}</td>
                <td className="px-4 py-2">{mov.responsable_nombre || '-'}</td>
                <td className="px-4 py-2">{mov.motivo || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
