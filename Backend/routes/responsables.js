import express from 'express';
import  responsablesController from '../controllers/responsablesController.js';

const router = express.Router();

router.post('/', responsablesController.createResponsable);
router.get('/', responsablesController.getAllResponsables);
router.get('/:id', responsablesController.getResponsableById);
router.put('/:id', responsablesController.updateResponsable);
router.delete('/:id', responsablesController.deleteResponsable);

export default router;