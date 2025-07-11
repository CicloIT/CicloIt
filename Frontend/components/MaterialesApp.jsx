import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import {
  getMateriales,
  getAlertasMateriales,
  crearMaterial,
  actualizarMaterial,
  eliminarMaterial
} from '../services/api';
import MaterialFormModal from './Stock/MaterialFormModal';
import AlertasStock from './Stock/AlertaStock';


export default function MaterialesApp() {
  const [materiales, setMateriales] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: 0,
    es_material_menor: 1,
    categoria: '',
    cantidad_minima: 0
  });

  const isEdit = !!selectedMaterial;

  const resetForm = () => {
    setFormData({ nombre: '', cantidad: 0, es_material_menor: 1, categoria: '', cantidad_minima: 0 });
    setSelectedMaterial(null);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [mats, alerts] = await Promise.all([
        getMateriales(),
        getAlertasMateriales()
      ]);
      setMateriales(mats);
      setAlerts(alerts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEdit) {
        await actualizarMaterial(selectedMaterial.id, formData);
      } else {
        await crearMaterial(formData);
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (e) {
      console.error('Error al guardar:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (mat) => {
    setSelectedMaterial(mat);
    setFormData({
      nombre: mat.nombre,
      cantidad: mat.cantidad,
      es_material_menor: mat.es_material_menor,
      categoria: mat.categoria,
      cantidad_minima: mat.cantidad_minima
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar material?')) return;
    try {
      await eliminarMaterial(id);
      loadData();
    } catch (e) {
      console.error('Error al eliminar:', e);
    }
  };

  const filtered = materiales.filter(m =>
    m.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <AlertasStock alerts={alerts} />

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
                  <td className="px-6 py-3 flex space-x-2">
                    <button onClick={() => handleEdit(m)} className="text-indigo-600 hover:text-indigo-900"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <MaterialFormModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          loading={loading}
          isEdit={isEdit}
        />
      )}
    </div>
  );
}
