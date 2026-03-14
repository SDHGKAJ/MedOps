import express from 'express';
import medicineController from '../controllers/medicineController.js';
import authMiddleware from '../middleware/auth.js';
import roleMiddleware from '../middleware/roleCheck.js';

const router = express.Router();

// Public routes
router.get('/', medicineController.getAllMedicines);
router.get('/search', medicineController.searchMedicines);
router.get('/:id', medicineController.getMedicineById);
router.get('/:id/availability', medicineController.checkAvailability);

// Admin-only routes
router.post('/', authMiddleware, roleMiddleware(['admin']), medicineController.addMedicine);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), medicineController.updateMedicine);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), medicineController.deleteMedicine);

export default router;
