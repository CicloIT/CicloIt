import { AlertTriangle } from 'lucide-react';

export default function AlertasStock({ alerts }) {
  if (!alerts.length) return null;

  return (
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
  );
}
