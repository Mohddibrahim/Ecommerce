import express from 'express';
import {
  getProfile,
  updateProfile,
  getWishlist,
  addReview,
  getUserReviews,
  getUserAddresses,
  updateUserAddresses,
  addAddress,
  deleteAddress,
  deleteReviewByUser,
  updateReviewByUser,
  updateSellerAddress
} from '../controllers/userController.js';

import { protect, isAdmin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import upload from '../middleware/uploadMiddleware.js'; // ✅ import upload

const router = express.Router();

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.get('/wishlist', protect, getWishlist);

// ✅ Updated review routes with media support
router.post('/review/:productId', protect, upload.single('media'), addReview);
router.get('/reviews/mine', protect, getUserReviews);
router.put('/reviews/:id', protect, upload.single('media'), updateReviewByUser);
router.delete('/reviews/:id', protect, deleteReviewByUser);

// ✅ Address routes
router.get('/addresses', protect, getUserAddresses);
router.post('/addresses', protect, addAddress);
router.put('/addresses', protect, updateUserAddresses);
router.delete('/addresses/:index', protect, deleteAddress);

// ✅ Seller address update
router.patch('/seller/address', protect, updateSellerAddress);

// ✅ Admin-only: List all sellers
router.get('/sellers', protect, isAdmin, async (req, res) => {
  try {
    const sellers = await User.find({ role: 'seller' });
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch sellers' });
  }
});

export default router;
