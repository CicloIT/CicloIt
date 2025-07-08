import { useState, useEffect } from 'react';
import MovimientoForm from './Stock/MovimientoForm';
import MovimientosTable from './Stock/MovimientoTable';
const API_URL = 'https://ciclo-it.vercel.app';
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
const API_MOVIMIENTOS = `${API_URL}/api/movimientos`;
const API_MATERIALES = `${API_URL}/api/materiales`;
const API_RESPONSABLES = `${API_URL}/api/responsables`;
{
  /*
    const API_MOVIMIENTOS = 'http://localhost:3000/api/movimientos';
  const API_MATERIALES = 'http://localhost:3000/api/materiales';
  const API_RESPONSABLES = 'http://localhost:3000/api/responsables';
  */
}
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
      setFormData({
        tipo: 'entrada',
        fecha: new Date().toISOString().split('T')[0],
        material_id: '',
        cantidad: '',
        responsable_id: '',
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
