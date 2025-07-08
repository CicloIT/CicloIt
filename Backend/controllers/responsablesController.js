import { stock } from '../db.js';

const responsablesController = {
  // Crear un nuevo responsable
  createResponsable: async (req, res) => {
    try {
      const { nombre, departamento, email } = req.body;
      const result = await stock.execute({
        sql: 'INSERT INTO responsables (nombre, departamento, email) VALUES (?, ?, ?)',
        args: [nombre, departamento, email]
      });
      res.status(201).json({ 
        id: Number(result.lastInsertRowid),
        message: 'Responsable creado exitosamente' 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener todos los responsables
  getAllResponsables: async (req, res) => {
    try {
      const result = await stock.execute('SELECT * FROM responsables');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un responsable por ID
  getResponsableById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await stock.execute({
        sql: 'SELECT * FROM responsables WHERE id = ?',
        args: [id]
      });
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Responsable no encontrado' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un responsable
  updateResponsable: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, departamento, email } = req.body;
      const result = await stock.execute({
        sql: 'UPDATE responsables SET nombre = ?, departamento = ?, email = ? WHERE id = ?',
        args: [nombre, departamento, email, id]
      });
      if (result.rowsAffected === 0) {
        return res.status(404).json({ message: 'Responsable no encontrado' });
      }
      res.json({ message: 'Responsable actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un responsable
  deleteResponsable: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await stock.execute({
        sql: 'DELETE FROM responsables WHERE id = ?',
        args: [id]
      });
      if (result.rowsAffected === 0) {
        return res.status(404).json({ message: 'Responsable no encontrado' });
      }
      res.json({ message: 'Responsable eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default responsablesController;