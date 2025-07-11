import { useState, useEffect } from 'react';
import MovimientoForm from './Stock/MovimientoForm';
import MovimientosTable from './Stock/MovimientoTable';

import {
  getMovimientos,
  getMateriales,
  getResponsables,
  crearMovimiento
} from '../services/api';

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
    responsable_id_recibe: '',
    motivo: ''
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const loadData = async () => {
    try {
      const [movs, mats, resps] = await Promise.all([
        getMovimientos(),
        getMateriales(),
        getResponsables(),
      ]);
      setMovimientos(movs);
      setMateriales(mats);
      setResponsables(resps);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    try {
      await crearMovimiento(formData);
      setMensaje('Movimiento registrado correctamente');
      setFormData({
        tipo: 'entrada',
        fecha: new Date().toISOString().split('T')[0],
        material_id: '',
        cantidad: '',
        responsable_id: '',
        responsable_id_recibe: '',
        motivo: ''
      });
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

      <MovimientoForm
        formData={formData}
        setFormData={setFormData}
        materiales={materiales}
        responsables={responsables}
        loading={loading}
        handleSubmit={handleSubmit}
        mensaje={mensaje}
      />

      <MovimientosTable movimientos={movimientos} />
    </div>
  );
}
