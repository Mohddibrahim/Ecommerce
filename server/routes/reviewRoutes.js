import express from 'express';
import {
  createReview,
  getProductReviews,
  deleteReview,
  updateReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// ✅ Get all reviews for a product
router.get('/:productId', getProductReviews);

// ✅ Submit a new review
router.post('/', protect, upload.single('media'), createReview);

// ✅ Delete a review (protected)
router.delete('/:id', protect, deleteReview);

// ✅ Update a review (with media support)
router.put('/:id', protect, upload.single('media'), updateReview);

export default router;
