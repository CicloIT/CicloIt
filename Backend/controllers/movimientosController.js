import { stock } from '../db.js';

const movimientosController = {
  createMovimiento: async (req, res) => {
    try {
      const { tipo, fecha, material_id, cantidad, responsable_id, motivo } = req.body;
      
      // Verificar que el material existe
      const materialResult = await stock.execute({
        sql: 'SELECT cantidad FROM materiales WHERE id = ?',
        args: [material_id]
      });

      if (materialResult.rows.length === 0) {
        return res.status(404).json({ message: 'Material no encontrado' });
      }

      // Verificar responsable
      if (responsable_id) {
        const responsableResult = await stock.execute({
          sql: 'SELECT id FROM responsables WHERE id = ?',
          args: [responsable_id]
        });

        if (responsableResult.rows.length === 0) {
          return res.status(404).json({ message: 'Responsable no encontrado' });
        }
      }

      const cantidadActual = materialResult.rows[0].cantidad;
      const nuevaCantidad = tipo === 'entrada' ? 
        cantidadActual + cantidad : 
        cantidadActual - cantidad;

      if (tipo === 'salida' && nuevaCantidad < 0) {
        return res.status(400).json({ message: 'Stock insuficiente para realizar la salida' });
      }

      // Usar el método de transacción específico de libsql
      const result = await stock.transaction(async (tx) => {
        // Registrar el movimiento
        const movimientoResult = await tx.execute({
          sql: 'INSERT INTO movimientos (tipo, fecha, material_id, cantidad, responsable_id, motivo) VALUES (?, ?, ?, ?, ?, ?)',
          args: [tipo, fecha, material_id, cantidad, responsable_id, motivo]
        });

        // Actualizar el stock
        await tx.execute({
          sql: 'UPDATE materiales SET cantidad = ? WHERE id = ?',
          args: [nuevaCantidad, material_id]
        });

        return movimientoResult;
      });

      res.status(201).json({ 
        id: Number(result.lastInsertRowid),
        message: 'Movimiento registrado exitosamente' 
      });

    } catch (error) {
      console.error('Error en createMovimiento:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener todos los movimientos
  getAllMovimientos: async (req, res) => {
    try {
      const result = await stock.execute(`
        SELECT m.*, mat.nombre as material_nombre, r.nombre as responsable_nombre 
        FROM movimientos m 
        LEFT JOIN materiales mat ON m.material_id = mat.id 
        LEFT JOIN responsables r ON m.responsable_id = r.id
        ORDER BY m.fecha DESC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error en getAllMovimientos:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener movimientos por material
  getMovimientosByMaterial: async (req, res) => {
    try {
      const { material_id } = req.params;
      const result = await stock.execute({
        sql: `
          SELECT m.*, r.nombre as responsable_nombre 
          FROM movimientos m 
          LEFT JOIN responsables r ON m.responsable_id = r.id 
          WHERE m.material_id = ?
          ORDER BY m.fecha DESC
        `,
        args: [material_id]
      });
      res.json(result.rows);
    } catch (error) {
      console.error('Error en getMovimientosByMaterial:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar movimiento
  deleteMovimiento: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Obtener los datos del movimiento antes de eliminarlo
      const movimientoResult = await stock.execute({
        sql: 'SELECT * FROM movimientos WHERE id = ?',
        args: [id]
      });

      if (movimientoResult.rows.length === 0) {
        return res.status(404).json({ message: 'Movimiento no encontrado' });
      }

      const movimiento = movimientoResult.rows[0];
      
      // Obtener la cantidad actual del material
      const materialResult = await stock.execute({
        sql: 'SELECT cantidad FROM materiales WHERE id = ?',
        args: [movimiento.material_id]
      });

      if (materialResult.rows.length === 0) {
        return res.status(404).json({ message: 'Material asociado no encontrado' });
      }

      const cantidadActual = materialResult.rows[0].cantidad;
      
      // Calcular la nueva cantidad revirtiendo el movimiento
      const nuevaCantidad = movimiento.tipo === 'entrada' ? 
        cantidadActual - movimiento.cantidad : // Si fue entrada, restamos
        cantidadActual + movimiento.cantidad;   // Si fue salida, sumamos

      // Verificar que la reversión no genere stock negativo
      if (nuevaCantidad < 0) {
        return res.status(400).json({ 
          message: 'No se puede eliminar el movimiento: resultaría en stock negativo' 
        });
      }

      // Usar transacción para eliminar el movimiento y actualizar el stock
      await stock.transaction(async (tx) => {
        // Eliminar el movimiento
        await tx.execute({
          sql: 'DELETE FROM movimientos WHERE id = ?',
          args: [id]
        });

        // Actualizar el stock del material
        await tx.execute({
          sql: 'UPDATE materiales SET cantidad = ? WHERE id = ?',
          args: [nuevaCantidad, movimiento.material_id]
        });
      });

      res.json({ 
        message: 'Movimiento eliminado exitosamente',
        stockActualizado: nuevaCantidad
      });

    } catch (error) {
      console.error('Error en deleteMovimiento:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default movimientosController;