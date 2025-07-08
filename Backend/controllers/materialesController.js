import { stock } from '../db.js';

const materialesController = {
  // Crear un nuevo material
createMaterial: async (req, res) => {
  try {
    const { nombre, cantidad, es_material_menor, categoria, cantidad_minima } = req.body;
    console.log('Recibido:', req.body);

    const result = await stock.execute({
      sql: 'INSERT INTO materiales (nombre, cantidad, es_material_menor, categoria, cantidad_minima) VALUES (?, ?, ?, ?, ?)',
      args: [nombre, cantidad, es_material_menor, categoria, cantidad_minima]
    });

    res.status(201).json({ id: Number(result.lastInsertRowid), message: 'Material creado exitosamente' });
  } catch (error) {
    console.error('Error en POST /materiales:', error);
    res.status(500).json({ error: error.message });
  }
},


  // Obtener todos los materiales
  getAllMaterials: async (req, res) => {
    try {
      const result = await stock.execute('SELECT * FROM materiales');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un material por ID
  getMaterialById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await stock.execute({
        sql: 'SELECT * FROM materiales WHERE id = ?',
        args: [id]
      });
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Material no encontrado' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un material
  updateMaterial: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, cantidad, es_material_menor, categoria, cantidad_minima } = req.body;
      const result = await stock.execute({
        sql: 'UPDATE materiales SET nombre = ?, cantidad = ?, es_material_menor = ?, categoria = ?, cantidad_minima = ? WHERE id = ?',
        args: [nombre, cantidad, es_material_menor, categoria, cantidad_minima, id]
      });
      if (result.rowsAffected === 0) {
        return res.status(404).json({ message: 'Material no encontrado' });
      }
      res.json({ message: 'Material actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un material
  deleteMaterial: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await stock.execute({
        sql: 'DELETE FROM materiales WHERE id = ?',
        args: [id]
      });
      if (result.rowsAffected === 0) {
        return res.status(404).json({ message: 'Material no encontrado' });
      }
      res.json({ message: 'Material eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener alertas de stock bajo
  getStockAlerts: async (req, res) => {
    try {
      const result = await stock.execute(
        'SELECT * FROM materiales WHERE cantidad <= cantidad_minima'
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default materialesController;