import express from 'express';
import  materialesController  from '../controllers/materialesController.js';

const router = express.Router();

router.post('/', materialesController.createMaterial);
router.get('/', materialesController.getAllMaterials);
router.get('/alerts', materialesController.getStockAlerts);
router.get('/:id', materialesController.getMaterialById);
router.put('/:id', materialesController.updateMaterial);
router.delete('/:id', materialesController.deleteMaterial);

export default router;