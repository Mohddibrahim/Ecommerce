// routes/productRoutes.js
import express from 'express';
import {
  addProduct,
  getAllProducts,
  getByCategory,
  getSellerProducts,
  deleteProduct,
  updateProduct,
  getProductById
} from '../controllers/productController.js';

import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';


const router = express.Router();

// Routes
router.post('/', protect, upload.single('image'), addProduct);
router.get('/', getAllProducts);
router.get('/category/:cat', getByCategory);
router.get('/mine', protect, getSellerProducts);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.get('/:id', getProductById); // Must be last

export default router;
