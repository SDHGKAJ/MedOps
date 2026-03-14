import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';
import roleMiddleware from '../middleware/roleCheck.js';

const router = express.Router();

// Customer routes
router.post('/', authMiddleware, roleMiddleware(['customer']), orderController.placeOrder);
router.get('/my', authMiddleware, roleMiddleware(['customer']), orderController.getMyOrders);

// Admin routes
router.get('/all', authMiddleware, roleMiddleware(['admin']), orderController.getAllOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/status/:id', authMiddleware, roleMiddleware(['admin']), orderController.updateOrderStatus);
router.delete('/cancel/:id', authMiddleware, roleMiddleware(['customer']), orderController.cancelOrder);

export default router;
