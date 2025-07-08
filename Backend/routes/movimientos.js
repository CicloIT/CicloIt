import express from 'express';
import movimientosController  from '../controllers/movimientosController.js';

const router = express.Router();

router.post('/', movimientosController.createMovimiento);
router.get('/', movimientosController.getAllMovimientos);
// Agregar esta ruta en tu archivo de rutas
router.delete('/:id', movimientosController.deleteMovimiento);
router.get('/material/:material_id', movimientosController.getMovimientosByMaterial);

export default router;