import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';
import roleMiddleware from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getUser);
router.get('/users/all', authMiddleware, roleMiddleware(['admin']), authController.getAllUsers);

export default router;
