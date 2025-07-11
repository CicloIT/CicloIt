export default function MovimientosTable({ movimientos }) {
  return (
    <div className="bg-white shadow border rounded-md overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Material</th>
            <th className="px-4 py-2">Cantidad</th>
            <th className="px-4 py-2">Responsable</th>
            <th className="px-4 py-2">Responsable recibe</th>
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
              <td className="px-4 py-2">{mov.responsable_recibe_nombre || '-'}</td>
              <td className="px-4 py-2">{mov.motivo || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
