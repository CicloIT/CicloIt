import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import {
  getResponsables,
  crearResponsable,
  actualizarResponsable,
  eliminarResponsable
} from '../services/api';

export default function ResponsablesApp() {
  const [responsables, setResponsables] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', departamento: '', email: '' });

  const loadResponsables = async () => {
    try {
      const data = await getResponsables();
      setResponsables(data);
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selected) {
        await actualizarResponsable(selected.id, formData);
      } else {
        await crearResponsable(formData);
      }
      await loadResponsables();
      setShowModal(false);
      resetForm();
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar responsable?')) {
      try {
        await eliminarResponsable(id);
        await loadResponsables();
      } catch (e) {
        console.error(e.message);
      }
    }
  };

  const handleEdit = (responsable) => {
    setSelected(responsable);
    setFormData({
      nombre: responsable.nombre || '',
      departamento: responsable.departamento || '',
      email: responsable.email || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ nombre: '', departamento: '', email: '' });
    setSelected(null);
  };

  useEffect(() => {
    loadResponsables();
  }, []);

  const filtered = responsables.filter(r =>
    r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.departamento?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Responsables</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Buscar por nombre o departamento"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Departamento</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center px-4 py-6 text-gray-500">
                  No hay responsables
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{r.nombre}</td>
                  <td className="px-4 py-2">{r.departamento}</td>
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2 text-right flex justify-end gap-2">
                    <button onClick={() => handleEdit(r)} className="text-indigo-600 hover:text-indigo-800">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {selected ? 'Editar Responsable' : 'Nuevo Responsable'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Departamento"
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md">
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
