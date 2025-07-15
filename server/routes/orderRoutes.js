import express from 'express';
import { placeOrder, getMyOrders, cancelOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, placeOrder);          // Create order
router.get('/mine', protect, getMyOrders);      // Get user's orders
router.delete('/:id', protect, cancelOrder);    // Cancel order

export default router;
