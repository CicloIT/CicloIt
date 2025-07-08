import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, Package, Eye, X } from 'lucide-react';

const MaterialesApp = () => {
  const [materiales, setMateriales] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: 0,
    es_material_menor: 1,
    categoria: '',
    cantidad_minima: 0
  });

  const API_BASE = 'http://localhost:3000/api/materiales';

  const loadMateriales = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setMateriales(data);
    } catch (e) {
      console.error('Error al cargar materiales:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts`);
      const data = await res.json();
      setAlerts(data);
    } catch (e) {
      console.error('Error al cargar alertas:', e);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = selectedMaterial ? `${API_BASE}/${selectedMaterial.id}` : API_BASE;
      const method = selectedMaterial ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await loadMateriales();
        await loadAlerts();
        setShowModal(false);
        resetForm();
      }
    } catch (e) {
      console.error('Error al guardar material:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar material?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadMateriales();
        await loadAlerts();
      }
    } catch (e) {
      console.error('Error al eliminar:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (material) => {
    setSelectedMaterial(material);
    setFormData({
      nombre: material.nombre || '',
      cantidad: material.cantidad || 0,
      es_material_menor: material.es_material_menor ?? 1,
      categoria: material.categoria || '',
      cantidad_minima: material.cantidad_minima || 0
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      cantidad: 0,
      es_material_menor: 1,
      categoria: '',
      cantidad_minima: 0
    });
    setSelectedMaterial(null);
  };

  const filtered = materiales.filter(m =>
    m.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadMateriales();
    loadAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Package className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold">Materiales</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Alertas */}
        {alerts.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-red-600" />
              <h3 className="font-semibold text-red-800">Stock Bajo</h3>
            </div>
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {alerts.map((a, i) => (
                <li key={i} className="bg-white p-3 rounded border border-red-200">
                  <p className="font-semibold text-red-800">{a.nombre}</p>
                  <p className="text-sm text-red-600">Cantidad: {a.cantidad} (Min: {a.cantidad_minima})</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Buscador */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              className="w-full pl-10 pr-4 py-2 border rounded focus:ring-blue-500"
              placeholder="Buscar materiales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-sm text-gray-600 ml-4">{filtered.length} / {materiales.length}</p>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase">Categoría</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase">Cantidad</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase">Min</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase">Menor</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">No hay resultados</td></tr>
              ) : filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{m.nombre}</td>
                  <td className="px-6 py-3">{m.categoria}</td>
                  <td className="px-6 py-3">{m.cantidad}</td>
                  <td className="px-6 py-3">{m.cantidad_minima}</td>
                  <td className="px-6 py-3">{m.es_material_menor ? 'Sí' : 'No'}</td>
                  <td className="px-6 py-3">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(m)} className="text-indigo-600 hover:text-indigo-900" title="Editar">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-900" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedMaterial ? 'Editar' : 'Nuevo'} Material</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="text-sm font-medium">Cantidad</label>
                <input type="number" value={formData.cantidad} onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value || 0) })}
                  className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="text-sm font-medium">Cantidad Mínima</label>
                <input type="number" value={formData.cantidad_minima} onChange={(e) => setFormData({ ...formData, cantidad_minima: parseInt(e.target.value || 0) })}
                  className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="text-sm font-medium">Categoría</label>
                <input type="text" value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="text-sm font-medium">¿Material menor?</label>
                <select value={formData.es_material_menor} onChange={(e) => setFormData({ ...formData, es_material_menor: parseInt(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500">
                  <option value={1}>Sí</option>
                  <option value={0}>No</option>
                </select>
              </div>

              <div className="flex justify-end pt-4 space-x-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-gray-700">Cancelar</button>
                <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialesApp;
