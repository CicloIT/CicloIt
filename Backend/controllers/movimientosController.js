import { stock } from '../db.js';

const movimientosController = {
  createMovimiento: async (req, res) => {
    try {
      const { tipo, fecha, material_id, cantidad, responsable_id, motivo } = req.body;

      if (!tipo || !fecha || !material_id || !cantidad) {
        return res.status(400).json({ 
          message: 'Faltan campos obligatorios: tipo, fecha, material_id, cantidad' 
        });
      }

      if (tipo !== 'entrada' && tipo !== 'salida') {
        return res.status(400).json({ 
          message: 'El tipo debe ser "entrada" o "salida"' 
        });
      }

      if (cantidad <= 0) {
        return res.status(400).json({ 
          message: 'La cantidad debe ser mayor a 0' 
        });
      }

      const materialResult = await stock.execute({
        sql: 'SELECT cantidad FROM materiales WHERE id = ?',
        args: [material_id]
      });

      if (materialResult.rows.length === 0) {
        return res.status(404).json({ message: 'Material no encontrado' });
      }

      if (responsable_id) {
        const responsableResult = await stock.execute({
          sql: 'SELECT id FROM responsables WHERE id = ?',
          args: [responsable_id]
        });

        if (responsableResult.rows.length === 0) {
          return res.status(404).json({ message: 'Responsable no encontrado' });
        }
      }

      const cantidadActual = Number(materialResult.rows[0].cantidad);
      const cantidadMovimiento = Number(cantidad);
      const nuevaCantidad = tipo === 'entrada' ? 
        cantidadActual + cantidadMovimiento : 
        cantidadActual - cantidadMovimiento;

      if (tipo === 'salida' && nuevaCantidad < 0) {
        return res.status(400).json({ 
          message: `Stock insuficiente. Stock actual: ${cantidadActual}, cantidad solicitada: ${cantidadMovimiento}` 
        });
      }

      const insertResult = await stock.execute({
        sql: 'INSERT INTO movimientos (tipo, fecha, material_id, cantidad, responsable_id, motivo) VALUES (?, ?, ?, ?, ?, ?)',
        args: [tipo, fecha, Number(material_id), cantidadMovimiento, responsable_id || null, motivo || null]
      });

      await stock.execute({
        sql: 'UPDATE materiales SET cantidad = ? WHERE id = ?',
        args: [nuevaCantidad, Number(material_id)]
      });

      const verificacionStock = await stock.execute({
        sql: 'SELECT cantidad FROM materiales WHERE id = ?',
        args: [Number(material_id)]
      });

      res.status(201).json({ 
        message: 'Movimiento registrado exitosamente',
        movimiento: {
          id: Number(insertResult.lastInsertRowid),
          tipo,
          fecha,
          material_id: Number(material_id),
          cantidad: cantidadMovimiento,
          responsable_id: responsable_id || null,
          motivo: motivo || null
        },
        stockActual: verificacionStock.rows[0]?.cantidad || null
      });

    } catch (error) {
      res.status(500).json({ 
        error: error.message,
        details: 'Revisa los logs del servidor para más información'
      });
    }
  },

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
      res.status(500).json({ error: error.message });
    }
  },

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
      res.status(500).json({ error: error.message });
    }
  },

  deleteMovimiento: async (req, res) => {
    try {
      const { id } = req.params;
      
      const movimientoResult = await stock.execute({
        sql: 'SELECT * FROM movimientos WHERE id = ?',
        args: [id]
      });

      if (movimientoResult.rows.length === 0) {
        return res.status(404).json({ message: 'Movimiento no encontrado' });
      }

      const movimiento = movimientoResult.rows[0];
      
      const materialResult = await stock.execute({
        sql: 'SELECT cantidad FROM materiales WHERE id = ?',
        args: [movimiento.material_id]
      });

      if (materialResult.rows.length === 0) {
        return res.status(404).json({ message: 'Material asociado no encontrado' });
      }

      const cantidadActual = Number(materialResult.rows[0].cantidad);
      const cantidadMovimiento = Number(movimiento.cantidad);
      
      const nuevaCantidad = movimiento.tipo === 'entrada' ? 
        cantidadActual - cantidadMovimiento : 
        cantidadActual + cantidadMovimiento;

      if (nuevaCantidad < 0) {
        return res.status(400).json({ 
          message: 'No se puede eliminar el movimiento: resultaría en stock negativo' 
        });
      }

      await stock.execute({
        sql: 'DELETE FROM movimientos WHERE id = ?',
        args: [id]
      });

      await stock.execute({
        sql: 'UPDATE materiales SET cantidad = ? WHERE id = ?',
        args: [nuevaCantidad, movimiento.material_id]
      });

      res.json({ 
        message: 'Movimiento eliminado exitosamente',
        stockActualizado: nuevaCantidad
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default movimientosController;
