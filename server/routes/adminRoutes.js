import express from 'express';
import {
  getComplaints,
  blockSeller,
  unblockSeller,
  deleteSeller
} from '../controllers/adminController.js';

import {
  getAllContacts as getContactMessages,
  deleteContact as deleteContactMessage
} from '../controllers/contactController.js';


import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/complaints', protect, isAdmin, getComplaints);
router.put('/seller/block/:id', protect, isAdmin, blockSeller);
router.put('/seller/unblock/:id', protect, isAdmin, unblockSeller); // ✅ THIS LINE
router.delete('/seller/:id', protect, isAdmin, deleteSeller);
router.get('/contact-messages', protect, isAdmin, getContactMessages);
router.delete('/contact-messages/:id', protect, isAdmin, deleteContactMessage);

export default router;
